
const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
const JSZip = require("jszip");
const { Readable } = require("stream");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Credential and authentication fields are never exported.
const isSensitiveField = (key) => {
  const normalized = String(key)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return (
    normalized.includes("password") ||
    normalized.includes("secret") ||
    normalized.includes("credential") ||
    normalized.endsWith("token") ||
    normalized.endsWith("apikey") ||
    normalized.endsWith("privatekey") ||
    [
      "passwd",
      "pwd",
      "salt",
      "otp",
      "jwt",
      "authorization",
      "cookie",
      "sessionid",
      "mongodburi",
      "connectionstring",
    ].includes(normalized)
  );
};

const convertSpecialValue = (value) => {
  if (value === null || value === undefined) return "";

  if (value instanceof Date) return value.toISOString();

  if (Buffer.isBuffer(value)) {
    return value.toString("base64");
  }

  if (typeof value === "bigint") return value.toString();

  if (value && value._bsontype) {
    if (
      value._bsontype === "Binary" &&
      Buffer.isBuffer(value.buffer)
    ) {
      return value.buffer.toString("base64");
    }

    return value.toString();
  }

  return value;
};

// Remove sensitive keys recursively, including inside nested objects.
const redactDeep = (value) => {
  if (value === null || value === undefined) return value;

  if (
    value instanceof Date ||
    Buffer.isBuffer(value) ||
    (value && value._bsontype)
  ) {
    return convertSpecialValue(value);
  }

  if (Array.isArray(value)) {
    return value.map(redactDeep);
  }

  if (typeof value === "object") {
    const result = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      if (!isSensitiveField(key)) {
        result[key] = redactDeep(nestedValue);
      }
    }

    return result;
  }

  return value;
};

const isPlainObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  !(value instanceof Date) &&
  !Buffer.isBuffer(value) &&
  !value._bsontype &&
  typeof value.toHexString !== "function";

// Convert nested documents into spreadsheet-friendly columns.
const flattenRecord = (document) => {
  const flattened = {};

  const visit = (value, prefix) => {
    if (value === undefined) return;
    if (prefix && isSensitiveField(prefix.split(".").pop())) return;

    if (value === null) {
      flattened[prefix] = "";
      return;
    }

    if (Array.isArray(value)) {
      flattened[prefix] = JSON.stringify(redactDeep(value));
      return;
    }

    if (isPlainObject(value)) {
      const entries = Object.entries(value).filter(
        ([key]) => !isSensitiveField(key)
      );

      if (!entries.length) {
        flattened[prefix] = "{}";
        return;
      }

      for (const [key, nestedValue] of entries) {
        visit(
          nestedValue,
          prefix ? `${prefix}.${key}` : key
        );
      }

      return;
    }

    flattened[prefix] = convertSpecialValue(value);
  };

  visit(document, "");

  delete flattened[""];

  return flattened;
};

// Prevent spreadsheet formula injection from imported database content.
const protectSpreadsheetValue = (value) => {
  if (typeof value !== "string") return value;

  return /^[\s]*[=+\-@]/.test(value)
    ? `'${value}`
    : value;
};

const csvCell = (value) => {
  let text = "";

  if (value !== null && value !== undefined) {
    text =
      typeof value === "string"
        ? value
        : String(value);
  }

  if (
    typeof value === "string" &&
    /^[\s]*[=+\-@]/.test(text)
  ) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
};

