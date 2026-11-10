const express = require("express");
const router = express.Router();

// This adapter supports the common CommonJS/default-export middleware patterns.
const authModule = require("../middleware/authMiddleware");
const protect =
  authModule.default ||
  authModule.protect ||
  authModule.authMiddleware ||
  authModule;

if (typeof protect !== "function") {
  throw new Error(
    "Learn routes could not find an auth middleware function in src/middleware/authMiddleware.js. Check its export."
  );
}

const LearnProgress = require("../models/learnProgress");
const LearnDailyPack = require("../models/learnDailyPack");
const User = require("../models/user");

router.use(protect);

function getUserId(req) {
  return req.user?.userId || req.user?._id || req.user?.id;
}

function cleanProgress(input) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const asArray = (value, limit = 500) => Array.isArray(value) ? value.slice(-limit) : [];
  const asNumber = (value, max = 1_000_000) => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.floor(n))) : 0;
  };
  return {
    ...source,
    xp: asNumber(source.xp),
    weeklyXp: asNumber(source.weeklyXp, 250_000),
    gems: asNumber(source.gems, 1_000_000),
    hearts: asNumber(source.hearts, 5),
    streak: asNumber(source.streak, 100_000),
    completedLessonIds: asArray(source.completedLessonIds, 2_000),
    completedActivityIds: asArray(source.completedActivityIds, 2_000),
    mistakes: asArray(source.mistakes, 200),
    attempts: asArray(source.attempts, 200),
    reviewCards: asArray(source.reviewCards, 200),
    seenQuestionIds: asArray(source.seenQuestionIds, 500),
    ownedOutfits: asArray(source.ownedOutfits, 50),
    storiesCompleted: asArray(source.storiesCompleted, 500),
    questClaimed: asArray(source.questClaimed, 20),
    questCounts: source.questCounts && typeof source.questCounts === "object" ? source.questCounts : {},
    dailyCompleted: source.dailyCompleted && typeof source.dailyCompleted === "object" ? source.dailyCompleted : {},
  };
}

function extractResponseText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const chunks = [];
  for (const item of payload?.output || []) {
    if (item.type !== "message") continue;
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        chunks.push(content.text);
      }
    }
  }
  return chunks.join("\n");
}

async function callOpenAI({ system, prompt, maxOutputTokens = 1800 }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!apiKey || !model) return null;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions: system,
      input: prompt,
      max_output_tokens: maxOutputTokens,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `AI provider returned HTTP ${response.status}`;
    throw new Error(message);
  }

  const output = extractResponseText(payload).trim();
  if (!output) throw new Error("The AI provider returned an empty response.");
  return output;
}

