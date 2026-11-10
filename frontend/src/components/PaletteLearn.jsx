import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./PaletteLearn.css";

const STORAGE_PREFIX = "palette_learn_v3";
const HEART_LIMIT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

const MODULES = [
  {
    id: "foundations", title: "Design foundations", subtitle: "Learn to see like a designer", icon: "◈", color: "violet", level: "Beginner",
    lessons: [
      { id: "visual-hierarchy", title: "Visual hierarchy", minutes: 4, xp: 10, explain: "Visual hierarchy guides attention. Size, weight, contrast, spacing and placement tell people what to notice first.", question: "A dashboard has one primary action. What is the strongest way to make it easy to find?", options: ["Give it clear visual emphasis", "Make every button equally bold", "Hide it below the fold", "Use a different font for every label"], answer: 0, feedback: "A clear primary action gives the screen a visual starting point. Supporting actions should be quieter.", challenge: "Open an app you use. Identify its first visual focal point and explain what makes it stand out." },
      { id: "contrast", title: "Contrast and emphasis", minutes: 5, xp: 10, explain: "Contrast creates distinction through colour, size, weight, shape, texture or spacing. It helps users separate information and recognise interactive elements.", question: "Which change most improves the visibility of small text on a light background?", options: ["Use a lighter grey", "Increase foreground/background contrast", "Reduce the font size", "Place text over a busy image"], answer: 1, feedback: "Higher contrast makes text easier to distinguish. Check the actual foreground and background colours rather than relying on colour names." },
    ],
  },
  {
    id: "elements", title: "Design elements", subtitle: "The building blocks of visual design", icon: "✳", color: "orange", level: "Beginner",
    lessons: [
      { id: "elements-shape", title: "Line, shape and form", minutes: 5, xp: 10, explain: "Lines guide the eye, shapes define boundaries and forms suggest volume. UI designers use them in icons, cards, controls and illustrations.", question: "Which visual element creates the outline and silhouette of a button?", options: ["Shape", "Sound", "Database", "Latency"], answer: 0, feedback: "The button's shape defines its visible boundary and helps communicate its role." },
      { id: "space-balance", title: "Space and balance", minutes: 5, xp: 10, explain: "Negative space is the room around and between elements. Balance describes how visual weight is distributed across a composition.", question: "Why is consistent spacing useful in a mobile interface?", options: ["It makes screens busier", "It removes the need for grouping", "It improves scanning and separates content", "It makes all elements identical"], answer: 2, feedback: "Consistent spacing creates rhythm and makes relationships between elements easier to understand." },
    ],
  },
  {
    id: "colour", title: "Colour theory", subtitle: "Build palettes with purpose", icon: "◉", color: "pink", level: "Beginner",
    lessons: [
      { id: "colour-wheel", title: "The colour wheel", minutes: 5, xp: 10, explain: "The colour wheel maps relationships between hues. Designers use it to explore complementary, analogous, triadic and other colour relationships.", question: "Where do complementary colours sit on a traditional colour wheel?", options: ["Beside each other", "Opposite each other", "Only in the neutral range", "At the centre"], answer: 1, feedback: "Complementary colours sit opposite each other and usually create strong contrast." },
      { id: "colour-system", title: "Colour roles and systems", minutes: 6, xp: 12, explain: "A UI colour system assigns roles such as primary, surface, text, border, success, warning and danger. Semantic roles make interfaces consistent and easier to maintain.", question: "Why use semantic colour tokens such as `text-primary` and `surface-muted`?", options: ["To hard-code every colour in every screen", "To make colour usage consistent and maintainable", "To avoid checking contrast", "To make every component use one colour"], answer: 1, feedback: "Semantic tokens connect colour values to their purpose. A theme can then change without rewriting every component." },
    ],
  },
  {
    id: "type", title: "Typography", subtitle: "Make information effortless to read", icon: "Tt", color: "blue", level: "Beginner",
    lessons: [
      { id: "type-hierarchy", title: "Typography hierarchy", minutes: 5, xp: 10, explain: "Typography hierarchy uses size, weight, spacing and placement to distinguish headings, body text, labels and supporting content.", question: "What most clearly distinguishes a page heading from body copy?", options: ["Give both identical styling", "Use a deliberate difference in size and weight", "Remove all spacing", "Use a decorative font for every line"], answer: 1, feedback: "A clear hierarchy helps people scan content and understand what is most important." },
      { id: "type-readability", title: "Readable type on screens", minutes: 5, xp: 10, explain: "Readable interface typography considers font size, line length, line height, contrast and responsive scaling. Display type can be expressive; utility text must remain clear.", question: "A paragraph is difficult to read on mobile. Which is a sensible first check?", options: ["Increase line length", "Check font size, line height and contrast", "Use all caps", "Reduce the space between every line"], answer: 1, feedback: "Readability is affected by several variables. Check size, line height and contrast together." },
    ],
  },
  {
    id: "layout", title: "Layout, grid and spacing", subtitle: "Create order and rhythm", icon: "▦", color: "green", level: "Intermediate",
    lessons: [
      { id: "grid", title: "Grid systems", minutes: 6, xp: 12, explain: "Grids provide repeatable columns, gutters and margins. They help align content and adapt layouts across screen sizes.", question: "What is the main purpose of a grid in interface design?", options: ["To force every page into the same content", "To create consistent alignment and structure", "To replace responsive design", "To make content decorative"], answer: 1, feedback: "A grid provides structure while leaving room for intentional variation." },
      { id: "responsive", title: "Responsive composition", minutes: 6, xp: 12, explain: "Responsive layouts adapt to available space. Content priority, flexible containers, breakpoints and touch targets all influence the design.", question: "On a narrow screen, what should guide decisions about rearranging a desktop layout?", options: ["Preserve every desktop column", "Prioritise content and user tasks", "Shrink every item equally", "Remove all headings"], answer: 1, feedback: "Responsive design is about preserving usability and hierarchy, not merely shrinking the desktop screen." },
    ],
  },
  {
    id: "components", title: "UI components and systems", subtitle: "Design consistent, reusable interfaces", icon: "▣", color: "violet", level: "Intermediate",
    lessons: [
      { id: "component-states", title: "Component states", minutes: 6, xp: 12, explain: "Interactive components need states such as default, hover, focus, pressed, disabled, loading and error. State design makes feedback predictable.", question: "Which state is especially important for keyboard users navigating a button?", options: ["Focus", "Decorative", "Hidden", "Static"], answer: 0, feedback: "A visible focus state helps keyboard users understand which control is currently active." },
      { id: "design-tokens", title: "Design tokens", minutes: 7, xp: 14, explain: "Design tokens store shared values for colour, spacing, type, radius and elevation. They help maintain consistency across components and themes.", question: "A team changes its brand's primary colour. What makes that update easiest across a design system?", options: ["Edit every screen manually", "Use a shared semantic colour token", "Remove all component styles", "Create a separate colour for every button"], answer: 1, feedback: "A shared token lets connected components inherit the new value consistently." },
    ],
  },
  {
    id: "ux", title: "UX research and psychology", subtitle: "Understand people before pixels", icon: "⌕", color: "orange", level: "Intermediate",
    lessons: [
      { id: "user-needs", title: "Understand user needs", minutes: 6, xp: 12, explain: "UX research explores user goals, behaviours, contexts and constraints. It helps teams test assumptions instead of designing from guesses.", question: "Before redesigning a banking app, what is a useful first step?", options: ["Choose decorative colours", "Understand users and their banking tasks", "Add as many features as possible", "Copy a competitor"], answer: 1, feedback: "Research starts with people and the tasks they need to complete." },
      { id: "wireframes", title: "Think in wireframes", minutes: 7, xp: 14, explain: "Usability testing observes people attempting realistic tasks. The aim is to discover friction and improve the experience, not to test the participant.", question: "During a usability test, what should a facilitator do when a participant hesitates?", options: ["Immediately tell them what to click", "Observe and note where the experience becomes unclear", "End the test", "Assume the participant is wrong"], answer: 1, feedback: "Observation reveals the point of friction. Avoid leading the participant toward the intended answer." },
    ],
  },
  {
    id: "interaction", title: "Interaction and prototyping", subtitle: "Make flows feel clear and responsive", icon: "↗", color: "blue", level: "Advanced", lessons: [
      { id: "flows", title: "User flows", minutes: 7, xp: 14, explain: "User flows map the steps, decisions and system responses involved in completing a task. They reveal unnecessary steps and missing states.", question: "A checkout flow has repeated steps that ask for the same information. What should the designer investigate?", options: ["Whether the duplicated steps can be removed", "How to add more screens", "How to hide the progress indicator", "How to make every field mandatory"], answer: 0, feedback: "Reducing unnecessary repetition can make a task easier and faster to complete." },
      { id: "microinteractions", title: "Microinteractions", minutes: 7, xp: 14, explain: "Microinteractions are small moments of feedback around an action, such as saving, toggling, validation or loading. They make system behaviour understandable.", question: "After a user taps Save, what should a well-designed interface communicate?", options: ["Nothing", "Whether the save action succeeded or is still processing", "Only a decorative animation", "A new unrelated task"], answer: 1, feedback: "Useful feedback confirms the result or communicates progress." },
    ],
  },
  {
    id: "accessibility", title: "Accessibility and inclusive design", subtitle: "Design for more people", icon: "◎", color: "pink", level: "Advanced", lessons: [
      { id: "contrast-accessibility", title: "Contrast and accessible colour", minutes: 6, xp: 14, explain: "Text and controls need sufficient contrast. Colour should not be the only way to communicate meaning; pair it with text, shape, icons or patterns.", question: "How should an error be communicated accessibly?", options: ["Only with a red border", "With colour plus a clear message or icon", "With a faint animation", "Without any explanation"], answer: 1, feedback: "Combining cues means people do not have to rely on colour alone." },
      { id: "inclusive-input", title: "Inclusive interaction", minutes: 7, xp: 14, explain: "Inclusive interfaces support different input methods, readable content, clear labels, predictable focus and forgiving error recovery.", question: "Which form design is most inclusive?", options: ["Inputs with placeholder-only labels", "Clearly labelled fields with helpful error messages", "Tiny controls with no focus state", "Instructions communicated only by colour"], answer: 1, feedback: "Persistent labels and specific feedback help people understand and recover from errors." },
    ],
  },
  {
    id: "portfolio", title: "Portfolio practice", subtitle: "Turn design decisions into a story", icon: "▤", color: "green", level: "Advanced", lessons: [
      { id: "case-studies", title: "Tell the project story", minutes: 6, xp: 15, explain: "A useful case study explains the problem, your role, the process, important trade-offs, the outcome and what you learned. It distinguishes your contribution from the team's work.", question: "What makes a portfolio case study more useful to a hiring manager?", options: ["Only polished screenshots", "Explaining the problem and your design decisions", "Listing tools without context", "Hiding your role in the project"], answer: 1, feedback: "Showing your reasoning helps others understand how you approach design problems." },
      { id: "iterate", title: "Improve through feedback", minutes: 6, xp: 15, explain: "Design is iterative. Feedback and usability testing reveal where people struggle, helping designers refine a solution instead of assuming the first version is perfect.", question: "After users struggle with a prototype task, what should you do?", options: ["Ignore the feedback", "Investigate the problem and test an improvement", "Assume users are wrong", "Remove the entire product"], answer: 1, feedback: "Investigating feedback and testing improvements is central to iterative design." },
    ],
  },
];