// Discover all application collections and views dynamically.
const getCollections = async () => {
  const database = mongoose.connection.db;

  if (!database) {
    throw new Error("MongoDB is not connected.");
  }

  const collections = await database
    .listCollections({})
    .toArray();

  return collections
    .filter(
      (item) =>
        item.name &&
        !item.name.startsWith("system.")
    )
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Discover every exportable column, without retaining all documents in memory.
const getCollectionFields = async (collection) => {
  const fields = new Set();

  const cursor = collection.find({}).batchSize(500);

  let hasDocuments = false;

  try {
    for await (const document of cursor) {
      hasDocuments = true;

      const flattened = flattenRecord(document);

      Object.keys(flattened).forEach((key) =>
        fields.add(key)
      );
    }
  } finally {
    await cursor.close();
  }

  if (!fields.size) {
    return [hasDocuments ? "_record" : "_id"];
  }

  const result = [...fields].sort((a, b) => {
    if (a === "_id") return -1;
    if (b === "_id") return 1;
    return a.localeCompare(b);
  });

  if (result.length > 16384) {
    throw new Error(
      `Collection ${collection.collectionName} exceeds Excel's column limit.`
    );
  }

  return result;
};

const getCellValues = (document, fields) => {
  const flattened = flattenRecord(document);

  if (
    fields.length === 1 &&
    fields[0] === "_record"
  ) {
    return ["Record exists; protected fields omitted"];
  }

  return fields.map((field) =>
    protectSpreadsheetValue(flattened[field] ?? "")
  );
};

const createWorksheetName = (
  rawName,
  suffix,
  usedNames
) => {
  const cleanName =
    String(rawName)
      .replace(/[\\/*?:\[\]]/g, "_")
      .replace(/^'+|'+$/g, "")
      .trim() || "Collection";

  let candidate =
    `${cleanName.slice(0, 31 - suffix.length)}${suffix}`;

  let counter = 2;

  while (usedNames.has(candidate.toLowerCase())) {
    const extra = `_${counter++}`;

    candidate =
      `${cleanName.slice(
        0,
        31 - suffix.length - extra.length
      )}${suffix}${extra}`;
  }

  usedNames.add(candidate.toLowerCase());

  return candidate;
};

const createWorksheet = (
  workbook,
  collectionName,
  part,
  fields,
  usedNames
) => {
  const suffix = part > 1 ? `_part${part}` : "";

  const worksheet = workbook.addWorksheet(
    createWorksheetName(
      collectionName,
      suffix,
      usedNames
    )
  );

  worksheet.columns = fields.map((field) => ({
    header: protectSpreadsheetValue(field),
    width: Math.min(
      Math.max(field.length + 2, 14),
      40
    ),
  }));

  worksheet.views = [
    { state: "frozen", ySplit: 1 },
  ];

  const header = worksheet.getRow(1);
  header.font = { bold: true };
  header.commit();

  return worksheet;
};

// Generate the complete Excel workbook.
const exportExcel = async (req, res) => {
  let temporaryDirectory;

  try {
    const collections = await getCollections();

    temporaryDirectory = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), "palette-export-")
    );

    const filePath = path.join(
      temporaryDirectory,
      "PALETTE_Full_Export.xlsx"
    );

    const workbook =
      new ExcelJS.stream.xlsx.WorkbookWriter({
        filename: filePath,
        useStyles: true,
        useSharedStrings: false,
      });

    workbook.creator = "PALETTE Administration";
    workbook.created = new Date();

    const usedNames = new Set();

    if (!collections.length) {
      const sheet = workbook.addWorksheet("Export Info");
      sheet.addRow(["Message"]).commit();
      sheet.addRow(["No application collections found."]).commit();
    }

    for (const item of collections) {
      const collection = mongoose.connection.db.collection(
        item.name
      );

      const fields = await getCollectionFields(collection);

      const MAX_DATA_ROWS = 1048575;

      let part = 1;
      let rowsInSheet = 0;

      let worksheet = createWorksheet(
        workbook,
        item.name,
        part,
        fields,
        usedNames
      );

      const cursor = collection.find({}).batchSize(500);

      try {
        for await (const document of cursor) {
          if (rowsInSheet >= MAX_DATA_ROWS) {
            part++;
            rowsInSheet = 0;

            worksheet = createWorksheet(
              workbook,
              item.name,
              part,
              fields,
              usedNames
            );
          }

          worksheet
            .addRow(getCellValues(document, fields))
            .commit();

          rowsInSheet++;
        }
      } finally {
        await cursor.close();
      }
    }

    await workbook.commit();

    const directoryToClean = temporaryDirectory;

    res.download(
      filePath,
      "PALETTE_Full_Export.xlsx",
      async (downloadError) => {
        await fs.promises.rm(
          directoryToClean,
          { recursive: true, force: true }
        );

        if (downloadError) {
          console.error(
            "Excel download error:",
            downloadError.message
          );

          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "Excel download failed.",
            });
          }
        }
      }
    );

    temporaryDirectory = null;
  } catch (error) {
    console.error("Excel export error:", error.message);

    if (temporaryDirectory) {
      await fs.promises.rm(
        temporaryDirectory,
        { recursive: true, force: true }
      );
    }

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Could not generate the Excel export.",
      });
    } else {
      res.destroy(error);
    }
  }
};

// Stream CSV content for one collection.
async function* generateCsvRows(collection, fields) {
  yield Buffer.from(
    fields.map(csvCell).join(",") + "\r\n"
  );

  const cursor = collection.find({}).batchSize(500);

  try {
    for await (const document of cursor) {
      const values = getCellValues(document, fields);

      yield Buffer.from(
        values.map(csvCell).join(",") + "\r\n"
      );
    }
  } finally {
    await cursor.close();
  }
}

const createZipFileName = (rawName, usedNames) => {
  const safeName =
    String(rawName)
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
      .replace(/^\.+/g, "")
      .trim() || "collection";

  let candidate = `${safeName}.csv`;
  let counter = 2;

  while (usedNames.has(candidate.toLowerCase())) {
    candidate = `${safeName}_${counter++}.csv`;
  }

  usedNames.add(candidate.toLowerCase());

  return candidate;
};

// Generate one CSV per collection, packaged in a ZIP.
const exportCsv = async (req, res) => {
  try {
    const collections = await getCollections();

    const zip = new JSZip();
    const usedFileNames = new Set();

    if (!collections.length) {
      zip.file(
        "README.csv",
        '"Message"\r\n"No application collections found."\r\n'
      );
    }

    for (const item of collections) {
      const collection = mongoose.connection.db.collection(
        item.name
      );

      const fields = await getCollectionFields(collection);

      zip.file(
        createZipFileName(item.name, usedFileNames),
        Readable.from(
          generateCsvRows(collection, fields)
        )
      );
    }

    res.setHeader(
      "Content-Type",
      "application/zip"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="PALETTE_Full_Export_CSV.zip"'
    );

    res.setHeader("Cache-Control", "no-store");

    const zipStream = zip.generateNodeStream({
      streamFiles: true,
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    zipStream.on("error", (error) => {
      console.error(
        "CSV ZIP export error:",
        error.message
      );

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Could not generate the CSV export.",
        });
      } else {
        res.destroy(error);
      }
    });

    zipStream.pipe(res);
  } catch (error) {
    console.error("CSV export error:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Could not generate the CSV export.",
      });
    } else {
      res.destroy(error);
    }
  }
};

module.exports = {
  exportExcel,
  exportCsv,
};