function validateDailyPack(value, date, level) {
  if (!value || typeof value !== "object") throw new Error("Daily content was not an object.");
  const quiz = Array.isArray(value.quiz) ? value.quiz.slice(0, 5) : [];
  if (quiz.length < 5) throw new Error("Daily quiz needs five questions.");

  const safeQuiz = quiz.map((q, index) => {
    if (!q || typeof q.question !== "string" || !Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Daily question ${index + 1} is malformed.`);
    }
    const answerIndex = Number(q.answerIndex);
    if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) {
      throw new Error(`Daily question ${index + 1} has an invalid answer index.`);
    }
    return {
      id: String(q.id || `${date}-ai-${index}`),
      topic: String(q.topic || "UI/UX design"),
      question: q.question.slice(0, 700),
      options: q.options.map((option) => String(option).slice(0, 300)),
      answerIndex,
      explanation: String(q.explanation || "Review the design principle and consider the user task.").slice(0, 1200),
      hint: String(q.hint || "Compare each option against the user's task and the design context.").slice(0, 500),
      difficulty: String(q.difficulty || level),
    };
  });

  const mission = value.mission && typeof value.mission === "object" ? value.mission : {};
  const creative = value.creative && typeof value.creative === "object" ? value.creative : {};
  const story = value.story && typeof value.story === "object" ? value.story : {};
  const flashcards = Array.isArray(value.flashcards) ? value.flashcards.slice(0, 4) : [];
  if (!mission.title || !mission.prompt || !creative.title || !creative.prompt) {
    throw new Error("Daily mission or creative challenge is missing.");
  }

  return {
    date,
    difficulty: level,
    source: "AI-generated and cached for today",
    quiz: safeQuiz,
    mission: {
      title: String(mission.title).slice(0, 100),
      prompt: String(mission.prompt).slice(0, 700),
      topic: String(mission.topic || "Design practice").slice(0, 80),
      task: String(mission.task || "Identify the user goal, explain the issue and propose a practical improvement.").slice(0, 700),
    },
    creative: {
      title: String(creative.title).slice(0, 100),
      prompt: String(creative.prompt).slice(0, 800),
      topic: String(creative.topic || "Creative practice").slice(0, 80),
      deliverable: String(creative.deliverable || "Submit a short explanation of your design decisions.").slice(0, 700),
    },
    story: {
      id: String(story.id || `${date}-story`),
      title: String(story.title || "A design decision to make").slice(0, 100),
      tag: String(story.tag || "Design story").slice(0, 40),
      minutes: Number(story.minutes) || 4,
      text: String(story.text || mission.prompt).slice(0, 1500),
      question: String(story.question || mission.prompt).slice(0, 500),
      options: Array.isArray(story.options) && story.options.length === 4 ? story.options.map(String) : ["Clarify the user goal", "Add decoration first", "Remove useful feedback", "Copy another product"],
      answerIndex: Number.isInteger(Number(story.answerIndex)) ? Math.max(0, Math.min(3, Number(story.answerIndex))) : 0,
      explanation: String(story.explanation || mission.task || "Connect your design decision to a user need."),
    },
    flashcards: flashcards.length ? flashcards.map((card, index) => ({ id: String(card.id || `${date}-fc-${index}`), front: String(card.front || "Recall the design principle"), back: String(card.back || "Explain the principle and give a product example.") })) : [],
  };
}

async function generateDailyPack({ userId, date, level }) {
  const previous = await LearnDailyPack.find({ user: userId, date: { $lt: date } })
    .sort({ date: -1 })
    .limit(10)
    .select("pack.quiz.question pack.mission.title pack.creative.title")
    .lean();
  const previousTopics = previous.flatMap((entry) => [
    ...(entry.pack?.quiz || []).map((question) => question.question),
    entry.pack?.mission?.title,
    entry.pack?.creative?.title,
  ]).filter(Boolean).slice(0, 55);

  const system = [
    "You are PALETTE's expert UI/UX design tutor. Create pedagogically sound, original activities for adult designers.",
    "Return ONLY valid JSON. Do not use markdown fences.",
    "Avoid reusing the exact questions, scenarios, titles or phrasing from the prior-content list.",
    "Every multiple-choice question must have exactly four plausible options and exactly one correct answer. answerIndex is zero-based.",
    "Explanations must teach the principle and explain why the correct choice is best. Hints must help without revealing the answer.",
    "Avoid subjective questions without a defensible answer. Cover a variety of UI/UX topics and real product scenarios.",
  ].join(" ");

  const prompt = JSON.stringify({
    task: "Create one full daily UI/UX learning pack for PALETTE.",
    localDate: date,
    learnerLevel: level,
    requestedFormat: {
      quiz: "Exactly five questions. Each object: id, topic, question, options (four strings), answerIndex (0-3), explanation, hint, difficulty.",
      mission: "Object with title, prompt, topic, task. A realistic fix-or-diagnose interface problem.",
      creative: "Object with title, prompt, topic, deliverable. A small practical design creation task.",
      story: "Object with id, title, tag, minutes, text, question, options (four strings), answerIndex, explanation. A short realistic product-design story.",
      flashcards: "Array of three objects with id, front, back. Short retrieval-practice concepts.",
    },
    priorContentToAvoid: previousTopics,
  });

  const output = await callOpenAI({ system, prompt, maxOutputTokens: 2600 });
  if (!output) return null;
  let parsed;
  try { parsed = JSON.parse(output); }
  catch {
    const first = output.indexOf("{"); const last = output.lastIndexOf("}");
    if (first < 0 || last <= first) throw new Error("AI daily pack was not valid JSON.");
    parsed = JSON.parse(output.slice(first, last + 1));
  }
  return validateDailyPack(parsed, date, level);
}

router.get("/progress", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });
    const record = await LearnProgress.findOne({ user: userId }).lean();
    return res.json({ success: true, progress: record?.state || null });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load Learn progress." });
  }
});

router.put("/progress", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });
    const progress = cleanProgress(req.body?.progress);
    const record = await LearnProgress.findOneAndUpdate(
      { user: userId },
      { $set: { state: progress } },
      { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();
    return res.json({ success: true, progress: record.state });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not save Learn progress." });
  }
});

router.get("/daily", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });
    const date = typeof req.query.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
      ? req.query.date
      : new Date().toISOString().slice(0, 10);
    const level = ["Beginner", "Intermediate", "Advanced"].includes(req.query.level) ? req.query.level : "Beginner";

    const cached = await LearnDailyPack.findOne({ user: userId, date }).lean();
    if (cached?.pack) return res.json({ success: true, pack: cached.pack, cached: true });

    const generated = await generateDailyPack({ userId, date, level });
    if (!generated) return res.status(503).json({ success: false, message: "AI generation is not configured. The client will use its rotating built-in content bank." });

    const saved = await LearnDailyPack.findOneAndUpdate(
      { user: userId, date },
      { $set: { level, pack: generated, source: generated.source } },
      { returnDocument: "after", upsert: true, runValidators: true }
    ).lean();
    return res.json({ success: true, pack: saved.pack, cached: false });
  } catch (error) {
    console.error("Learn daily pack error:", error.message);
    return res.status(503).json({ success: false, message: "Daily content is temporarily unavailable." });
  }
});

function getRoleplayFallbackReply({ scenario, messages }) {
  const latestMessage = [...messages]
    .reverse()
    .find((message) => message.role === "learner")?.text || "";

  const text = latestMessage.toLowerCase();

  if (!text.trim()) {
    return "Welcome! I'm excited to work with you on this design project. What would you like to understand about my users or the product first?";
  }

  if (/\b(hi|hello|hey|good morning|good evening)\b/.test(text)) {
    return "Hello! I'm glad we're working together. I'm looking for a simple, welcoming experience for our users. What would you like to know about the project before we begin?";
  }

  if (/\b(user|users|audience|persona|customer|customers|people|target audience|research|interview)\b/.test(text)) {
    return "Our main audience is busy people who want to build a consistent mindfulness habit. Many are beginners and may not know where to start. They need something simple, encouraging and easy to understand. How would you learn more about their everyday routines and needs?";
  }

  if (/\b(frustrat\w*|pain points?|problems?|difficulties|struggles?|challenges?|issues?)\b/.test(text)) {
    return "Our biggest frustration is that existing wellness apps can feel overwhelming. Users see too many choices and sometimes give up before starting. We need to make the first useful action obvious. How would you identify which problem deserves the most attention?";
  }

  if (/\b(goal|goals|objective|success|outcome|purpose|measure|metric)\b/.test(text)) {
    return "Our main goal is to help beginners complete a short mindfulness session and gradually build a daily habit. We would measure success through first-session completion, returning users and consistent engagement. Which of these outcomes would you prioritise for the first version?";
  }

  if (/\b(onboard|onboarding|signup|sign up|register|first time|first experience|welcome)\b/.test(text)) {
    return "I want first-time users to understand the app quickly without filling out a long form. Ideally, they should discover the main benefit and start their first short session within a few moments. How would you design that first experience?";
  }

  if (/\b(accessib|contrast|screen reader|disabilit|readab|font size|colour blindness|color blindness)\b/.test(text)) {
    return "Accessibility is important to us because everyone should be able to use the app comfortably. We need readable typography, sufficient colour contrast, clear labels and controls that work with assistive technology. How would you check these things during the design process?";
  }

  if (/\b(colou?r|palette|visual|brand|aesthetic|style|mood|theme)\b/.test(text)) {
    return "I'd like the visual identity to feel calm, trustworthy and welcoming rather than clinical or overwhelming. Soft colours could help, but readability and accessibility must come first. What visual direction would you recommend, and why?";
  }

  if (/\b(layout|navigation|menu|wireframe|screen|hierarchy|structure|organis)\b/.test(text)) {
    return "I want users to understand where they are and what to do next without having to think too much. The main action should be easy to find, and navigation should stay simple. How would you organise the most important elements on the home screen?";
  }

  if (/\b(feature|features|functionality|function|must.have|priority|priorit)\b/.test(text)) {
    return "For our first version, I think we need guided mindfulness sessions, a simple progress view and gentle reminders. I'm worried about adding too many features too early. Which features would you keep in the MVP, and which would you postpone?";
  }

  if (/\b(test|testing|prototype|usability|feedback|user test|validate)\b/.test(text)) {
    return "I'd like to see how real beginners use the design before we launch. We could ask them to find and start a mindfulness session while observing where they hesitate. What tasks would you include in a usability test?";
  }

  if (/\b(privacy|data|personal information|security|trust)\b/.test(text)) {
    return "Trust is very important to our users. We should collect only the information we genuinely need, explain why we need it and make privacy choices understandable. How would you communicate this without making the experience feel complicated?";
  }

  if (/\b(deadline|budget|time|resource|constraint|mvp)\b/.test(text)) {
    return "We have limited time and resources, so I'd prefer a focused first version rather than a large product. The essential experience should work really well before we expand. How would you decide what belongs in the initial release?";
  }

  return `That's an interesting point about our project. I want the experience to stay simple, welcoming and useful for beginners. Could you explain how your suggestion would improve the user's experience, and how we could test whether it works?`;
}

router.post("/roleplay", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });
    const scenario = typeof req.body?.scenario === "string" ? req.body.scenario.slice(0, 600) : "A product design client discovery meeting";
    const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(-8).map((message) => ({ role: ["learner", "user", "you"].includes(
  String(message.role || "").toLowerCase()
) ? "learner" : "client", text: String(message.text || "").slice(0, 1000) })) : [];
    const reply = getRoleplayFallbackReply({ scenario, messages });

return res.json({
  success: true,
  reply,
  aiEnabled: false,
});
  } catch (error) {
    return res.status(503).json({ success: false, message: "Roleplay is temporarily unavailable." });
  }
});

router.get("/league", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });
    const records = await LearnProgress.find({ "state.weeklyXp": { $gt: 0 } })
      .sort({ "state.weeklyXp": -1, updatedAt: 1 })
      .limit(20)
      .select("user state.weeklyXp")
      .lean();
    const ids = records.map((record) => record.user);
    const users = await User.find({ _id: { $in: ids } }).select("name username profileImage").lean();
    const byId = new Map(users.map((person) => [String(person._id), person]));
    const rows = records.map((record) => {
      const person = byId.get(String(record.user)) || {};
      return {
        userId: String(record.user),
        name: person.name || person.username || "PALETTE learner",
        profileImage: person.profileImage || "",
        weeklyXp: Number(record.state?.weeklyXp) || 0,
        isCurrentUser: String(record.user) === String(userId),
      };
    });
    return res.json({ success: true, rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load the weekly league." });
  }
});

module.exports = router;
