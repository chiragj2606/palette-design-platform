
import { useCallback, useEffect, useState } from "react";
import "./AdminDashboard.css";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STAT_ITEMS = [
  { key: "totalUsers", label: "Registered users", icon: "â—Ž" },
  { key: "totalDesigns", label: "Published designs", icon: "â–§" },
  { key: "totalComments", label: "Comments", icon: "â˜°" },
  { key: "totalLikes", label: "Likes", icon: "â™¡" },
  { key: "totalFollows", label: "Follow relationships", icon: "â†—" },
  { key: "totalSaves", label: "Saved references", icon: "âŒ‘" },
  { key: "newUsersLast7Days", label: "New users Â· 7 days", icon: "+" },
];

function formatDate(value) {
  if (!value) return "â€”";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "â€”";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
}

export default function AdminDashboard({ token }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState("");
  const [exportError, setExportError] = useState("");

  const [employerRequests, setEmployerRequests] = useState([]);
  const [employerLoading, setEmployerLoading] = useState(true);
  const [employerError, setEmployerError] = useState("");
  const [employerNotice, setEmployerNotice] = useState("");
  const [employerStatusFilter, setEmployerStatusFilter] = useState("pending");
  const [reviewingEmployerId, setReviewingEmployerId] = useState("");
  const [reviewNotes, setReviewNotes] = useState({});

  const loadOverview = useCallback(async () => {
    if (!token) {
      setError("Please log in to access the dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/admin/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load dashboard information."
        );
      }

      setOverview(result);
    } catch (err) {
      setError(
        err.message || "Could not connect to the PALETTE backend."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);


const downloadExport = async (format) => {
  const exports = {
    excel: {
      endpoint: "/admin/export/excel",
      filename: "PALETTE_Full_Export.xlsx",
    },
    csv: {
      endpoint: "/admin/export/csv",
      filename: "PALETTE_Full_Export_CSV.zip",
    },
  };

  const selectedExport = exports[format];

  if (!selectedExport || !token) {
    setExportError("Please log in as an administrator.");
    return;
  }

  setExporting(format);
  setExportError("");

  try {
    const response = await fetch(
      `${API}${selectedExport.endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      let message = "Export failed. Please try again.";

      const contentType =
        response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const result = await response.json();
        message = result.message || message;
      }

      throw new Error(message);
    }

    const blob = await response.blob();

    if (!blob.size) {
      throw new Error("The export file is empty.");
    }

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = selectedExport.filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1000);
  } catch (err) {
    setExportError(
      err.message || "Could not download the export."
    );
  } finally {
    setExporting("");
  }
};

  const loadEmployerRequests = useCallback(async () => {
    if (!token) {
      setEmployerRequests([]);
      setEmployerError("Please log in as an administrator.");
      setEmployerLoading(false);
      return;
    }

    setEmployerLoading(true);
    setEmployerError("");

    try {
      const response = await fetch(
        `${API}/admin/employers?status=${encodeURIComponent(employerStatusFilter)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load employer verification requests."
        );
      }

      setEmployerRequests(
        Array.isArray(result.requests) ? result.requests : []
      );
    } catch (err) {
      setEmployerError(
        err.message || "Could not load employer verification requests."
      );
      setEmployerRequests([]);
    } finally {
      setEmployerLoading(false);
    }
  }, [token, employerStatusFilter]);

  const reviewEmployerRequest = async (userId, status) => {
    const reviewNote = (reviewNotes[userId] || "").trim();

    if (["rejected", "revoked"].includes(status) && !reviewNote) {
      setEmployerError(
        status === "rejected"
          ? "Add a reason before rejecting this request."
          : "Add a reason before revoking employer access."
      );
      return;
    }

    const actionLabel = {
      approved: "approve this employer",
      rejected: "reject this request",
      revoked: "revoke this employer's posting access",
    }[status];

    if (!window.confirm(`Are you sure you want to ${actionLabel}?`)) {
      return;
    }

    setReviewingEmployerId(userId);
    setEmployerError("");
    setEmployerNotice("");

    try {
      const response = await fetch(
        `${API}/admin/employers/${userId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, reviewNote }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not update employer access.");
      }

      setReviewNotes((previous) => {
        const next = { ...previous };
        delete next[userId];
        return next;
      });
      setEmployerNotice(result.message || `Employer status updated to ${status}.`);
      await loadEmployerRequests();
    } catch (err) {
      setEmployerError(err.message || "Could not update employer access.");
    } finally {
      setReviewingEmployerId("");
    }
  };

  useEffect(() => {
    loadEmployerRequests();
  }, [loadEmployerRequests]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  return (
    <section className="inner-page admin-dashboard-page">
      <div className="admin-dashboard-heading">
        <div>
          <div className="section-overline">
            PALETTE / ADMINISTRATION
          </div>

          <h1 className="inner-heading">
            The bigger<br />
            <em>picture.</em>
          </h1>

          <p className="inner-intro">
            Your overview of the people, projects, and activity
            shaping the PALETTE community.
          </p>
        </div>

        <div className="admin-dashboard-actions">
  <button
    type="button"
    className="button-outline admin-export-button"
    onClick={() => downloadExport("excel")}
    disabled={Boolean(exporting)}
  >
    {exporting === "excel" ? "PREPARING..." : "â†“ EXPORT EXCEL"}
  </button>

  <button
    type="button"
    className="button-outline admin-export-button"
    onClick={() => downloadExport("csv")}
    disabled={Boolean(exporting)}
  >
    {exporting === "csv" ? "PREPARING..." : "â†“ EXPORT CSV"}
  </button>

  <button
    type="button"
    className="button-outline admin-refresh-button"
    onClick={loadOverview}
    disabled={loading}
  >
    {loading ? "REFRESHING..." : "â†» REFRESH DATA"}
  </button>
</div>

{exportError && (
  <p className="admin-inline-error" role="alert">
    {exportError}
  </p>
)}
      </div>

      {loading && !overview ? (
        <div className="status-panel admin-status-panel">
          <strong>Gathering the picture...</strong>
          <p>Loading current information from PALETTE.</p>
        </div>
      ) : error && !overview ? (
        <div className="status-panel status-error admin-status-panel">
          <strong>Dashboard unavailable.</strong>
          <p>{error}</p>
          <button type="button" onClick={loadOverview}>
            TRY AGAIN â†—
          </button>
        </div>
      ) : overview ? (
        <>
          {error && (
            <p className="admin-inline-error" role="alert">
              Refresh failed: {error}
            </p>
          )}

          <div className="admin-section-heading">
            <div>
              <span className="section-overline">
                COMMUNITY PULSE
              </span>
              <h2>PALETTE at a glance</h2>
            </div>

            <span className="admin-live-label">
              <span aria-hidden="true" />
              LIVE DATABASE COUNTS
            </span>
          </div>

          <div className="admin-stats-grid">
            {STAT_ITEMS.map((item, index) => (
              <article
                className={`admin-stat-card ${
                  index === 0 ? "admin-stat-featured" : ""
                }`}
                key={item.key}
              >
                <div className="admin-stat-top">
                  <span className="admin-stat-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="admin-stat-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <strong className="admin-stat-value">
                  {formatNumber(overview.stats?.[item.key])}
                </strong>

                <span className="admin-stat-label">
                  {item.label}
                </span>
              </article>
            ))}
          </div>

          <section className="admin-panel admin-employer-panel">
            <div className="admin-panel-heading">
              <div>
                <span className="section-overline">
                  MARKET / TRUST &amp; SAFETY
                </span>
                <h2>Employer verification</h2>
                <p className="admin-employer-intro">
                  Review company details before granting permission to publish jobs.
                </p>
              </div>
              <span className="admin-panel-count">
                {employerRequests.length} {employerStatusFilter} shown
              </span>
            </div>

            <div className="admin-employer-toolbar">
              <div className="admin-employer-filters" role="group" aria-label="Filter employer requests">
                {["pending", "approved", "rejected", "revoked"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`button-outline admin-employer-filter ${
                      employerStatusFilter === status ? "is-active" : ""
                    }`}
                    aria-pressed={employerStatusFilter === status}
                    disabled={employerLoading || Boolean(reviewingEmployerId)}
                    onClick={() => {
                      setEmployerNotice("");
                      setEmployerStatusFilter(status);
                    }}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="button-outline admin-employer-refresh"
                onClick={loadEmployerRequests}
                disabled={employerLoading || Boolean(reviewingEmployerId)}
              >
                {employerLoading ? "LOADING..." : "↻ REFRESH REQUESTS"}
              </button>
            </div>

            {employerError && (
              <p className="admin-inline-error" role="alert">
                {employerError}
              </p>
            )}

            {employerNotice && (
              <p className="admin-employer-notice" role="status">
                {employerNotice}
              </p>
            )}

            {employerLoading ? (
              <p className="admin-empty-state">Loading employer requests...</p>
            ) : employerRequests.length === 0 ? (
              <p className="admin-empty-state">
                No {employerStatusFilter} employer requests found.
              </p>
            ) : (
              <div className="admin-employer-list">
                {employerRequests.map((request) => {
                  const verification = request.employerVerification || {};
                  const isReviewing = reviewingEmployerId === request._id;

                  return (
                    <article className="admin-employer-card" key={request._id}>
                      <div className="admin-employer-card-heading">
                        <div>
                          <span className="section-overline">COMPANY / APPLICANT</span>
                          <h3>{verification.companyName || "Unnamed company"}</h3>
                          <p>
                            {request.name || request.username || "PALETTE member"}
                            {request.username ? ` (@${request.username})` : ""}
                          </p>
                          <a href={`mailto:${request.email}`}>{request.email}</a>
                        </div>
                        <span className={`admin-role-pill admin-employer-status admin-employer-status-${verification.status || "pending"}`}>
                          {(verification.status || "pending").replace("_", " ").toUpperCase()}
                        </span>
                      </div>

                      <div className="admin-employer-details">
                        <div>
                          <span>BUSINESS EMAIL</span>
                          <a href={`mailto:${verification.companyEmail || ""}`}>
                            {verification.companyEmail || "Not provided"}
                          </a>
                        </div>
                        <div>
                          <span>POSITION</span>
                          <strong>{verification.jobTitle || "Not provided"}</strong>
                        </div>
                        <div>
                          <span>SUBMITTED</span>
                          <strong>{formatDate(verification.submittedAt)}</strong>
                        </div>
                        <div>
                          <span>COMPANY WEBSITE</span>
                          {verification.companyWebsite ? (
                            <a href={verification.companyWebsite} target="_blank" rel="noopener noreferrer">
                              Open company website ↗
                            </a>
                          ) : (
                            <strong>Not provided</strong>
                          )}
                        </div>
                        <div>
                          <span>VERIFICATION EVIDENCE</span>
                          {verification.proofUrl ? (
                            <a href={verification.proofUrl} target="_blank" rel="noopener noreferrer">
                              Review evidence ↗
                            </a>
                          ) : (
                            <strong>Not provided</strong>
                          )}
                        </div>
                      </div>

                      {verification.notes && (
                        <div className="admin-employer-notes">
                          <span>APPLICANT NOTES</span>
                          <p>{verification.notes}</p>
                        </div>
                      )}

                      {verification.reviewNote && employerStatusFilter !== "pending" && (
                        <div className="admin-employer-notes">
                          <span>PREVIOUS ADMIN REVIEW NOTE</span>
                          <p>{verification.reviewNote}</p>
                        </div>
                      )}

                      {(employerStatusFilter === "pending" || employerStatusFilter === "approved") && (
                        <div className="admin-employer-review">
                          <label>
                            <span>ADMIN REVIEW NOTE</span>
                            <textarea
                              rows={2}
                              maxLength={1000}
                              value={reviewNotes[request._id] || ""}
                              onChange={(event) =>
                                setReviewNotes((previous) => ({
                                  ...previous,
                                  [request._id]: event.target.value,
                                }))
                              }
                              placeholder={
                                employerStatusFilter === "pending"
                                  ? "Optional for approval; required for rejection."
                                  : "Required to explain why employer access is being revoked."
                              }
                              disabled={isReviewing}
                            />
                          </label>

                          <div className="admin-employer-actions">
                            {employerStatusFilter === "pending" ? (
                              <>
                                <button
                                  type="button"
                                  className="button-dark"
                                  onClick={() => reviewEmployerRequest(request._id, "approved")}
                                  disabled={isReviewing}
                                >
                                  {isReviewing ? "UPDATING..." : "APPROVE EMPLOYER"}
                                </button>
                                <button
                                  type="button"
                                  className="button-outline admin-employer-danger"
                                  onClick={() => reviewEmployerRequest(request._id, "rejected")}
                                  disabled={isReviewing || !(reviewNotes[request._id] || "").trim()}
                                >
                                  REJECT REQUEST
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="button-outline admin-employer-danger"
                                onClick={() => reviewEmployerRequest(request._id, "revoked")}
                                disabled={isReviewing || !(reviewNotes[request._id] || "").trim()}
                              >
                                REVOKE POSTING ACCESS
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <div className="admin-activity-grid">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="section-overline">
                    THE COMMUNITY
                  </span>
                  <h2>Recent members</h2>
                </div>
                <span className="admin-panel-count">
                  {overview.recentUsers?.length || 0} shown
                </span>
              </div>

              {overview.recentUsers?.length ? (
                <div className="admin-table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>MEMBER</th>
                        <th>ROLE</th>
                        <th>JOINED</th>
                      </tr>
                    </thead>

                    <tbody>
                      {overview.recentUsers.map((member) => (
                        <tr key={member._id}>
                          <td>
                            <div className="admin-member">
                              {member.profileImage ? (
                                <img
                                  className="admin-avatar"
                                  src={member.profileImage}
                                  alt=""
                                />
                              ) : (
                                <span className="admin-avatar admin-avatar-fallback">
                                  {(member.name || member.username || "P")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}

                              <div className="admin-member-details">
                                <strong>
                                  {member.name || member.username}
                                </strong>
                                <span>
                                  @{member.username || "unknown"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`admin-role-pill ${
                                member.role === "admin"
                                  ? "admin-role-pill-admin"
                                  : ""
                              }`}
                            >
                              {member.role || "user"}
                            </span>
                          </td>

                          <td className="admin-date">
                            {formatDate(member.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="admin-empty-state">
                  No members to display yet.
                </p>
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="section-overline">
                    CREATIVE OUTPUT
                  </span>
                  <h2>Latest projects</h2>
                </div>

                <span className="admin-panel-count">
                  {overview.recentDesigns?.length || 0} shown
                </span>
              </div>

              {overview.recentDesigns?.length ? (
                <div className="admin-project-list">
                  {overview.recentDesigns.map((design) => (
                    <article
                      className="admin-project-row"
                      key={design._id}
                    >
                      {design.imageUrl ? (
                        <img
                          className="admin-project-image"
                          src={design.imageUrl}
                          alt=""
                        />
                      ) : (
                        <div className="admin-project-image admin-project-placeholder">
                          P.
                        </div>
                      )}

                      <div className="admin-project-details">
                        <strong>{design.title}</strong>
                        <span>
                          {design.category || "Uncategorised"}
                        </span>
                        <span>
                          By{" "}
                          {design.creator?.username ||
                            design.creator?.name ||
                            "Unknown creator"}
                        </span>
                      </div>

                      <div className="admin-project-meta">
                        <span>â™¡ {formatNumber(design.likes)}</span>
                        <time>{formatDate(design.createdAt)}</time>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="admin-empty-state">
                  No published projects yet.
                </p>
              )}
            </section>
          </div>

          <p className="admin-dashboard-footnote">
            Statistics are calculated from the PALETTE database.
            Recent activity shows the latest five records in each list.
          </p>
        </>
      ) : null}
    </section>
  );
}