const QUESTION_BANK = [
  { id: "q-hierarchy-1", topic: "Visual hierarchy", question: "A page has three competing calls to action. What should the designer do first?", options: ["Establish one primary action", "Make all actions equally prominent", "Remove all labels", "Add more decoration"], answerIndex: 0, explanation: "A clear primary action establishes priority. Secondary actions should remain available but visually quieter.", difficulty: "Beginner" },
  { id: "q-colour-1", topic: "Colour theory", question: "Which colour relationship uses hues next to each other on the colour wheel?", options: ["Complementary", "Analogous", "Triadic", "Split-complementary"], answerIndex: 1, explanation: "Analogous colours sit next to one another and often create a cohesive palette.", difficulty: "Beginner" },
  { id: "q-type-1", topic: "Typography", question: "Which typography choice most helps readers scan a long article?", options: ["A clear heading hierarchy", "A different font for every paragraph", "All text in uppercase", "Very tight line spacing"], answerIndex: 0, explanation: "Consistent headings create landmarks and help readers find relevant sections.", difficulty: "Beginner" },
  { id: "q-grid-1", topic: "Layout", question: "What does a gutter represent in a column grid?", options: ["The space between columns", "The full page height", "A text style", "The outer border radius"], answerIndex: 0, explanation: "Gutters create consistent separation between grid columns.", difficulty: "Intermediate" },
  { id: "q-ux-1", topic: "UX research", question: "What is the main purpose of an open-ended user interview question?", options: ["To confirm the designer's assumption", "To invite users to describe their experience", "To get only yes/no answers", "To avoid discussing behaviour"], answerIndex: 1, explanation: "Open-ended questions encourage participants to describe goals, context and behaviours in their own words.", difficulty: "Intermediate" },
  { id: "q-access-1", topic: "Accessibility", question: "Why should a form not rely on placeholder text as its only label?", options: ["Placeholders are always too colourful", "They can disappear and may not provide a persistent label", "They prevent typing", "They create too much spacing"], answerIndex: 1, explanation: "Persistent labels remain available while users enter data and help communicate each field's purpose.", difficulty: "Intermediate" },
  { id: "q-system-1", topic: "Design systems", question: "What is the best reason to use design tokens?", options: ["To centralise shared design decisions", "To avoid naming styles", "To make every component unique", "To remove documentation"], answerIndex: 0, explanation: "Tokens store reusable values so updates can be consistent across a product.", difficulty: "Intermediate" },
  { id: "q-motion-1", topic: "Interaction", question: "A button triggers a process that takes several seconds. What should its state communicate?", options: ["Nothing until the process ends", "That the action is processing", "That the button is broken", "A different unrelated action"], answerIndex: 1, explanation: "A loading state gives feedback and reduces uncertainty while the system works.", difficulty: "Advanced" },
  { id: "q-micro-1", topic: "Interaction", question: "Which example is a microinteraction?", options: ["A year-long product roadmap", "A brief confirmation after saving a file", "A company's annual report", "A database schema"], answerIndex: 1, explanation: "A small confirmation is a focused feedback moment around a user action.", difficulty: "Beginner" },
  { id: "q-layout-2", topic: "Layout", question: "Why should mobile layouts prioritise content rather than simply shrink desktop columns?", options: ["Small screens have different space and task constraints", "Mobile users do not need hierarchy", "Columns are never used on mobile", "All mobile content must be hidden"], answerIndex: 0, explanation: "Responsive design adapts structure to the available space and user task.", difficulty: "Intermediate" },
  { id: "q-ux-2", topic: "UX research", question: "In a usability test, what is most valuable to record?", options: ["Only whether users liked the colours", "Where users hesitate, make errors or misunderstand the flow", "The facilitator's preferred design", "How quickly the facilitator can explain the screen"], answerIndex: 1, explanation: "Observed behaviour reveals usability problems that opinions alone may not uncover.", difficulty: "Advanced" },
  { id: "q-colour-2", topic: "Colour theory", question: "What is a semantic colour token such as `color-danger` for?", options: ["A named role used consistently for error or destructive states", "A random colour for decoration", "A font-size variable", "A spacing scale"], answerIndex: 0, explanation: "Semantic tokens describe purpose, so the actual colour can change without changing its role.", difficulty: "Advanced" },
  { id: "q-form-1", topic: "UI components", question: "Which label style is most robust for a form field?", options: ["A visible label associated with the input", "A placeholder that disappears", "An icon with no text", "A label shown only after an error"], answerIndex: 0, explanation: "Visible, associated labels keep the field's purpose clear throughout entry.", difficulty: "Beginner" },
  { id: "q-proto-1", topic: "Prototyping", question: "What should an early prototype help a team learn?", options: ["Whether key structure and task flow make sense", "Whether every final illustration is perfect", "Whether production code is complete", "Whether the product needs no research"], answerIndex: 0, explanation: "Early prototypes help test structure and assumptions before investing in polished implementation.", difficulty: "Intermediate" },
  { id: "q-copy-1", topic: "UX writing", question: "A destructive action button says only 'Continue'. What is the main risk?", options: ["The action may be unclear", "The button has too much contrast", "The layout has too many columns", "The icon is too large"], answerIndex: 0, explanation: "Action labels should describe the outcome, especially for destructive or irreversible actions.", difficulty: "Intermediate" },
  { id: "q-spacing-1", topic: "Spacing", question: "What does a spacing scale help a design team achieve?", options: ["Consistent rhythm and reusable layout decisions", "Random gaps on every screen", "One font family", "Automatic user research"], answerIndex: 0, explanation: "A spacing scale makes distance decisions predictable across screens and components.", difficulty: "Beginner" },
  { id: "q-motion-2", topic: "Motion design", question: "What is a good reason to respect reduced-motion preferences?", options: ["Some users experience discomfort from unnecessary motion", "Animations must always be removed", "It improves brand colour", "It makes every task shorter"], answerIndex: 0, explanation: "Offering reduced motion makes experiences more comfortable for people who prefer less animation.", difficulty: "Advanced" },
  { id: "q-handoff-1", topic: "Design handoff", question: "What makes a design handoff useful to developers?", options: ["Clear states, measurements, assets and behaviour notes", "Only a screenshot", "Unlabelled layers", "A list of colours without context"], answerIndex: 0, explanation: "A useful handoff explains how the design should behave, not only how one static screen looks.", difficulty: "Intermediate" },
  { id: "q-research-2", topic: "Research", question: "Why is it risky to ask a leading research question?", options: ["It can influence the answer", "It always takes too long", "It prevents note-taking", "It improves sample size"], answerIndex: 0, explanation: "Leading wording can push participants toward an answer and reduce the reliability of the insight.", difficulty: "Advanced" },
  { id: "q-design-principles-1", topic: "Design principles", question: "Which principle helps show that several controls belong to the same group?", options: ["Proximity", "Randomisation", "Latency", "Compression"], answerIndex: 0, explanation: "Proximity communicates relationships by placing related items near each other.", difficulty: "Beginner" },
];

const STORIES = [
  { id: "story-checkout", title: "The confusing checkout", tag: "UX story", minutes: 4, text: "Mira is designing a checkout for a small online shop. During testing, people reach the payment screen and stop. Some do not notice the delivery cost; others cannot tell whether the order is confirmed. Mira reviews the flow and discovers that the total is visually quiet and the confirmation state is missing.", question: "Which change should Mira test first?", options: ["Make the final total and delivery cost clear before payment", "Add a large decorative animation", "Hide the delivery cost until later", "Remove the confirmation screen"], answerIndex: 0, explanation: "The user needs clear cost information before committing. A confirmation state should also communicate the result after payment." },
  { id: "story-brand", title: "A brand with too many colours", tag: "Visual story", minutes: 3, text: "A new wellness brand launches an app. Its screens use seven accent colours, and each component uses a slightly different shade. The team struggles to keep the interface consistent as new screens are added.", question: "What is the strongest first improvement?", options: ["Create a small semantic colour system", "Add more accent colours", "Remove all colour", "Choose colours screen by screen"], answerIndex: 0, explanation: "A semantic colour system clarifies roles and allows the interface to scale consistently." },
];

const STUDIO_CHALLENGES = [
  { id: "clear-cta", title: "Make the main action clear", level: "Beginner", brief: "A signup page has three equally prominent buttons. New users do not know which one to choose.", question: "What would most improve the visual hierarchy?", options: ["Give the primary signup action the strongest emphasis", "Make all three buttons larger", "Add more colours to every button", "Hide the action among other content"], answerIndex: 0, explanation: "One clearly dominant action makes the next step easier to recognise. Secondary actions can remain visible but should be quieter." },
  { id: "readable-type", title: "Fix the typography", level: "Beginner", brief: "A mobile screen uses tiny text for its heading and oversized text for less important details.", question: "What should you change first?", options: ["Make every text element the same size", "Create a clear type hierarchy for headings and body text", "Use a different font for every sentence", "Remove all supporting labels"], answerIndex: 1, explanation: "A deliberate type scale makes information easier to scan and gives each text role a clear purpose." },
  { id: "empty-state", title: "Design a helpful empty state", level: "Intermediate", brief: "A saved-designs page is empty, and the screen provides no explanation or guidance.", question: "What would make the experience more helpful?", options: ["Leave the screen completely blank", "Show an error even though nothing is broken", "Explain that nothing is saved and offer a useful next action", "Hide the page title"], answerIndex: 2, explanation: "A good empty state explains what is happening and guides the user toward a meaningful next step." },
];

const FLASHCARDS = [
  { id: "fc-proximity", front: "What does proximity communicate?", back: "Related elements placed near one another are perceived as a group. Use spacing to communicate relationships, not just to decorate." },
  { id: "fc-token", front: "What is a design token?", back: "A named reusable value—such as a colour, spacing size or radius—that keeps decisions consistent across a product." },
  { id: "fc-feedback", front: "What is system feedback?", back: "A visible or audible response that tells users the result or status of an action, such as saved, loading or failed." },
  { id: "fc-affordance", front: "What is an affordance in UI?", back: "A characteristic that suggests how an element can be used. Clear labels, shapes and states help communicate possible actions." },
  { id: "fc-contrast", front: "What does contrast help users do?", back: "Distinguish elements, read content and identify hierarchy. Always check actual contrast rather than relying on colour names." },
];

const QUEST_TEMPLATES = [
  { id: "quest-lesson", title: "Path builder", description: "Complete 1 learning step", target: 1, key: "lessons", reward: 15 },
  { id: "quest-answers", title: "Sharp eye", description: "Answer 5 questions", target: 5, key: "answers", reward: 20 },
  { id: "quest-practice", title: "Make it practical", description: "Finish 1 practice activity", target: 1, key: "practice", reward: 20 },
];

const OUTFITS = [
  { id: "starter", name: "Studio basic", cost: 0, color: "#f15b43", unlocked: true },
  { id: "mint", name: "Mint mood", cost: 40, color: "#24a98b" },
  { id: "lilac", name: "Lilac creative", cost: 65, color: "#8975dc" },
  { id: "sunshine", name: "Sunshine", cost: 90, color: "#e5ad39" },
  { id: "midnight", name: "Midnight studio", cost: 130, color: "#303b68" },
];

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function weekKey(date = new Date()) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return localDateKey(d);
}

function safeArray(value) { return Array.isArray(value) ? value : []; }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

function normaliseProgress(value, legacy = {}) {
  const source = value && typeof value === "object" ? value : {};
  const number = (v, fallback = 0) => Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : fallback;
  const today = localDateKey();
  const defaults = {
    xp: number(legacy.xp), weeklyXp: 0, gems: 20, hearts: HEART_LIMIT,
    streak: number(legacy.streak), lastStudyDate: legacy.lastStudyDate || "",
    completedLessonIds: safeArray(legacy.completedLessonIds),
    mistakes: safeArray(legacy.mistakes), completedActivityIds: [],
    attempts: [], reviewCards: [], seenQuestionIds: [],
    questDate: today, questCounts: { lessons: 0, answers: 0, practice: 0 },
    questClaimed: [], ownedOutfits: ["starter"], outfit: "starter",
    leagueWeek: weekKey(), dailyCompleted: {}, lastHeartRefillDate: today,
    storiesCompleted: [], roleplaySessions: 0,
  };
  const merged = { ...defaults, ...source };
  merged.xp = number(merged.xp); merged.weeklyXp = number(merged.weeklyXp); merged.gems = number(merged.gems, 20);
  merged.hearts = clamp(number(merged.hearts, HEART_LIMIT), 0, HEART_LIMIT);
  merged.streak = number(merged.streak); merged.completedLessonIds = safeArray(merged.completedLessonIds);
  merged.mistakes = safeArray(merged.mistakes); merged.completedActivityIds = safeArray(merged.completedActivityIds);
  merged.attempts = safeArray(merged.attempts);
  merged.reviewCards = safeArray(merged.reviewCards);
  if (!merged.reviewCards.length && safeArray(source.mistakes || legacy.mistakes).length) {
    merged.reviewCards = safeArray(source.mistakes || legacy.mistakes).map((mistake, index) => ({
      questionId: mistake.lessonId || `legacy-review-${index}`,
      topic: "Previous lesson",
      prompt: mistake.question || mistake.lessonTitle || "Review this design concept",
      answer: mistake.correctAnswer || "Revisit the lesson explanation",
      explanation: "Revisit the original lesson and explain why the correct design decision works.",
      dueAt: today,
      repetitions: 0,
    }));
  }
  merged.seenQuestionIds = safeArray(merged.seenQuestionIds); merged.ownedOutfits = safeArray(merged.ownedOutfits);
  merged.storiesCompleted = safeArray(merged.storiesCompleted); merged.questClaimed = safeArray(merged.questClaimed);
  merged.questCounts = { lessons: 0, answers: 0, practice: 0, ...(merged.questCounts || {}) };
  merged.dailyCompleted = merged.dailyCompleted && typeof merged.dailyCompleted === "object" ? merged.dailyCompleted : {};
  if (merged.questDate !== today) { merged.questDate = today; merged.questCounts = { lessons: 0, answers: 0, practice: 0 }; merged.questClaimed = []; }
  if (merged.lastHeartRefillDate !== today) { merged.hearts = HEART_LIMIT; merged.lastHeartRefillDate = today; }
  if (merged.leagueWeek !== weekKey()) { merged.leagueWeek = weekKey(); merged.weeklyXp = 0; }
  return merged;
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return hash >>> 0;
}

function shuffleSeeded(items, seed) {
  const output = [...items]; let state = seed || 1;
  for (let i = output.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1); [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

function makeFallbackDailyPack(date, difficulty, seen = []) {
  const seed = hashString(`${date}-${difficulty}-palette-daily-v3`);
  const eligible = QUESTION_BANK.filter((q) => !seen.some((seenId) => String(seenId).includes(q.id)));
  const pool = eligible.length >= 5 ? eligible : QUESTION_BANK;
  const matching = pool.filter((q) => difficulty === "Advanced" ? q.difficulty !== "Beginner" : difficulty === "Intermediate" ? true : q.difficulty === "Beginner" || q.difficulty === "Intermediate");
  const quiz = shuffleSeeded(matching.length >= 5 ? matching : pool, seed).slice(0, 5).map((q, i) => ({ ...q, id: `${date}-${q.id}-${i}` }));
  const mission = shuffleSeeded([
    { title: "Fix the crowded dashboard", prompt: "A dashboard shows eight cards with identical size and emphasis. Name two changes that would help people find the most important information.", topic: "Visual hierarchy", task: "Write two specific improvements and explain which user task each one supports." },
    { title: "Rescue the low-contrast form", prompt: "A sign-up form uses pale grey text and faint borders. Identify the first three accessibility or readability improvements you would make.", topic: "Accessibility", task: "List three improvements and explain how each helps someone complete the form." },
    { title: "Simplify a mobile menu", prompt: "A mobile navigation menu has twelve items and no grouping. Propose a clearer structure for a first-time visitor.", topic: "Information architecture", task: "Group the items into meaningful sections and justify your labels." },
    { title: "Improve a checkout flow", prompt: "Users abandon checkout because they cannot see the delivery cost until the final step. Redesign the information order.", topic: "UX design", task: "Describe where the cost should appear and what confirmation feedback is needed." },
  ], seed + 17)[0];
  const creative = shuffleSeeded([
    { title: "Build a five-colour brand palette", prompt: "Create a five-colour palette for a fictional independent coffee brand. Give each colour a role: primary, secondary, surface, text and accent.", topic: "Colour theory", deliverable: "Five swatches with role names and one sentence explaining the palette." },
    { title: "Redesign a settings card", prompt: "Design a settings card with a title, short description, toggle and secondary action. Make hierarchy and spacing clear.", topic: "UI components", deliverable: "A simple annotated layout and a note about default, focus and disabled states." },
    { title: "Create a type scale", prompt: "Create a four-level type scale for a mobile app: display, heading, body and caption. Explain the role of each level.", topic: "Typography", deliverable: "Four text styles with font size, weight and intended use." },
    { title: "Design an empty state", prompt: "A saved-projects screen has no content. Create an empty state that explains what happened and gives the user a next step.", topic: "UX writing", deliverable: "A heading, helpful explanation, visual idea and one clear action." },
  ], seed + 41)[0];
  const story = STORIES[seed % STORIES.length];
  const flashcards = shuffleSeeded(FLASHCARDS, seed + 83).slice(0, 3);
  return { date, difficulty, source: "built-in rotating bank", quiz, mission, creative, story, flashcards };
}

function addDays(dateString, amount) {
  const date = new Date(`${dateString}T12:00:00`); date.setDate(date.getDate() + amount); return localDateKey(date);
}

function reviewInterval(repetitions) {
  return [1, 3, 7, 14, 30][Math.min(repetitions, 4)];
}

function Mascot({ mood = "happy", small = false }) {
  return <div className={`pl-mascot ${small ? "is-small" : ""} mood-${mood}`} aria-label="Palette's Pixel mascot"><span className="pl-mascot-spark">✦</span><span className="pl-mascot-eyes">• •</span><span className="pl-mascot-mouth">⌣</span></div>;
}

export default function PaletteLearn({ apiBase = "http://localhost:5000/api", token = "", user = null, legacyProgress = {} }) {
  const userId = user?._id || user?.id || user?.username || "guest";
  const storageKey = `${STORAGE_PREFIX}:${userId}`;
  const [progress, setProgress] = useState(() => {
    try { return normaliseProgress(JSON.parse(localStorage.getItem(storageKey) || "{}"), legacyProgress); }
    catch { return normaliseProgress({}, legacyProgress); }
  });
  const [ready, setReady] = useState(!token);
  const previousStorageKey = useRef(storageKey);
  const [hydratedStorageKey, setHydratedStorageKey] = useState(storageKey);
  const [dailyPack, setDailyPack] = useState(() => makeFallbackDailyPack(localDateKey(), "Beginner"));
  const [dailySource, setDailySource] = useState("built-in rotating bank");
  const [activeTab, setActiveTab] = useState("path");
  const [activeActivity, setActiveActivity] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [activityComplete, setActivityComplete] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardRevealed, setFlashcardRevealed] = useState(false);
  const [flashcardVoiceText, setFlashcardVoiceText] = useState("");
  const [roleplayInput, setRoleplayInput] = useState("");
  const [creativeResponse, setCreativeResponse] = useState("");
  const [roleplayBusy, setRoleplayBusy] = useState(false);
  const [roleplayMessages, setRoleplayMessages] = useState([{ role: "coach", text: "Hi! I'm your design client today. I'm launching a simple wellness app. Ask me one question about the users or the problem before you suggest a screen." }]);
  const [speakingRoleplayIndex, setSpeakingRoleplayIndex] = useState(null);
  const [storyChoice, setStoryChoice] = useState(null);
  const [storyAnswered, setStoryAnswered] = useState(false);
  const [loadingDaily, setLoadingDaily] = useState(Boolean(token));
  const [dailyError, setDailyError] = useState("");
  const [leagueRows, setLeagueRows] = useState([]);
  const [leagueLive, setLeagueLive] = useState(false);
  const [toast, setToast] = useState("");
  const [showAvatarShop, setShowAvatarShop] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const toastTimer = useRef(null);

  const today = localDateKey();
  const dueReviews = useMemo(() => progress.reviewCards.filter((item) => item.dueAt <= today), [progress.reviewCards, today]);
  const recentAttempts = useMemo(() => progress.attempts.slice(-10), [progress.attempts]);
  const accuracy = recentAttempts.length ? recentAttempts.filter((a) => a.correct).length / recentAttempts.length : 0;
  const adaptiveLevel = accuracy >= 0.82 && recentAttempts.length >= 5 ? "Advanced" : accuracy >= 0.58 && recentAttempts.length >= 4 ? "Intermediate" : "Beginner";
  const quests = useMemo(() => QUEST_TEMPLATES.map((quest) => ({ ...quest, progress: Math.min(quest.target, Number(progress.questCounts[quest.key]) || 0), claimed: progress.questClaimed.includes(quest.id) })), [progress.questCounts, progress.questClaimed]);
  const completedDaily = progress.dailyCompleted[today] || {};
  const completedLessons = progress.completedLessonIds.length;
  const totalLessons = MODULES.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const outfit = OUTFITS.find((item) => item.id === progress.outfit) || OUTFITS[0];
  const currentQuestion = activeActivity?.questions?.[questionIndex] || null;

  const showToast = useCallback((message) => {
    setToast(message); if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  const updateProgress = useCallback((updater) => {
    setProgress((current) => normaliseProgress(typeof updater === "function" ? updater(normaliseProgress(current)) : updater));
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    if (previousStorageKey.current === storageKey) return;
    const previousKey = previousStorageKey.current;
    previousStorageKey.current = storageKey;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setProgress(normaliseProgress(JSON.parse(saved)));
      } else if (previousKey.endsWith(":guest")) {
        // Carry the current browser-only learner's work into their first signed-in profile.
        setProgress((current) => normaliseProgress(current, legacyProgress));
      } else {
        // Never leak one signed-in account's progress into another account.
        setProgress(normaliseProgress({}));
      }
    } catch {
      setProgress(normaliseProgress({}));
    }
    setHydratedStorageKey(storageKey);
  }, [storageKey, legacyProgress]);

  useEffect(() => {
    if (hydratedStorageKey !== storageKey) return undefined;
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { /* Private browsing/storage limits: keep the session usable. */ }
    if (!token || !ready) return undefined;
    const timer = setTimeout(async () => {
      try {
        await fetch(`${apiBase}/learn/progress`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ progress }) });
      } catch { /* Local persistence remains the fallback. */ }
    }, 700);
    return () => { clearTimeout(timer); };
  }, [progress, token, apiBase, ready, storageKey, hydratedStorageKey]);

  useEffect(() => {
    let alive = true;
    async function loadAccountProgress() {
      if (!token) { setReady(true); return; }
      try {
        const response = await fetch(`${apiBase}/learn/progress`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.ok) {
          const result = await response.json();
          if (alive && result?.progress) setProgress((local) => normaliseProgress({ ...local, ...result.progress }, legacyProgress));
        }
      } catch { /* Fall back to browser progress. */ }
      if (alive) setReady(true);
    }
    loadAccountProgress();
    return () => { alive = false; };
  }, [token, apiBase, storageKey]);

  useEffect(() => {
  let alive = true;

  async function loadLeague() {
    if (!token) {
      setLeagueLive(false);
      return;
    }

    try {
      const response = await fetch(`${apiBase}/learn/league`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not load leaderboard.");
      }

      const result = await response.json();

      if (alive && result?.success && Array.isArray(result.rows)) {
        setLeagueRows(result.rows);
        setLeagueLive(true);
      }
    } catch (error) {
      console.error("League loading error:", error);
      if (alive) setLeagueLive(false);
    }
  }

  loadLeague();

  return () => {
    alive = false;
  };
}, [token, apiBase]);

  useEffect(() => {
    let alive = true;
    async function loadDaily() {
      if (token && !ready) return;
      setLoadingDaily(true); setDailyError("");
      const fallback = makeFallbackDailyPack(today, adaptiveLevel, progress.seenQuestionIds.slice(-30));
      if (token) {
        try {
          const response = await fetch(`${apiBase}/learn/daily?date=${today}&level=${adaptiveLevel}`, { headers: { Authorization: `Bearer ${token}` } });
          if (response.ok) {
            const result = await response.json();
            if (alive && result?.pack?.quiz?.length) {
              setDailyPack(result.pack); setDailySource(result.pack.source || "AI-generated daily set"); setLoadingDaily(false); return;
            }
          }
        } catch { /* Use rotating built-in pack. */ }
      }
      if (alive) { setDailyPack(fallback); setDailySource(fallback.source); setDailyError(token ? "Using the built-in daily set because the content service is not connected." : "Sign in to sync daily learning across devices. A rotating local set is active."); setLoadingDaily(false); }
    }
    loadDaily();
    return () => { alive = false; };
  }, [today, adaptiveLevel, token, apiBase, ready]);

  useEffect(() => {
    let alive = true;
    async function loadLeague() {
      if (!token) return;
      try {
        const response = await fetch(`${apiBase}/learn/league`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.ok) { const result = await response.json(); if (alive && Array.isArray(result.rows)) { setLeagueRows(result.rows); setLeagueLive(true); } }
      } catch { /* Display local preview. */ }
    }
    loadLeague(); return () => { alive = false; };
  }, [token, apiBase, progress.weeklyXp]);

  const markStudyDay = useCallback((base) => {
    const yesterday = addDays(today, -1);
    const streak = base.lastStudyDate === today ? base.streak : base.lastStudyDate === yesterday ? base.streak + 1 : 1;
    return { ...base, streak, lastStudyDate: today, hearts: base.lastHeartRefillDate !== today ? HEART_LIMIT : base.hearts, lastHeartRefillDate: today };
  }, [today]);

  const claimQuest = (quest) => {
    if (quest.claimed || quest.progress < quest.target) return;
    updateProgress((current) => ({ ...current, questClaimed: [...current.questClaimed, quest.id], xp: current.xp + quest.reward, weeklyXp: current.weeklyXp + quest.reward, gems: current.gems + 5 }));
    showToast(`Quest complete · +${quest.reward} XP · +5 gems`);
  };

  const startQuizActivity = (activity) => {
    const questions = safeArray(activity.questions).map((q) => ({ ...q, options: safeArray(q.options) }));
    if (!questions.length) return;
    setActiveActivity({ ...activity, questions }); setQuestionIndex(0); setSelectedAnswer(null); setAnswerChecked(false); setActivityComplete(false); setShowExplain(false); setActiveTab("path");
  };

  const startDailyQuiz = () => startQuizActivity({ type: "quiz", id: `daily-quiz-${today}`, title: "Daily design quiz", kicker: "DAILY QUIZ", questions: dailyPack.quiz, xp: 25, kind: "daily", intro: "A fresh set of design decisions selected for your current level." });

  const startLesson = (unit, lesson) => startQuizActivity({ type: "quiz", id: `lesson-${lesson.id}`, title: lesson.title, kicker: `${unit.title.toUpperCase()} · ${unit.level.toUpperCase()}`, questions: [{ id: lesson.id, topic: unit.title, question: lesson.question, options: lesson.options, answerIndex: lesson.answer, explanation: lesson.feedback, hint: lesson.explain }], xp: lesson.xp, kind: "lesson", lesson, intro: lesson.explain });

  const beginMission = () => {
    const m = dailyPack.mission;
    startQuizActivity({ type: "mission", id: `mission-${today}`, title: m.title, kicker: "DAILY DESIGN MISSION", questions: [{ id: `mission-q-${today}`, topic: m.topic, question: m.prompt, options: ["I would clarify hierarchy and prioritise the primary user task.", "I would add more visual decoration before checking the content.", "I would make every element equally prominent.", "I would remove labels to make the screen feel minimal."], answerIndex: 0, explanation: `A useful first response is to connect the visual change to the user's task. Your written brief: ${m.task}` }], xp: 20, kind: "mission", intro: m.task });
  };

  const beginStory = () => { setActiveActivity({ type: "story", id: `story-${dailyPack.story.id}-${today}`, story: dailyPack.story }); setStoryChoice(null); setStoryAnswered(false); };
  const beginFlashcards = () => { setActiveActivity({ type: "flashcards", id: `flashcards-${today}`, cards: dailyPack.flashcards?.length ? dailyPack.flashcards : FLASHCARDS.slice(0, 3) }); setFlashcardIndex(0); setFlashcardRevealed(false); setFlashcardVoiceText(""); };
  const beginRoleplay = () => { setActiveActivity({ type: "roleplay", id: `roleplay-${today}` }); setRoleplayMessages([{ role: "coach", text: "I'm your client for this design brief. I need a simple wellness app for people who want to build a daily mindfulness habit. What would you like to understand about my users before proposing a screen?" }]); setRoleplayInput(""); };
  const beginCreative = () => { setCreativeResponse(""); setActiveActivity({ type: "creative", id: `creative-${today}`, creative: dailyPack.creative }); };
  const beginStudioChallenge = (challenge) => startQuizActivity({ type: "quiz", id: `studio-${challenge.id}`, title: challenge.title, kicker: `DESIGN PRACTICE STUDIO · ${challenge.level.toUpperCase()}`, questions: [{ id: `studio-q-${challenge.id}`, topic: "Design practice", question: challenge.question, options: challenge.options, answerIndex: challenge.answerIndex, explanation: challenge.explanation }], xp: 12, kind: "studio", intro: challenge.brief });

  const recordAttempt = (question, correct, chosenIndex) => {
    const now = new Date().toISOString(); const answer = question.options?.[chosenIndex] || "";
    updateProgress((current) => {
      const base = markStudyDay(current);
      const attempts = [...base.attempts, { questionId: question.id, topic: question.topic, correct, date: today, createdAt: now }].slice(-200);
      const existing = base.reviewCards.find((card) => card.questionId === question.id);
      let reviewCards = base.reviewCards.filter((card) => card.questionId !== question.id);
      if (!correct) reviewCards.push({ questionId: question.id, topic: question.topic, prompt: question.question, answer: question.options?.[question.answerIndex] || "Review the explanation", explanation: question.explanation, dueAt: addDays(today, 1), repetitions: 0, lastAnswer: answer });
      else if (existing) { const reps = existing.repetitions + 1; reviewCards.push({ ...existing, repetitions: reps, dueAt: addDays(today, reviewInterval(reps)), lastAnswer: answer }); }
      const restoresHeart = correct && activeActivity?.kind === "review";
      return { ...base, attempts, reviewCards, hearts: correct ? (restoresHeart ? Math.min(HEART_LIMIT, base.hearts + 1) : base.hearts) : Math.max(0, base.hearts - 1), seenQuestionIds: [...base.seenQuestionIds, question.id].slice(-500), questCounts: { ...base.questCounts, answers: Math.min(5, (Number(base.questCounts.answers) || 0) + 1) } };
    });
    setAnswerChecked(true);
  };

  const checkAnswer = () => {
    if (!currentQuestion || selectedAnswer === null || answerChecked) return;
    recordAttempt(currentQuestion, selectedAnswer === currentQuestion.answerIndex, selectedAnswer);
  };

  const finishActivity = (activity = activeActivity) => {
    if (!activity) return;
    const already = progress.completedActivityIds.includes(activity.id) || (activity.kind === "lesson" && activity.lesson && progress.completedLessonIds.includes(activity.lesson.id));
    const dailyType = activity.kind === "daily" ? "quiz" : activity.kind;
    updateProgress((current) => {
      if (current.completedActivityIds.includes(activity.id) || (activity.kind === "lesson" && activity.lesson && current.completedLessonIds.includes(activity.lesson.id))) return markStudyDay(current);
      const base = markStudyDay(current);
      const next = { ...base, completedActivityIds: [...base.completedActivityIds, activity.id], xp: base.xp + (activity.xp || 10), weeklyXp: base.weeklyXp + (activity.xp || 10), gems: base.gems + (activity.kind === "daily" ? 4 : 2), questCounts: { ...base.questCounts } };
      if (activity.kind === "lesson" && activity.lesson) { next.completedLessonIds = [...new Set([...base.completedLessonIds, activity.lesson.id])]; next.questCounts.lessons = Math.min(1, (Number(next.questCounts.lessons) || 0) + 1); }
      if (["mission", "story", "roleplay", "flashcards", "creative", "studio"].includes(activity.kind)) next.questCounts.practice = Math.min(1, (Number(next.questCounts.practice) || 0) + 1);
      if (dailyType === "quiz") next.dailyCompleted = { ...base.dailyCompleted, [today]: { ...(base.dailyCompleted[today] || {}), quiz: true } };
      if (activity.kind === "mission") next.dailyCompleted = { ...next.dailyCompleted, [today]: { ...(next.dailyCompleted[today] || {}), mission: true } };
      if (activity.kind === "story") next.storiesCompleted = [...new Set([...base.storiesCompleted, activity.story.id])];
      if (activity.kind === "roleplay") next.roleplaySessions = base.roleplaySessions + 1;
      return next;
    });
    setActivityComplete(true);
    showToast(already ? "You've already earned this reward." : `Completed · +${activity.xp || 10} XP`);
  };

  const nextQuestion = () => {
    if (questionIndex + 1 < activeActivity.questions.length && progress.hearts <= 0) {
      setActiveActivity(null); setActiveTab("practice");
      showToast("Out of hearts. Review a due card in Practice Hub to restore one.");
      return;
    }
    if (questionIndex + 1 < activeActivity.questions.length) {
      setQuestionIndex((n) => n + 1); setSelectedAnswer(null); setAnswerChecked(false); setShowExplain(false); return;
    }
    finishActivity();
  };

  const startReview = (card) => startQuizActivity({ type: "quiz", id: `review-${card.questionId}-${today}`, title: "Smart revision", kicker: "SPACED RETRIEVAL", xp: 8, kind: "review", questions: [{ id: card.questionId, topic: card.topic, question: card.prompt, options: [card.answer, "A decorative change unrelated to the task", "Remove the feedback", "Ignore the user's context"], answerIndex: 0, explanation: card.explanation || `Recall the key idea: ${card.answer}` }] });

  const restoreHeart = () => {
    const due = dueReviews[0];
    if (!due) { showToast("Complete a revision card to restore one heart."); return; }
    startReview(due); showToast("Complete this revision to restore a heart.");
  };

 const rateFlashcard = (remembered) => {
  const card = activeActivity.cards[flashcardIndex];

  updateProgress((current) => {
    const existing = current.reviewCards.find(
      (item) => item.questionId === card.id
    );

    const repetitions = remembered
      ? (existing?.repetitions || 0) + 1
      : 0;

    const next = current.reviewCards.filter(
      (item) => item.questionId !== card.id
    );

    next.push({
      questionId: card.id,
      topic: "Design recall",
      prompt: card.front,
      answer: card.back,
      explanation: card.back,
      dueAt: remembered
        ? addDays(today, reviewInterval(repetitions))
        : addDays(today, 1),
      repetitions,
    });

    return {
      ...markStudyDay(current),
      reviewCards: next,
    };
  });

  showToast(
    remembered
      ? "Great job! This card is scheduled for a later review."
      : "Added to Smart Revision! You'll practise this card again tomorrow."
  );

  if (flashcardIndex + 1 < activeActivity.cards.length) {
    setFlashcardIndex((n) => n + 1);
    setFlashcardRevealed(false);
  } else {
    finishActivity({
      ...activeActivity,
      kind: "flashcards",
      xp: 12,
    });
    setActiveActivity(null);
    setActiveTab("practice");
  }
};


  const sendRoleplay = async () => {
    const message = roleplayInput.trim(); if (!message || roleplayBusy) return;
    const updated = [...roleplayMessages, { role: "learner", text: message }]; setRoleplayMessages(updated); setRoleplayInput(""); setRoleplayBusy(true);
    let reply = "That gives me a useful starting point. Could you explain which task should feel easiest for a first-time user, and what information they need before they begin?";
    if (token) {
      try {
        const response = await fetch(`${apiBase}/learn/roleplay`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ scenario: "Client discovery for a mindfulness and wellness app", messages: updated.slice(-8) }) });
        const result = await response.json(); if (response.ok && result.reply) reply = result.reply;
      } catch { /* Keep the practice available without the AI service. */ }
    }
    setRoleplayMessages((messages) => [...messages, { role: "coach", text: reply }]); setRoleplayBusy(false);
  };

  const claimOutfit = (item) => {
    if (progress.ownedOutfits.includes(item.id)) { updateProgress((current) => ({ ...current, outfit: item.id })); return; }
    if (progress.gems < item.cost) { showToast("Not enough gems yet. Complete daily activities to earn more."); return; }
    updateProgress((current) => ({ ...current, gems: current.gems - item.cost, ownedOutfits: [...current.ownedOutfits, item.id], outfit: item.id })); showToast(`${item.name} unlocked!`);
  };

  const speak = (text, index) => {
  if (!("speechSynthesis" in window)) {
    showToast("Audio playback is not supported in this browser.");
    return;
  }

  // Clicking the same button again stops playback.
  if (speakingRoleplayIndex === index) {
    window.speechSynthesis.cancel();
    setSpeakingRoleplayIndex(null);
    return;
  }

  // Stop any previously playing message.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.94;

  utterance.onend = () => {
    setSpeakingRoleplayIndex((current) =>
      current === index ? null : current
    );
  };

  utterance.onerror = () => {
    setSpeakingRoleplayIndex((current) =>
      current === index ? null : current
    );
  };

  setSpeakingRoleplayIndex(index);
  window.speechSynthesis.speak(utterance);
};

  const startVoiceInput = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { showToast("Voice input is not supported in this browser. You can type your response."); return; }
    const recognition = new Recognition(); recognition.lang = "en-IN"; recognition.interimResults = false;
    recognition.onresult = (event) => setRoleplayInput((current) => `${current} ${event.results[0][0].transcript}`.trim());
    recognition.onerror = () => showToast("Couldn't capture speech. Please try typing instead."); recognition.start();
  };

  const recordFlashcardAnswer = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { showToast("Voice input is not available in this browser. Think through your answer, then reveal the card."); return; }
    const recognition = new Recognition(); recognition.lang = "en-IN"; recognition.interimResults = false;
    recognition.onresult = (event) => setFlashcardVoiceText(event.results[0][0].transcript);
    recognition.onerror = () => showToast("Couldn't capture your answer. Try speaking again or use self-recall.");
    recognition.start();
  };

  const claimDailyReward = () => {
    const finished = completedDaily.quiz && completedDaily.mission;
    if (!finished || completedDaily.rewardClaimed) return;
    updateProgress((current) => ({ ...current, dailyCompleted: { ...current.dailyCompleted, [today]: { ...current.dailyCompleted[today], rewardClaimed: true } }, xp: current.xp + 20, weeklyXp: current.weeklyXp + 20, gems: current.gems + 10 })); showToast("Daily reward claimed · +20 XP · +10 gems");
  };

  const progressPercent = Math.round((completedLessons / totalLessons) * 100);
  const story = dailyPack.story || STORIES[0];

  return (
    <section className="pl-learn-page">
      <div className="pl-topline"><div><span className="pl-brand-dot" /> PALETTE <span className="pl-slash">/</span> LEARN</div><span className="pl-topline-right">DESIGN SKILLS · ONE DAY AT A TIME</span></div>
      <header className="pl-hero">
        <div className="pl-hero-copy"><p className="pl-eyebrow">YOUR CREATIVE TRAINING GROUND</p><h1>Make better design<br /><em>decisions every day.</em></h1><p>Short lessons, practical missions and fresh design thinking—built around your pace.</p><div className="pl-hero-actions"><button className="pl-button pl-button-primary" onClick={startDailyQuiz}>Start today's learning <span>↗</span></button><span className="pl-level-note">Adaptive level: <strong>{adaptiveLevel}</strong></span></div></div>
        <div className="pl-hero-mascot"><Mascot /><div className="pl-mascot-note"><strong>Pixel says</strong><span>{progress.streak > 0 ? "Small steps make sharp eyes." : "A little practice goes a long way."}</span></div></div>
      </header>

      <div className="pl-stat-strip">
        <div className="pl-stat"><span className="pl-stat-icon">🔥</span><div><strong>{progress.streak}</strong><small>day streak</small></div></div>
        <div className="pl-stat"><span className="pl-stat-icon">✦</span><div><strong>{progress.xp.toLocaleString()}</strong><small>total XP</small></div></div>
        <div className="pl-stat"><span className="pl-stat-icon">💎</span><div><strong>{progress.gems}</strong><small>gems</small></div></div>
        <div className="pl-stat"><span className="pl-stat-icon">❤️</span><div><strong>{progress.hearts}/{HEART_LIMIT}</strong><small>hearts</small></div></div>
        <div className="pl-stat pl-stat-progress"><div><strong>{progressPercent}%</strong><small>learning path</small></div><div className="pl-mini-progress"><span style={{ width: `${progressPercent}%` }} /></div></div>
      </div>

      <nav className="pl-tabs" aria-label="Learn sections">
        {[ ["path", "Learning path"], ["practice", "Practice hub"], ["league", "League"], ["profile", "Rewards & avatar"] ].map(([id, label]) => <button key={id} className={activeTab === id ? "is-active" : ""} onClick={() => { setActiveTab(id); setActiveActivity(null); }}>{label}</button>)}
      </nav>

      {activeActivity ? (
        <div className="pl-activity-wrap">
          <button className="pl-back-link" onClick={() => { setActiveActivity(null); setAnswerChecked(false); setSelectedAnswer(null); setActivityComplete(false); }}>← Back to learning</button>
          {activeActivity.type === "quiz" || activeActivity.type === "mission" ? (
            <article className="pl-quiz-card">
              <div className="pl-quiz-top"><span>{activeActivity.kicker || "DESIGN PRACTICE"}</span><span>{activityComplete ? "COMPLETE" : `${questionIndex + 1} / ${activeActivity.questions.length}`}</span></div>
              <div className="pl-quiz-progress"><span style={{ width: `${activityComplete ? 100 : ((questionIndex + 1) / activeActivity.questions.length) * 100}%` }} /></div>
              <h2>{activeActivity.title}</h2>
              {activeActivity.intro && <p className="pl-quiz-intro">{activeActivity.intro}</p>}
              {activityComplete ? <div className="pl-complete-state"><Mascot mood="celebrate" small /><h3>Nice work. Keep the momentum.</h3><p>You earned the activity reward. Your revision queue and daily progress have been updated.</p><button className="pl-button pl-button-primary" onClick={() => { setActiveActivity(null); setActivityComplete(false); setActiveTab("path"); }}>Continue learning ↗</button></div> : currentQuestion && <>
                <div className="pl-question-meta"><span>{currentQuestion.topic}</span><span>{currentQuestion.difficulty || adaptiveLevel}</span></div>
                <h3>{currentQuestion.question}</h3>
                <div className="pl-options">{currentQuestion.options.map((option, index) => <button key={`${currentQuestion.id}-${index}`} disabled={answerChecked} className={`pl-option ${selectedAnswer === index ? "is-selected" : ""} ${answerChecked && index === currentQuestion.answerIndex ? "is-correct" : ""} ${answerChecked && selectedAnswer === index && selectedAnswer !== currentQuestion.answerIndex ? "is-wrong" : ""}`} onClick={() => setSelectedAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
                {!answerChecked ? (
  <div className="pl-quiz-footer">
    <div>
      <button
        className="pl-hint-button"
        onClick={() => setShowExplain((v) => !v)}
      >
        {showExplain ? "Hide hint" : "Need a hint?"}
      </button>

      {showExplain && (
        <p className="pl-explain-detail">
          {currentQuestion.hint ||
            "Think about which option best supports the user's needs and makes the experience easier to understand."}
        </p>
      )}
    </div>

    <button
      className="pl-button pl-button-primary"
      disabled={selectedAnswer === null}
      onClick={checkAnswer}
    >
      Check answer
    </button>
  </div>
)   : <div className={`pl-answer-feedback ${selectedAnswer === currentQuestion.answerIndex ? "correct" : "wrong"}`}><div><strong>{selectedAnswer === currentQuestion.answerIndex ? "That's right!" : "Not quite—learn from it."}</strong><p>{currentQuestion.explanation}</p><button className="pl-hint-button" onClick={() => setShowExplain((v) => !v)}>{showExplain ? "Hide explanation" : "Explain my answer"}</button>{showExplain && <p className="pl-explain-detail">{currentQuestion.hint || `The best choice is “${currentQuestion.options[currentQuestion.answerIndex]}”. ${currentQuestion.explanation}`}</p>}</div>{selectedAnswer !== currentQuestion.answerIndex ? <button className="pl-button pl-button-primary" onClick={() => { setSelectedAnswer(null); setAnswerChecked(false); setShowExplain(false); }}>{activeActivity.kind === "lesson" ? "Try again" : "Continue"} ↗</button> : <button className="pl-button pl-button-primary" onClick={nextQuestion}>{questionIndex + 1 < activeActivity.questions.length && progress.hearts > 0 ? "Continue" : "Finish activity"} ↗</button>}</div>}
              </>}
            </article>
          ) : activeActivity.type === "story" ? (
            <article className="pl-story-card"><div className="pl-quiz-top"><span>DESIGN STORY · {story.tag}</span><span>{story.minutes} MIN</span></div><h2>{story.title}</h2><p className="pl-story-text">{story.text}</p><button className="pl-secondary-button" onClick={() => speak(story.text)}>▶ Listen to story</button><h3>{story.question}</h3><div className="pl-options">{story.options.map((option, index) => <button key={option} className={`pl-option ${storyChoice === index ? "is-selected" : ""} ${storyAnswered && index === story.answerIndex ? "is-correct" : ""}`} onClick={() => !storyAnswered && setStoryChoice(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{storyAnswered ? <div className="pl-answer-feedback correct"><div><strong>Story insight</strong><p>{story.explanation}</p></div><button className="pl-button pl-button-primary" onClick={() => { finishActivity({ id: activeActivity.id, kind: "story", xp: 15, story }); setActiveActivity(null); }}>Complete story</button></div> : <button className="pl-button pl-button-primary" disabled={storyChoice === null} onClick={() => setStoryAnswered(true)}>Check my decision</button>}</article>
          ) : activeActivity.type === "creative" ? (
            <article className="pl-roleplay-card"><div className="pl-quiz-top"><span>DAILY CREATIVE CHALLENGE</span><span>BUILD SOMETHING</span></div><h2>{activeActivity.creative.title}</h2><p className="pl-story-text">{activeActivity.creative.prompt}</p><div className="pl-creative-brief"><strong>Your deliverable</strong><p>{activeActivity.creative.deliverable}</p><span>Use this space to outline your design decision or describe what you created. You can paste a Figma link after publishing your work.</span></div><textarea className="pl-creative-response" value={creativeResponse} onChange={(event) => setCreativeResponse(event.target.value)} rows={6} placeholder="Describe your idea, structure, colours, components and the reason behind your choices…" /><div className="pl-creative-actions"><span>{creativeResponse.trim().length} characters · Aim for at least 40</span><button className="pl-button pl-button-primary" disabled={creativeResponse.trim().length < 40} onClick={() => { finishActivity({ id: activeActivity.id, kind: "creative", xp: 15 }); setActiveActivity(null); setActiveTab("path"); }}>Submit challenge · +15 XP</button></div></article>
          ) : activeActivity.type === "flashcards" ? (
<article className="pl-flashcard-session">
  <div className="pl-quiz-top">
    <span>VISUAL RECALL CARDS</span>
    <span>{flashcardIndex + 1} / {activeActivity.cards.length}</span>
  </div>

  <h2>Remember it without looking.</h2>

  <div
    className="pl-visual-flashcard"
    onClick={() => setFlashcardRevealed((v) => !v)}
    role="button"
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setFlashcardRevealed((v) => !v);
      }
    }}
  >
    <div className="pl-flashcard-art">
      <div className="pl-art-window">
        <span />
        <span />
        <span />
        <div className="pl-art-lines">
          <i />
          <i />
          <i />
        </div>
        <b />
      </div>
    </div>

    <strong>
      {flashcardRevealed
        ? activeActivity.cards[flashcardIndex].back
        : activeActivity.cards[flashcardIndex].front}
    </strong>

    <small>
      {flashcardRevealed
        ? "How well did you remember?"
        : "Tap the card to reveal the answer"}
    </small>
  </div>

  {flashcardRevealed && (
    <div className="pl-flashcard-ratings">
      <button onClick={() => rateFlashcard(false)}>
        Need more practice
      </button>

      <button onClick={() => rateFlashcard(true)}>
        Got it ✓
      </button>
    </div>
  )}
</article>          ) : activeActivity.type === "roleplay" ? (
            <article className="pl-roleplay-card"><div className="pl-quiz-top"><span>AI DESIGN ROLEPLAY</span><span>CLIENT DISCOVERY</span></div><h2>Talk to your design client.</h2><p className="pl-quiz-intro">Practise asking questions, clarifying goals and explaining design decisions. The AI service is optional; a guided fallback is available.</p><div className="pl-chat-thread">{roleplayMessages.map((message, index) => <div key={`${message.role}-${index}`} className={`pl-chat-message ${message.role}`}><b>{message.role === "coach" ? "Client / coach" : "You"}</b><p>{message.text}</p>{message.role === "coach" && <button
  className="pl-hint-button"
  onClick={() => speak(message.text, index)}
>
  {speakingRoleplayIndex === index ? "■ Stop" : "▶ Listen"}
</button>}</div>)}{roleplayBusy && <div className="pl-chat-message coach"><p>Thinking through the brief…</p></div>}</div><div className="pl-roleplay-input"><textarea value={roleplayInput} onChange={(e) => setRoleplayInput(e.target.value)} placeholder="Ask your client a question or explain your design decision…" rows={3} /><div><button className="pl-secondary-button" onClick={startVoiceInput}>🎙 Use voice</button><button className="pl-button pl-button-primary" disabled={!roleplayInput.trim() || roleplayBusy} onClick={sendRoleplay}>Send response ↗</button></div></div><button className="pl-button pl-button-primary" onClick={() => { finishActivity({ id: activeActivity.id, kind: "roleplay", xp: 15 }); setActiveActivity(null); }}>Finish roleplay · +15 XP</button></article>
          ) : null}
        </div>
      ) : activeTab === "path" ? (
        <>
          <div className="pl-section-heading"><div><p className="pl-eyebrow">TODAY'S PLAN · {today}</p><h2>Three small wins.</h2><p>Daily practice refreshes every day. Your path stays open after every unit.</p><small className="pl-daily-source">{loadingDaily ? "Preparing today's set…" : `Content: ${dailySource}`}</small></div><span className="pl-daily-refresh">↻ DAILY REFRESH</span></div>
          <div className="pl-daily-grid">
            <article className={`pl-daily-card quiz ${completedDaily.quiz ? "is-done" : ""}`}><div className="pl-card-symbol">✦</div><span className="pl-card-label">DAILY QUIZ · 5 QUESTIONS</span><h3>Train your design eye</h3><p>Fresh questions across UI/UX topics, tuned to your current level.</p><div className="pl-card-bottom"><span>+25 XP</span><button onClick={startDailyQuiz}>{completedDaily.quiz ? "Practise again" : "Start quiz ↗"}</button></div></article>
            <article className={`pl-daily-card mission ${completedDaily.mission ? "is-done" : ""}`}><div className="pl-card-symbol">⌁</div><span className="pl-card-label">DAILY DESIGN MISSION</span><h3>{dailyPack.mission.title}</h3><p>{dailyPack.mission.prompt}</p><div className="pl-card-bottom"><span>+20 XP</span><button onClick={beginMission}>{completedDaily.mission ? "Try another" : "Start mission ↗"}</button></div></article>
            <article className="pl-daily-card creative"><div className="pl-card-symbol">✳</div><span className="pl-card-label">CREATIVE CHALLENGE</span><h3>{dailyPack.creative.title}</h3><p>{dailyPack.creative.prompt}</p><div className="pl-card-bottom"><span>+15 XP</span><button onClick={beginCreative}>Start creating ↗</button></div></article>
          </div>
          <div className="pl-daily-reward-row"><div><strong>Daily combo reward</strong><span>Complete today's quiz and mission to earn bonus XP and gems.</span></div><button className="pl-button pl-button-primary" disabled={!completedDaily.quiz || !completedDaily.mission || completedDaily.rewardClaimed} onClick={claimDailyReward}>{completedDaily.rewardClaimed ? "Reward claimed ✓" : "Claim +20 XP · +10 gems"}</button></div>
          <div className="pl-quests-panel"><div className="pl-section-heading compact"><div><p className="pl-eyebrow">DAILY QUESTS</p><h2>Little goals, extra rewards.</h2></div><span className="pl-quest-refresh">Resets daily</span></div><div className="pl-quests-grid">{quests.map((quest) => <article className="pl-quest" key={quest.id}><div className="pl-quest-icon">{quest.key === "lessons" ? "◈" : quest.key === "answers" ? "◎" : "✳"}</div><div className="pl-quest-copy"><strong>{quest.title}</strong><p>{quest.description}</p><div className="pl-quest-bar"><span style={{ width: `${(quest.progress / quest.target) * 100}%` }} /></div><small>{quest.progress}/{quest.target}</small></div><button disabled={quest.claimed || quest.progress < quest.target} onClick={() => claimQuest(quest)}>{quest.claimed ? "✓" : `+${quest.reward} XP`}</button></article>)}</div></div>
          <div className="pl-section-heading path-heading"><div><p className="pl-eyebrow">YOUR LEARNING PATH</p><h2>Build your design foundations.</h2><p>Complete each short lesson to open the next step. Advanced practice continues beyond this path.</p></div><span className="pl-path-progress">{completedLessons}/{totalLessons} lessons</span></div>
          <div className="pl-path-list">{MODULES.map((unit, unitIndex) => { const completed = unit.lessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length; const unitUnlocked = unitIndex === 0 || progress.completedLessonIds.includes(MODULES[unitIndex - 1].lessons[MODULES[unitIndex - 1].lessons.length - 1].id); return <section className={`pl-unit ${unitUnlocked ? "" : "is-locked"}`} key={unit.id}><div className={`pl-unit-icon ${unit.color}`}>{unit.icon}</div><div className="pl-unit-content"><div className="pl-unit-overline">UNIT {String(unitIndex + 1).padStart(2, "0")} · {unit.level.toUpperCase()}</div><h3>{unit.title}</h3><p>{unit.subtitle}</p><div className="pl-unit-track"><span style={{ width: `${(completed / unit.lessons.length) * 100}%` }} /></div><div className="pl-unit-meta">{completed}/{unit.lessons.length} steps complete</div><div className="pl-lesson-nodes">{unit.lessons.map((lesson, lessonIndex) => { const previous = lessonIndex === 0 ? unitIndex === 0 ? null : MODULES[unitIndex - 1].lessons.at(-1) : unit.lessons[lessonIndex - 1]; const unlocked = unitUnlocked && (!previous || progress.completedLessonIds.includes(previous.id)); const done = progress.completedLessonIds.includes(lesson.id); return <button key={lesson.id} disabled={!unlocked} className={`pl-lesson-node ${done ? "done" : ""} ${!unlocked ? "locked" : ""}`} onClick={() => startLesson(unit, lesson)}><span>{done ? "✓" : unlocked ? "→" : "⌑"}</span><small>{lesson.title}</small><em>{lesson.minutes} min · {lesson.xp} XP</em></button>; })}</div></div></section>; })}</div>
          {dailyError && <p className="pl-service-note">{dailyError}</p>}
          <div className="pl-endless-note"><Mascot small /><div><strong>The path is a beginning, not a finish line.</strong><p>Daily quizzes, rotating missions, stories, roleplay and spaced practice keep your learning going after the structured units are complete.</p></div></div>
        </>
      ) : activeTab === "practice" ? (
        <>
          <div className="pl-section-heading"><div><p className="pl-eyebrow">PRACTICE HUB</p><h2>Remember it. Apply it. Explain it.</h2><p>Smart revision brings back ideas at increasing intervals so you practise recalling them.</p></div></div>
          <div className="pl-practice-grid">
            <article className="pl-practice-tile"><span className="pl-card-label">SPACED REPETITION</span><div className="pl-practice-number">{dueReviews.length}</div><h3>Ready to review</h3><p>{dueReviews.length ? "These ideas are due for another retrieval round." : "You're up to date. Complete lessons and missed questions to build your revision queue."}</p><button className="pl-button pl-button-primary" disabled={!dueReviews.length} onClick={() => startReview(dueReviews[0])}>Start revision ↗</button></article>
            <article className="pl-practice-tile"><span className="pl-card-label">IMAGE FLASHCARDS</span><div className="pl-flash-preview"><div className="pl-art-window"><span /><span /><span /><div className="pl-art-lines"><i /><i /><i /></div><b /></div></div><h3>Recall without options</h3><p>Flip visual study cards, explain the concept from memory and schedule the next review.</p><button className="pl-button pl-button-primary" onClick={beginFlashcards}>Open flashcards ↗</button></article>
            <article className="pl-practice-tile"><span className="pl-card-label">STORIES & AUDIO</span><div className="pl-story-icon">◖))</div><h3>{story.title}</h3><p>Short design situations help connect principles to realistic product decisions.</p><button className="pl-button pl-button-primary" onClick={beginStory}>Read or listen ↗</button></article>
            <article className="pl-practice-tile"><span className="pl-card-label">AI ROLEPLAY</span><div className="pl-roleplay-icon">✎</div><h3>Talk to a design client</h3><p>Practise discovery questions, explain trade-offs and respond to changing requirements.</p><button className="pl-button pl-button-primary" onClick={beginRoleplay}>Start roleplay ↗</button></article>
            <article className="pl-practice-tile"><span className="pl-card-label">DESIGN PRACTICE STUDIO</span><div className="pl-roleplay-icon">✳</div><h3>Make a real design decision</h3><p>Short interface scenarios test hierarchy, typography, empty states and your ability to justify choices.</p><button className="pl-button pl-button-primary" onClick={() => beginStudioChallenge(STUDIO_CHALLENGES[hashString(today) % STUDIO_CHALLENGES.length])}>Open today's studio ↗</button></article>
          </div>
          <div className="pl-review-list"><div className="pl-section-heading compact"><div><p className="pl-eyebrow">YOUR REVIEW QUEUE</p><h2>Topics to revisit</h2></div></div>{progress.reviewCards.length ? progress.reviewCards.slice().sort((a, b) => a.dueAt.localeCompare(b.dueAt)).slice(0, 8).map((card) => <div className="pl-review-row" key={card.questionId}><div><strong>{card.topic}</strong><p>{card.prompt}</p></div><span>{card.dueAt <= today ? "Due now" : `Due ${card.dueAt}`}</span><button onClick={() => startReview(card)}>Review</button></div>) : <div className="pl-empty-review">No review cards yet. Wrong answers and flashcard ratings will automatically add topics here.</div>}</div>
        </>
      ) : activeTab === "league" ? (
        <>
          <div className="pl-section-heading"><div><p className="pl-eyebrow">WEEKLY DESIGN LEAGUE</p><h2>Learn together. Rise together.</h2><p>Earn XP through genuine learning and practice. Weekly points reset at the start of the week.</p></div><span className="pl-league-badge">WEEK OF {weekKey()}</span></div>
          <div className="pl-league-card"><div className="pl-league-head"><div><span className="pl-card-label">{leagueLive ? "COMMUNITY LEAGUE" : "LEAGUE PREVIEW"}</span><h3>Creative minds</h3><p>{leagueLive ? "Live rankings from PALETTE learners" : "Preview rankings until the community leaderboard endpoint is connected"}</p></div><div className="pl-league-emblem">✦</div></div><div className="pl-league-table">{(leagueLive ? leagueRows : [{ userId: "demo-1", name: "Studio Sprout", weeklyXp: 310 }, { userId: "demo-2", name: "Grid Guru", weeklyXp: 265 }, { userId: "demo-3", name: "Pixel Pilot", weeklyXp: 210 }, { userId: String(userId), name: user?.name || user?.username || "You", weeklyXp: progress.weeklyXp, isCurrentUser: true }, { userId: "demo-5", name: "Type Foundry", weeklyXp: 125 }]).sort((a, b) => (b.weeklyXp || 0) - (a.weeklyXp || 0)).map((row, index) => <div className={`pl-league-row ${row.isCurrentUser || row.userId === userId ? "is-you" : ""}`} key={row.userId || row.name}><span className="pl-rank">{index + 1}</span><div className="pl-league-avatar">{(row.name || "P").slice(0, 1).toUpperCase()}</div><strong>{row.name || "PALETTE learner"} {row.isCurrentUser || row.userId === userId ? "(you)" : ""}</strong><span>{row.weeklyXp || 0} XP</span></div>)}</div><p className="pl-league-footnote">
  {leagueLive
    ? "You're viewing the shared PALETTE leaderboard. Rankings are based on learners' weekly XP."
    : "The preview uses sample names and is not a live ranking. Sign in and connect the Learn API to compete on the shared leaderboard."}
</p></div>
        </>
      ) : (
        <>
          <div className="pl-section-heading"><div><p className="pl-eyebrow">YOUR DESIGNER PROFILE</p><h2>Make your learning yours.</h2><p>Collect cosmetic styles as you earn gems. Rewards never change quiz answers or learning outcomes.</p></div></div>
          <div className="pl-profile-layout"><article className="pl-profile-card"><div className="pl-avatar-large" style={{ "--avatar-color": outfit.color }}><span>✦</span><b>{(user?.name || user?.username || "P").slice(0, 1).toUpperCase()}</b></div><h3>{user?.name || user?.username || "Palette learner"}</h3><p>{progress.xp.toLocaleString()} XP · {progress.streak} day streak</p><div className="pl-profile-stats"><div><strong>{completedLessons}</strong><small>Lessons</small></div><div><strong>{progress.storiesCompleted.length}</strong><small>Stories</small></div><div><strong>{progress.roleplaySessions}</strong><small>Roleplays</small></div></div><button className="pl-button pl-button-primary" onClick={() => setShowAvatarShop((v) => !v)}>{showAvatarShop ? "Close wardrobe" : "Open avatar wardrobe"}</button></article><article className="pl-wardrobe"><span className="pl-card-label">COLLECTIBLE STYLE ITEMS</span><h3>Studio outfits</h3><div className="pl-outfit-grid">{OUTFITS.map((item) => { const owned = progress.ownedOutfits.includes(item.id); const selected = progress.outfit === item.id; return <button key={item.id} className={`pl-outfit ${selected ? "selected" : ""}`} onClick={() => showAvatarShop && claimOutfit(item)} disabled={!showAvatarShop}><span className="pl-outfit-swatch" style={{ background: item.color }} /><strong>{item.name}</strong><small>{owned ? selected ? "Selected" : "Owned" : `💎 ${item.cost}`}</small></button>; })}</div>{!showAvatarShop && <p className="pl-service-note">Open the wardrobe to equip owned styles or unlock new ones with gems.</p>}</article></div>
        </>
      )}
      {progress.hearts === 0 && <div className="pl-heart-warning"><strong>You're out of hearts for now.</strong><span>Use the Practice Hub to review a due card and restore one heart, or come back after the daily refill.</span><button onClick={() => { setActiveTab("practice"); setActiveActivity(null); }}>Go to practice ↗</button></div>}
      {toast && <div className="pl-toast" role="status">{toast}</div>}
      <footer className="pl-footer"><span>PALETTE LEARN</span><span>Stay curious. Keep creating.</span></footer>
    </section>
  );
}
