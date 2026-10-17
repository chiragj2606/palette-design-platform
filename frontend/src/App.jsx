import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const NAV_ITEMS = [
  "Discover",
  "Explore",
  "Following",
  "Boards",
  "Liked",
  "Learn",
  "Market",
];
const CATEGORIES = [
  "All work",
  "Product Design",
  "Branding",
  "Typography",
  "Design Systems",
];
const PUBLISH_CATEGORIES = ["UI/UX", "Web Design", "Branding", "Typography", "Illustration", "3D Art", "Other"];

const DESIGN_UNITS = [
  {
    id: "foundations",
    title: "Design foundations",
    description: "Train your eye to recognise good design.",
    lessons: [
      {
        id: "visual-hierarchy",
        title: "Visual hierarchy",
        duration: "4 min",
        xp: 10,
        explanation:
          "Visual hierarchy guides people towards the most important information first. Size, colour, spacing, contrast and placement help users understand what to look at.",
        question:
          "You want users to notice the main action on a screen. What should you do?",
        options: [
          "Make the main action visually prominent",
          "Make every element equally prominent",
          "Add more colours everywhere",
          "Hide the action among other content",
        ],
        answer: 0,
        feedback:
          "Exactly! A clear visual hierarchy helps people understand what matters first.",
        challenge:
  "Open an app you use regularly. Identify the first thing you notice and explain why it attracts your attention.",

practice: {
  title: "Choose the stronger design",
  prompt: "Which screen makes the main action easier to notice?",
  options: [
    {
      id: "focused",
      label: "A",
      headline: "Your next idea starts here",
      description: "Everything you need to start creating.",
      buttonLabel: "Start creating",
      style: "focused",
      isCorrect: true,
      feedback:
        "Great choice! One clear heading, readable supporting text, and a prominent button create a strong visual hierarchy.",
    },
    {
      id: "crowded",
      label: "B",
      headline: "Your next idea starts here",
      description: "Everything you need to start creating.",
      buttonLabel: "Start creating",
      style: "crowded",
      isCorrect: false,
      feedback:
        "Look for competing visual elements. When everything demands attention, the main action becomes harder to find.",
    },
  ],
},
      },
      {
        id: "contrast",
        title: "Contrast and emphasis",
        duration: "4 min",
        xp: 10,
        explanation:
          "Contrast makes differences visible. Designers use differences in colour, size, weight and spacing to separate information and highlight important actions.",
        question:
          "Which choice usually makes a button easier to distinguish from its background?",
        options: [
          "Using the same colour for both",
          "Using sufficient colour contrast",
          "Removing the button label",
          "Making every screen element identical",
        ],
        answer: 1,
        feedback:
          "Correct! Sufficient contrast helps interface elements stand out and improves readability.",
        challenge:
  "Find a button that is difficult to notice on a website. Suggest one change that would improve its visibility.",

practice: {
  title: "Spot the stronger contrast",
  prompt:
    "Which screen makes its main button and text easier to distinguish from the background?",
  options: [
    {
      id: "strong-contrast",
      label: "A",
      headline: "Book your session",
      description: "Choose a time that works for you.",
      buttonLabel: "Book now",
      style: "contrast-good",
      isCorrect: true,
      feedback:
        "Great choice! Strong contrast makes text and important actions easier to distinguish from their background.",
    },
    {
      id: "weak-contrast",
      label: "B",
      headline: "Book your session",
      description: "Choose a time that works for you.",
      buttonLabel: "Book now",
      style: "contrast-poor",
      isCorrect: false,
      feedback:
        "This design has weaker contrast, so the text and button can be harder to see. Improve the difference between foreground and background.",
    },
  ],
},
      },
    ],
  },
  {
    id: "type-and-colour",
    title: "Typography and colour",
    description: "Make interfaces readable and intentional.",
    lessons: [
      {
        
  id: "type-hierarchy",
  title: "Typography hierarchy",
  duration: "5 min",
  xp: 10,

  explanation:
    "Typography hierarchy uses font size, weight, spacing and placement to distinguish headings, body text, labels and supporting information.",

  question:
    "How can you make a page heading easier to distinguish from body text?",

  options: [
    "Give both exactly the same visual treatment",
    "Remove all spacing between them",
    "Use a clearer difference in size and weight",
    "Make the body text harder to read",
  ],

  answer: 2,

  feedback:
    "That's right! A deliberate difference in size and weight helps readers scan a page.",

  challenge:
    "Choose a webpage and identify its heading, subheading and body text. Notice how each level differs.",

  practice: {
    type: "spot-issue",
    title: "Spot the typography mistake",

    prompt:
      "A mobile screen displays a heading and body text. Which choice creates the clearest typography problem?",

    options: [
      {
        id: "same-hierarchy",
        label: "A",
        text:
          "The heading and body text are almost the same size and weight.",

        isCorrect: true,

        feedback:
          "Correct! When headings and body text look almost identical, readers can struggle to tell the most important information from supporting details.",
      },
      {
        id: "clear-heading",
        label: "B",
        text:
          "The heading is larger and heavier than the body text.",

        isCorrect: false,

        feedback:
          "A clear difference in size and weight usually helps readers recognise the heading.",
      },
      {
        id: "comfortable-spacing",
        label: "C",
        text:
          "The body text has comfortable line spacing.",

        isCorrect: false,

        feedback:
          "Comfortable line spacing generally improves readability rather than creating a typography hierarchy problem.",
      },
      {
        id: "consistent-labels",
        label: "D",
        text:
          "Small supporting labels use a consistent visual style.",

        isCorrect: false,

        feedback:
          "Consistent styling helps readers recognise related labels. The important question is whether those labels remain distinguishable from the main heading.",
      },
    ],
  },
},
      {
        id: "colour-meaning",
        title: "Colour with purpose",
        duration: "5 min",
        xp: 10,
        explanation:
          "Colour can establish brand identity, group related information and communicate states. Colour choices should also consider contrast, accessibility and cultural context.",
        question:
          "What is a good accessibility practice when using colour to show an error?",
        options: [
          "Use only a red colour with no other clues",
          "Remove the error message",
          "Use colour alongside a clear message or icon",
          "Make all text low contrast",
        ],
        answer: 2,
        feedback:
          "Correct! Combining colour with text or an icon means users don't have to rely on colour alone.",
        challenge:
          "Find a success or error message in an app. Check whether its meaning is clear without relying only on colour.",
      },
    ],
  },
  {
    id: "ui-ux",
    title: "UI/UX essentials",
    description: "Design around people and their goals.",
    lessons: [
      {
        id: "user-needs",
        title: "Understand user needs",
        duration: "5 min",
        xp: 15,
        explanation:
          "UX design starts by understanding users, their goals, their context and the problems they face. Research helps designers avoid guessing what people need.",
        question:
          "Before designing a new banking app, what is a useful first step?",
        options: [
          "Choose decorative colours immediately",
          "Understand users and their banking tasks",
          "Add as many features as possible",
          "Copy another app without research",
        ],
        answer: 1,
        feedback:
          "Exactly! Understanding users and their goals helps shape useful design decisions.",
        challenge:
          "Pick an app you use. Write down one important task a user visits it to complete.",
      },
      {
        id: "wireframes",
        title: "Think in wireframes",
        duration: "5 min",
        xp: 15,
        explanation:
          "Wireframes are simplified representations of a layout. They help designers plan structure, content and task flow before investing time in detailed visual styling.",
        question:
          "Why do designers create wireframes before polishing the visual design?",
        options: [
          "To avoid thinking about user tasks",
          "To test layout and structure early",
          "To guarantee the product has no problems",
          "To choose final animations first",
        ],
        answer: 1,
        feedback:
          "Correct! Wireframes help teams discuss and improve the structure before polishing details.",
        challenge:
          "Sketch a simple login screen using boxes and labels. Focus on the order and placement of elements rather than colour.",
      },
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio practice",
    description: "Turn your design decisions into a story.",
    lessons: [
      {
        id: "case-studies",
        title: "Tell the project story",
        duration: "5 min",
        xp: 15,
        explanation:
          "A strong case study explains the problem, your role, your process, important decisions, the outcome and what you learned. It should distinguish your contribution from the team's work.",
        question:
          "What makes a design portfolio case study more useful?",
        options: [
          "Only showing polished screenshots",
          "Hiding your role in the project",
          "Explaining the problem and your design decisions",
          "Listing tools without context",
        ],
        answer: 2,
        feedback:
          "Exactly! Showing your reasoning helps others understand how you approach design problems.",
        challenge:
          "Choose a project you worked on. Write one sentence about the problem and one about your contribution.",
      },
      {
        id: "iterate",
        title: "Improve through feedback",
        duration: "5 min",
        xp: 15,
        explanation:
          "Design is iterative. Feedback and usability testing reveal where people struggle, helping designers refine a solution instead of assuming the first version is perfect.",
        question:
          "After users struggle to complete a task in your prototype, what should you do?",
        options: [
          "Ignore the feedback",
          "Investigate the problem and test an improvement",
          "Assume the users are always wrong",
          "Remove the entire product immediately",
        ],
        answer: 1,
        feedback:
          "Well done! Investigating feedback and testing improvements is a central part of iterative design.",
        challenge:
          "Ask someone to try a simple screen you designed. Observe one difficulty and write down a possible improvement.",
      },
    ],
  },
];

const MARKET_NOTES = [
  {
    number: "01",
    title: "Trends are signals, not instructions.",
    description:
      "Learn to evaluate visual trends before adopting them.",
    label: "DESIGN TRENDS",
    content:
      "A visual trend can signal a change in audience preferences, technology, or culture. But popularity alone does not make a design decision appropriate for every product.",
    exercise:
      "Choose a design trend you have noticed recently. Identify its audience, the problem it might solve, and one situation where it would not be suitable.",
    takeaway:
      "Understand why a trend works before deciding whether to use it.",
  },
  {
    number: "02",
    title: "Build a portfolio around decisions.",
    description:
      "Show the thinking behind your design work.",
    label: "CAREER PRACTICE",
    content:
      "A strong case study explains the problem, your role, your process, the trade-offs you considered, and what changed because of your work. Screenshots alone may not communicate your contribution.",
    exercise:
      "Pick one portfolio project. Write down the problem, your specific contribution, one important design decision, and the result you can honestly demonstrate.",
    takeaway:
      "Explain your reasoning and contribution, not just the final visuals.",
  },
  {
    number: "03",
    title: "Connect design to user needs.",
    description:
      "Evaluate designs by usefulness as well as appearance.",
    label: "PRODUCT THINKING",
    content:
      "Design work balances user needs, accessibility, technical constraints, and business goals. A visually impressive interface still needs to help its intended users complete meaningful tasks.",
    exercise:
      "Choose one screen from an app you use. Identify its primary user goal, one possible usability barrier, and one improvement you would test.",
    takeaway:
      "Good design connects visual choices to real user needs.",
  },
];

function NetworkArtwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let frameId = 0;
    let nodes = [];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      nodes = Array.from({ length: 42 }, () => ({
        x: 8 + Math.random() * Math.max(width - 16, 1),
        y: 8 + Math.random() * Math.max(height - 16, 1),
        vx: (Math.random() - 0.5) * 0.48,
        vy: (Math.random() - 0.5) * 0.48,
        radius: 1.4 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      }));
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#030405";
      ctx.fillRect(0, 0, width, height);

      const spacing = 38;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(125, 145, 156, 0.13)";
      ctx.lineWidth = 0.6;
      for (let x = 0; x <= width; x += spacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += spacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      ctx.fillStyle = "rgba(151, 165, 173, 0.42)";
      for (let x = 0; x <= width; x += spacing) {
        for (let y = 0; y <= height; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.05, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reducedMotion) {
        nodes.forEach((node) => {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 4 || node.x > width - 4) node.vx *= -1;
          if (node.y < 4 || node.y > height - 4) node.vy *= -1;
          node.x = Math.max(4, Math.min(width - 4, node.x));
          node.y = Math.max(4, Math.min(height - 4, node.y));
        });
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 105) {
            const opacity = (1 - distance / 105) * 0.47;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(48, 190, 239, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        const pulse = reducedMotion ? 0 : Math.sin(performance.now() * 0.002 + node.phase) * 0.55;
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1, node.radius + pulse), 0, Math.PI * 2);
        ctx.fillStyle = "#48c9f1";
        ctx.shadowColor = "#23bce9";
        ctx.shadowBlur = 7;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      const markers = [
        { x: width * 0.19, y: height * 0.27, label: "1C:16" },
        { x: width * 0.79, y: height * 0.72, label: "2A:2C" },
      ];
      markers.forEach((marker) => {
        ctx.beginPath();
        ctx.moveTo(marker.x - 6, marker.y);
        ctx.lineTo(marker.x + 6, marker.y);
        ctx.moveTo(marker.x, marker.y - 6);
        ctx.lineTo(marker.x, marker.y + 6);
        ctx.strokeStyle = "rgba(231, 244, 250, 0.8)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, 9, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(50, 188, 233, 0.33)";
        ctx.stroke();
        ctx.fillStyle = "rgba(91, 205, 240, 0.9)";
        ctx.font = "9px monospace";
        ctx.fillText(marker.label, marker.x + 11, marker.y - 10);
      });
    }

    function animate() {
      draw();
      if (!reducedMotion) frameId = requestAnimationFrame(animate);
    }

    resize();
    if (!reducedMotion) frameId = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="network-canvas" aria-hidden="true" />;
}

function App() {
  const [page, setPage] = useState("Discover");
  const [designs, setDesigns] = useState([]);
  const [exploreDesigns, setExploreDesigns] = useState([]);
const [explorePage, setExplorePage] = useState(1);
const [exploreHasNextPage, setExploreHasNextPage] = useState(false);
const [exploreLoading, setExploreLoading] = useState(false);
const [exploreError, setExploreError] = useState("");
const [exploreTotal, setExploreTotal] = useState(0);
  const [followingDesigns, setFollowingDesigns] = useState([]);
const [followingLoading, setFollowingLoading] = useState(false);
const [followingError, setFollowingError] = useState("");
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [myDesigns, setMyDesigns] = useState([]);
  const [likedDesignIds, setLikedDesignIds] = useState([]);
  // Comment feature state
const [comments, setComments] = useState([]);
const [commentsLoading, setCommentsLoading] = useState(false);
const [commentsError, setCommentsError] = useState("");
const [newComment, setNewComment] = useState("");
const [commentBusy, setCommentBusy] = useState(false);
const [editingCommentId, setEditingCommentId] = useState(null);
const [editingCommentText, setEditingCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveNotice, setSaveNotice] = useState(null);
  useEffect(() => {
  if (!saveNotice) return;

  const timer = setTimeout(() => {
    setSaveNotice(null);
  }, 3000);

  return () => clearTimeout(timer);
}, [saveNotice]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All work");
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedDesignLesson, setSelectedDesignLesson] = useState(null);
  const [selectedStudioChallenge, setSelectedStudioChallenge] = useState(null);
const [selectedStudioChoice, setSelectedStudioChoice] = useState(null);
const [studioSubmitted, setStudioSubmitted] = useState(false);
const [studioAchievementNotice, setStudioAchievementNotice] = useState("");
const [completedStudioChallenges, setCompletedStudioChallenges] = useState(() => {
  try {
    const saved = JSON.parse(
      localStorage.getItem("palette_studio_completed") || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
});
useEffect(() => {
  localStorage.setItem(
    "palette_studio_completed",
    JSON.stringify(completedStudioChallenges)
  );
}, [completedStudioChallenges]);

const DESIGN_STUDIO_CHALLENGES = [
  {
    id: "clear-cta",
    title: "Make the main action clear",
    level: "Beginner",
    brief:
      "A signup page has three equally prominent buttons. Users don't know which one to click.",
    question: "What would improve the visual hierarchy?",
    options: [
      "Give the main signup button the strongest visual emphasis",
      "Make all three buttons larger",
      "Add more colours to every button",
    ],
    answer: 0,
    feedback:
      "Correct! A clear primary action helps users understand the next step.",
  },
  {
    id: "readable-type",
    title: "Fix the typography",
    level: "Beginner",
    brief:
      "A mobile screen uses tiny text for its heading and large text for less important details.",
    question: "What should you change first?",
    options: [
      "Make every text element the same size",
      "Create a clear type hierarchy for headings and body text",
      "Use a different font for every sentence",
    ],
    answer: 1,
    feedback:
      "Correct! A deliberate type hierarchy makes content easier to scan.",
  },
  {
    id: "empty-state",
    title: "Design a helpful empty state",
    level: "Beginner",
    brief:
      "A user's saved-designs page is empty, and the screen gives no explanation or guidance.",
    question: "What would make this experience better?",
    options: [
      "Leave the screen completely blank",
      "Show an error message even though nothing is broken",
      "Explain that no designs are saved and provide a useful next action",
    ],
    answer: 2,
    feedback:
      "Correct! Helpful empty states explain what's happening and guide users forward.",
  },
];

const DESIGN_STUDIO_ACHIEVEMENTS = [
  {
    id: "first-step",
    title: "First Step",
    description: "Complete your first Studio challenge.",
    icon: "🏁",
    requiredCompletions: 1,
  },
  {
    id: "design-explorer",
    title: "Design Explorer",
    description: "Complete two Studio challenges.",
    icon: "🎨",
    requiredCompletions: 2,
  },
  {
    id: "studio-master",
    title: "Studio Master",
    description: "Complete all three Studio challenges.",
    icon: "🏆",
    requiredCompletions: 3,
  },
];

const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
const [quizSubmitted, setQuizSubmitted] = useState(false);
const [selectedPracticeOption, setSelectedPracticeOption] = useState(null);

const [designProgress, setDesignProgress] = useState(() => {
  const defaultProgress = {
  completedLessonIds: [],
  mistakes: [],
  xp: 0,
  streak: 0,
  lastStudyDate: "",
};

  try {
    const saved = localStorage.getItem("palette_design_progress");

    if (!saved) return defaultProgress;

    const parsed = JSON.parse(saved);

    if (!parsed || !Array.isArray(parsed.completedLessonIds)) {
      return defaultProgress;
    }

    return {
  completedLessonIds: parsed.completedLessonIds,
  mistakes: Array.isArray(parsed.mistakes)
    ? parsed.mistakes
    : [],
  xp: Number(parsed.xp) || 0,
  streak: Number(parsed.streak) || 0,
  lastStudyDate:
    typeof parsed.lastStudyDate === "string"
      ? parsed.lastStudyDate
      : "",
};
  } catch {
    return defaultProgress;
  }
});

useEffect(() => {
  try {
    localStorage.setItem(
      "palette_design_progress",
      JSON.stringify(designProgress)
    );
  } catch {
    // Learning still works if browser storage is unavailable.
  }
}, [designProgress]);
  const [selectedMarketNote, setSelectedMarketNote] = useState(null);

  // Public creator profile state
const [publicCreator, setPublicCreator] = useState(null);
const [creatorDesigns, setCreatorDesigns] = useState([]);
const [creatorLoading, setCreatorLoading] = useState(false);
const [creatorError, setCreatorError] = useState("");
const [isFollowingCreator, setIsFollowingCreator] = useState(false);
const [creatorFollowersCount, setCreatorFollowersCount] = useState(0);
const [followBusy, setFollowBusy] = useState(false);
const [followError, setFollowError] = useState("");

  const [token, setToken] = useState(() => localStorage.getItem("palette_token") || "");
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  // Profile editing state
const [profileEditOpen, setProfileEditOpen] = useState(false);
const [profileEditBusy, setProfileEditBusy] = useState(false);
const [profileEditError, setProfileEditError] = useState("");

const [profileName, setProfileName] = useState("");
const [profileUsername, setProfileUsername] = useState("");
const [profileImage, setProfileImage] = useState("");
const [profileBio, setProfileBio] = useState("");
const [profileHeadline, setProfileHeadline] = useState("");
const [profileSkills, setProfileSkills] = useState("");


  // Publish design form state.
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishBusy, setPublishBusy] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [designTitle, setDesignTitle] = useState("");
  const [designDescription, setDesignDescription] = useState("");
  const [designImageUrl, setDesignImageUrl] = useState("");
  const [imageUploadBusy, setImageUploadBusy] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [designCategory, setDesignCategory] = useState("UI/UX");
  const [designTags, setDesignTags] = useState("");
  const [designTools, setDesignTools] = useState("");

  // Edit published design state
const [editingDesign, setEditingDesign] = useState(null);
const [editDesignBusy, setEditDesignBusy] = useState(false);
const [editDesignError, setEditDesignError] = useState("");

const [editTitle, setEditTitle] = useState("");
const [editDescription, setEditDescription] = useState("");
const [editImageUrl, setEditImageUrl] = useState("");
const [editCategory, setEditCategory] = useState("UI/UX");
const [editTags, setEditTags] = useState("");
const [editTools, setEditTools] = useState("");

  const loadDesigns = useCallback(async () => {
  try {
    const response = await fetch(`${API}/designs`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not load designs.");
    }

    setDesigns(Array.isArray(result.designs) ? result.designs : []);
    setError("");
  } catch (err) {
    setError(err.message || "Could not connect to the backend.");
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
  let cancelled = false;

  async function fetchInitialDesigns() {
    try {
      const response = await fetch(`${API}/designs`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load designs."
        );
      }

      if (!cancelled) {
        setDesigns(
          Array.isArray(result.designs) ? result.designs : []
        );
        setError("");
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err.message || "Could not connect to the backend."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  fetchInitialDesigns();

  return () => {
    cancelled = true;
  };
}, []);

  useEffect(() => {
  if (!token) return undefined;
    let cancelled = false;
    async function loadProfile() {
      try {
        const response = await fetch(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Session expired.");
        }
        if (!cancelled) setUser(result.user);
      } catch {
        if (!cancelled) {
          localStorage.removeItem("palette_token");
          setToken("");
          setUser(null);
        }
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const loadSavedDesigns = useCallback(async () => {
    
    try {
      const response = await fetch(`${API}/designs/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load saved references.");
      }
      setSavedDesigns(result.savedDesigns || []);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  const loadMyDesigns = useCallback(async () => {
    
    try {
      const response = await fetch(`${API}/designs/my-designs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load your work.");
      }
      setMyDesigns(result.designs || []);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  const loadFollowingDesigns = useCallback(async () => {
  if (!token) {
    setFollowingDesigns([]);
    setFollowingError("");
    return;
  }

  setFollowingLoading(true);
  setFollowingError("");

  try {
    const response = await fetch(`${API}/designs/following`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Could not load your following feed."
      );
    }

    setFollowingDesigns(
      Array.isArray(result.designs) ? result.designs : []
    );
  } catch (err) {
    setFollowingError(
      err.message || "Could not load your following feed."
    );
  } finally {
    setFollowingLoading(false);
  }
}, [token]);


const loadExplorePage = useCallback(async (requestedPage = 1, append = false) => {
  setExploreLoading(true);
  setExploreError("");

  try {
    const response = await fetch(
      `${API}/designs?page=${requestedPage}&limit=12`
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Could not load Explore designs."
      );
    }

    const newDesigns = Array.isArray(result.designs)
      ? result.designs
      : [];

    setExploreDesigns((current) =>
      append ? [...current, ...newDesigns] : newDesigns
    );

    setExplorePage(result.pagination?.page ?? requestedPage);
    setExploreHasNextPage(
      Boolean(result.pagination?.hasNextPage)
    );
    setExploreTotal(Number(result.pagination?.total) || 0);
  } catch (err) {
    setExploreError(
      err.message || "Could not load Explore designs."
    );
  } finally {
    setExploreLoading(false);
  }
}, []);


  const loadComments = useCallback(async (designId) => {
    if (!designId) {
      setComments([]);
      return;
    }

    setCommentsLoading(true);
    setCommentsError("");

    try {
      const response = await fetch(
        `${API}/designs/${designId}/comments`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load comments.");
      }

      setComments(
        Array.isArray(result.comments) ? result.comments : []
      );
    } catch (err) {
      setCommentsError(
        err.message || "Could not load comments."
      );
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  

  useEffect(() => {
  if (!token) return;

  let cancelled = false;

  async function fetchSavedReferences() {
    try {
      const response = await fetch(`${API}/designs/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load saved references."
        );
      }

      if (!cancelled) {
        setSavedDesigns(
          Array.isArray(result.savedDesigns)
            ? result.savedDesigns
            : []
        );
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err.message || "Could not load saved references."
        );
      }
    }
  }

  fetchSavedReferences();

  return () => {
    cancelled = true;
  };
}, [token]);

  // Load the designs liked by the logged-in user
useEffect(() => {
  if (!token) return;

  let cancelled = false;

  async function loadLikedDesigns() {
    try {
      const response = await fetch(`${API}/designs/likes/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load your liked designs."
        );
      }

      if (!cancelled) {
        setLikedDesignIds(
          Array.isArray(result.likedDesignIds)
            ? result.likedDesignIds.map(String)
            : []
        );
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Could not load your liked designs.");
      }
    }
  }

  loadLikedDesigns();

  return () => {
    cancelled = true;
  };
}, [token]);

  useEffect(() => {
  if (!token) return;

  let cancelled = false;

  async function loadCurrentPageData() {
    try {
      if (page === "Boards") {
        const response = await fetch(`${API}/designs/saved`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not load saved references."
          );
        }

        if (!cancelled) {
          setSavedDesigns(
            Array.isArray(result.savedDesigns)
              ? result.savedDesigns
              : []
          );
        }
      } else if (page === "Profile") {
        const response = await fetch(`${API}/designs/my-designs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not load your work."
          );
        }

        if (!cancelled) {
          setMyDesigns(
            Array.isArray(result.designs) ? result.designs : []
          );
        }
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Could not load your account data.");
      }
    }
  }

  if (page === "Boards" || page === "Profile") {
    loadCurrentPageData();
  }

  return () => {
    cancelled = true;
  };
}, [page, token]);

  const filteredDesigns = useMemo(() => {
    const term = search.trim().toLowerCase();
    return exploreDesigns.filter((design) => {
      const searchable = [
        design.title,
        design.description,
        design.category,
        design.creator?.name,
        design.creator?.username,
        ...(design.tags || []),
        ...(design.tools || []),
      ].filter(Boolean).join(" ").toLowerCase();
      const categoryMatches = category === "All work" ||
        design.category?.toLowerCase().includes(category.toLowerCase()) ||
        (category === "Product Design" && design.category?.toLowerCase().includes("ui/ux"));
      return categoryMatches && searchable.includes(term);
    });
  }, [exploreDesigns, search, category]);

  async function handleAuth(event) {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try {
      if (authMode === "signup") {
        const registerResponse = await fetch(`${API}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, username, email, password }),
        });
        const registration = await registerResponse.json();
        if (!registerResponse.ok || !registration.success) {
          throw new Error(registration.message || "Registration failed.");
        }
      }

      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.token) {
        throw new Error(result.message || "Login failed.");
      }

      localStorage.setItem("palette_token", result.token);
      setToken(result.token);
      setUser(result.user || null);
      setAuthOpen(false);
      setPassword("");
      setAuthError("");
    } catch (err) {
      setAuthError(err.message || "Something went wrong. Please try again.");
    } finally {
      setAuthBusy(false);
    }
  }


  function openAuth(mode = "login") {
    setAuthMode(mode);
    setAuthError("");
    setAuthOpen(true);
  }

  function logout() {
  localStorage.removeItem("palette_token");
  setToken("");
  setUser(null);
  setSavedDesigns([]);
  setMyDesigns([]);
  setLikedDesignIds([]);
  setPage("Discover");
}

  function openDesign(design) {
  setSelectedDesign(design);
  setComments([]);
  setCommentsError("");
  setNewComment("");
  setEditingCommentId(null);
  setEditingCommentText("");
  loadComments(design._id);
}

  function showWorkFeed() {
    setPage("Explore");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(design, isSaved) {
  if (!token) {
    openAuth("login");
    return;
  }

  try {
    const response = await fetch(
      `${API}/designs/${design._id}/save`,
      {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Could not update saved reference."
      );
    }

    await loadSavedDesigns();

    setSaveNotice({
      type: "success",
      message: isSaved
        ? "Reference removed successfully."
        : "Reference saved successfully.",
    });
  } catch (err) {
    setSaveNotice({
      type: "error",
      message: err.message || "Could not update saved reference.",
    });
  }
}

async function handleImageUpload(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.type)) {
    setPublishError("Choose a JPG, PNG, WEBP, or GIF image.");
    input.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setPublishError("Image size must be 5 MB or less.");
    input.value = "";
    return;
  }

  if (!token) {
    openAuth("login");
    input.value = "";
    return;
  }

  setImageUploadBusy(true);
  setPublishError("");

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API}/designs/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success || !result.imageUrl) {
      throw new Error(result.message || "Image upload failed.");
    }

    setDesignImageUrl(result.imageUrl);
    setUploadedImageName(file.name);
  } catch (err) {
    setPublishError(
      err.message || "Could not upload the image. Please try again."
    );
  } finally {
    setImageUploadBusy(false);
    input.value = "";
  }
}

  function resetPublishForm() {
    setDesignTitle("");
    setDesignDescription("");
    setDesignImageUrl("");
    setDesignCategory("UI/UX");
    setDesignTags("");
    setDesignTools("");
    setPublishError("");
  }

  async function handlePublish(event) {
    event.preventDefault();
    if (!token) {
      setPublishOpen(false);
      openAuth("login");
      return;
    }

    setPublishBusy(true);
    setPublishError("");

    const payload = {
      title: designTitle.trim(),
      description: designDescription.trim(),
      imageUrl: designImageUrl.trim(),
      category: designCategory,
      tags: designTags.split(",").map((tag) => tag.trim()).filter(Boolean),
      tools: designTools.split(",").map((tool) => tool.trim()).filter(Boolean),
    };

    try {
      const response = await fetch(`${API}/designs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not publish this design.");
      }

      resetPublishForm();
      setPublishOpen(false);
      setPage("Profile");
      await loadDesigns();
      await loadMyDesigns();
    } catch (err) {
      setPublishError(err.message || "Could not publish this design.");
    } finally {
      setPublishBusy(false);
    }
  }
  
  
async function handleCreateComment(event) {
  event.preventDefault();

  if (!token) {
    openAuth("login");
    return;
  }

  if (!selectedDesign || !newComment.trim()) {
    setCommentsError("Please enter a comment.");
    return;
  }

  setCommentBusy(true);
  setCommentsError("");

  try {
    const response = await fetch(
      `${API}/designs/${selectedDesign._id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newComment.trim(),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not post comment.");
    }

    setNewComment("");
    await loadComments(selectedDesign._id);
  } catch (err) {
    setCommentsError(err.message || "Could not post comment.");
  } finally {
    setCommentBusy(false);
  }
}


async function handleUpdateComment(event, commentId) {
  event.preventDefault();

  if (!token || !selectedDesign) {
    openAuth("login");
    return;
  }

  const text = editingCommentText.trim();

  if (!text) {
    setCommentsError("Comment text cannot be empty.");
    return;
  }

  setCommentBusy(true);
  setCommentsError("");

  try {
    const response = await fetch(
      `${API}/designs/${selectedDesign._id}/comments/${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not update comment.");
    }

    setEditingCommentId(null);
    setEditingCommentText("");

    await loadComments(selectedDesign._id);
  } catch (err) {
    setCommentsError(err.message || "Could not update comment.");
  } finally {
    setCommentBusy(false);
  }
}

async function handleDeleteComment(commentId) {
  if (!token || !selectedDesign) {
    openAuth("login");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!confirmed) return;

  setCommentBusy(true);
  setCommentsError("");

  try {
    const response = await fetch(
      `${API}/designs/${selectedDesign._id}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Could not delete comment."
      );
    }

    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setEditingCommentText("");
    }

    await loadComments(selectedDesign._id);
  } catch (err) {
    setCommentsError(
      err.message || "Could not delete comment."
    );
  } finally {
    setCommentBusy(false);
  }
}

async function openCreatorProfile(username) {
  if (!username) return;

  setPage("Creator");
  setCreatorLoading(true);
  setCreatorError("");
  setPublicCreator(null);
  setCreatorDesigns([]);

  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const profileResponse = await fetch(
      `${API}/users/profile/${encodeURIComponent(username)}`
    );

    const profileResult = await profileResponse.json();

    if (!profileResponse.ok || !profileResult.success) {
      throw new Error(
        profileResult.message || "Could not load this creator's profile."
      );
    }

    const designsResponse = await fetch(`${API}/designs`);
    const designsResult = await designsResponse.json();

    if (!designsResponse.ok || !designsResult.success) {
      throw new Error(
        designsResult.message || "Could not load this creator's work."
      );
    }

    const creator = profileResult.user;

    if (token) {
  try {
    const followResponse = await fetch(
      `${API}/users/${creator._id}/follow-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const followResult = await followResponse.json();

    if (!followResponse.ok || !followResult.success) {
      throw new Error(
        followResult.message || "Could not load follow status."
      );
    }

    setIsFollowingCreator(Boolean(followResult.isFollowing));
    setCreatorFollowersCount(
      Number(followResult.followersCount) || 0
    );
    setFollowError("");
  } catch (followErr) {
    setFollowError(
      followErr.message || "Could not load follow status."
    );
  }
} else {
  setIsFollowingCreator(false);
  setCreatorFollowersCount(0);
  setFollowError("");
}

    const works = Array.isArray(designsResult.designs)
      ? designsResult.designs.filter(
          (design) =>
            String(design.creator?.username || "").toLowerCase() ===
            String(creator.username).toLowerCase()
        )
      : [];

    setPublicCreator(creator);
    setCreatorDesigns(works);
  } catch (err) {
    setCreatorError(
      err.message || "Could not load this creator's profile."
    );
  } finally {
    setCreatorLoading(false);
  }
}

async function handleToggleFollow() {
  if (!token) {
    openAuth("login");
    return;
  }

  if (!publicCreator?._id || followBusy) {
    return;
  }

  if (user && String(user._id) === String(publicCreator._id)) {
    setFollowError("You cannot follow yourself.");
    return;
  }

  setFollowBusy(true);
  setFollowError("");

  try {
    const response = await fetch(
      `${API}/users/${publicCreator._id}/follow`,
      {
        method: isFollowingCreator ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Could not update follow status."
      );
    }

    setIsFollowingCreator(Boolean(result.isFollowing));
    setCreatorFollowersCount(
      Number(result.followersCount) || 0
    );
  } catch (err) {
    setFollowError(
      err.message || "Could not update follow status."
    );
  } finally {
    setFollowBusy(false);
  }
}

function openProfileEditor() {
  setProfileName(user?.name || "");
  setProfileUsername(user?.username || "");
  setProfileImage(user?.profileImage || "");
  setProfileBio(user?.bio || "");
  setProfileHeadline(user?.headline || "");
  setProfileSkills((user?.skills || []).join(", "));
  setProfileEditError("");
  setProfileEditOpen(true);
}

async function handleProfileUpdate(event) {
  event.preventDefault();

  if (!token) {
    openAuth("login");
    return;
  }

  setProfileEditBusy(true);
  setProfileEditError("");

  const payload = {
    name: profileName.trim(),
    username: profileUsername.trim(),
    profileImage: profileImage.trim(),
    bio: profileBio.trim(),
    headline: profileHeadline.trim(),
    skills: profileSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
  };

  try {
    const response = await fetch(`${API}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not update your profile.");
    }

    setUser(result.user);
    setProfileEditOpen(false);
  } catch (err) {
    setProfileEditError(
      err.message || "Could not update your profile."
    );
  } finally {
    setProfileEditBusy(false);
  }
}

function openEditDesign(design) {
  setEditingDesign(design);
  setEditTitle(design.title || "");
  setEditDescription(design.description || "");
  setEditImageUrl(design.imageUrl || "");
  setEditCategory(design.category || "UI/UX");
  setEditTags((design.tags || []).join(", "));
  setEditTools((design.tools || []).join(", "));
  setEditDesignError("");
}

async function handleUpdateDesign(event) {
  event.preventDefault();

  if (!token || !editingDesign) {
    openAuth("login");
    return;
  }

  setEditDesignBusy(true);
  setEditDesignError("");

  const payload = {
    title: editTitle.trim(),
    description: editDescription.trim(),
    imageUrl: editImageUrl.trim(),
    category: editCategory,
    tags: editTags.split(",").map((tag) => tag.trim()).filter(Boolean),
    tools: editTools.split(",").map((tool) => tool.trim()).filter(Boolean),
  };

  try {
    const response = await fetch(
      `${API}/designs/${editingDesign._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not update this design.");
    }

    setEditingDesign(null);

    await loadDesigns();
    await loadMyDesigns();
    await loadSavedDesigns();
  } catch (err) {
    setEditDesignError(
      err.message || "Could not update this design."
    );
  } finally {
    setEditDesignBusy(false);
  }
}


async function handleDeleteDesign(design) {
  if (!token) {
    openAuth("login");
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete "${design.title}"? This cannot be undone.`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${API}/designs/${design._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Could not delete this project."
      );
    }

    if (selectedDesign?._id === design._id) {
      setSelectedDesign(null);
    }

    await loadDesigns();
    await loadMyDesigns();
    await loadSavedDesigns();

    window.alert("Project deleted successfully.");
  } catch (err) {
    window.alert(err.message || "Could not delete this project.");
  }
}


async function handleLike(design) {
  if (!token) {
    openAuth("login");
    return;
  }

  const isLiked = likedDesignIds.includes(design._id);

  try {
    const response = await fetch(
      `${API}/designs/${design._id}/like`,
      {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not update like.");
    }

    setLikedDesignIds((current) =>
      isLiked
        ? current.filter((id) => id !== design._id)
        : [...current, design._id]
    );

    const updateLikes = (item) =>
      item._id === design._id
        ? { ...item, likes: result.likes ?? item.likes }
        : item;

    setDesigns((current) => current.map(updateLikes));
    setMyDesigns((current) => current.map(updateLikes));

    setSavedDesigns((current) =>
      current.map((entry) =>
        entry.design
          ? { ...entry, design: updateLikes(entry.design) }
          : entry
      )
    );
  } catch (err) {
    setError(err.message || "Could not update like.");
  }
}


  function renderDesignCard(design, index = 0) {
    const isSaved = savedDesigns.some((entry) => entry.design?._id === design._id);
    return (
      <article className="work-card" key={design._id}>
        <button
          type="button"
          className={`work-image work-image-${index % 4}`}
          onClick={() => openDesign(design)}
          aria-label={`Open ${design.title}`}
        >
          {design.imageUrl ? (
            <img
              src={design.imageUrl}
              alt={design.title}
              loading="lazy"
              onError={(event) => { event.currentTarget.style.display = "none"; }}
            />
          ) : null}
          <span className="image-placeholder">
            <span className="placeholder-kicker">{design.category || "CREATIVE PRACTICE"}</span>
            <span className="placeholder-title">{design.title}</span>
            <span className="placeholder-mark">✳</span>
          </span>
          <span className="image-open">↗</span>
        </button>

        <div className="work-meta">
          <div>
  <h3>{design.title}</h3>

  {design.creator?.username ? (
    <button
      type="button"
      className="creator-name-link"
      onClick={() => openCreatorProfile(design.creator.username)}
    >
      {design.creator.name || `@${design.creator.username}`}
    </button>
  ) : (
    <p>Community contribution</p>
  )}
</div>

<button
  type="button"
  className={`work-likes like-button ${
    likedDesignIds.includes(design._id) ? "is-liked" : ""
  }`}
  onClick={(event) => {
    event.stopPropagation();
    handleLike(design);
  }}
  aria-label={
    likedDesignIds.includes(design._id)
      ? `Unlike ${design.title}`
      : `Like ${design.title}`
  }
  aria-pressed={likedDesignIds.includes(design._id)}
>
  <span aria-hidden="true">
    {likedDesignIds.includes(design._id) ? "♥" : "♡"}
  </span>
  {design.likes ?? 0}
</button>
        </div>

        {design.tags?.length > 0 && (
          <div className="work-tags">
            {design.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
          </div>
        )}

        {token && (
          <button
            type="button"
            className={`save-inline ${isSaved ? "is-saved" : ""}`}
            onClick={() => handleSave(design, isSaved)}
          >
            {isSaved ? "✓ Saved reference" : "+ Save reference"}
          </button>
        )}
                {page === "Profile" && token && (
  <>
    <button
      type="button"
      className="edit-project-button"
      onClick={() => openEditDesign(design)}
    >
      EDIT PROJECT ↗
    </button>

    <button
      type="button"
      className="delete-project-button"
      onClick={() => handleDeleteDesign(design)}
    >
      DELETE PROJECT ×
    </button>
  </>
)}
      </article>
    );
  }

  return (
    <div className="palette-app">
    {saveNotice && (
  <div
    className={`save-toast ${
      saveNotice.type === "error"
        ? "save-toast-error"
        : "save-toast-success"
    }`}
    role="status"
    aria-live="polite"
  >
    <span aria-hidden="true">
      {saveNotice.type === "error" ? "⚠" : "✓"}
    </span>

    <span>{saveNotice.message}</span>

    <button
      type="button"
      onClick={() => setSaveNotice(null)}
      aria-label="Dismiss notification"
    >
      ×
    </button>
  </div>
)}
      <header className="palette-header">
        <a
          href="#top"
          className="palette-wordmark"
          onClick={(event) => {
            event.preventDefault();
            setPage("Discover");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="palette-logo">P</span>
          <span>PALETTE</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item}
              className={page === item ? "nav-item active" : "nav-item"}
              onClick={() => {
  setPage(item);

  if (item === "Following") {
    loadFollowingDesigns();
  }

  if (item === "Explore") {
    loadExplorePage(1, false);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}}
            >
              {item}
            </button>
          ))}
        </nav>

        
<div className="header-actions">
  {user ? (
    <>
      <button
        type="button"
        className="join-button publish-button"
        onClick={() => {
          setPublishError("");
          setPublishOpen(true);
        }}
      >
        + PUBLISH WORK
      </button>

      <button
        type="button"
        className="profile-button"
        onClick={() => setPage("Profile")}
      >
        {user.profileImage ? (
  <img
    src={user.profileImage}
    alt=""
    className="header-avatar-image"
  />
) : (
  "♙"
)}

<span>{user.username || user.name || "Profile"}</span>
      </button>

      <button
        type="button"
        className="join-button"
        onClick={logout}
      >
        LOG OUT ↗
      </button>
    </>
  ) : (
    <>
      <button
        type="button"
        className="profile-button"
        onClick={() => openAuth("login")}
      >
        ♙ <span>Profile</span>
      </button>

      <button
        type="button"
        className="join-button"
        onClick={() => openAuth("signup")}
      >
        JOIN / LOG IN <span>↗</span>
      </button>
    </>
  )}
</div>

      </header>

      <main className="palette-main">
        {page === "Discover" && (
          <>
            <section className="palette-hero" id="top">
              <div className="hero-copy">
                <div className="editorial-kicker">ISSUE NO. 01 <span>/</span> A LIVING INDEX OF PRACTICE</div>
                <h1>See what<br /><em>design is becoming.</em></h1>
                <p>
                  Palette is a human-curated place to look closely, learn deliberately,
                  and keep the references that make your work better.
                </p>
                <div className="hero-buttons">
                  <button type="button" className="button-dark" onClick={showWorkFeed}>EXPLORE THE INDEX ↗</button>
                  <button type="button" className="button-outline" onClick={() => setPage("Learn")}>START A LEARNING TRAIL ↗</button>
                </div>
              </div>

              <button type="button" className="hero-feature" onClick={showWorkFeed} aria-label="Explore the animated PALETTE network">
                <NetworkArtwork />
                <div className="feature-center">
                  <div className="feature-name">PALETTE</div>
                  <p>Human-led design intelligence in motion.</p>
                </div>
                <span className="feature-link">THE INDEX ↗</span>
              </button>
            </section>

            <section className="dna-section">
              <div className="section-overline">YOUR PRACTICE / THE INDEX</div>
              <div className="section-title-row">
                <div>
                  <h2>Design DNA</h2>
                  <p>A closer look at the details, decisions, and ideas behind creative work.</p>
                </div>
                <button type="button" className="text-link" onClick={showWorkFeed}>VIEW ALL WORK ↗</button>
              </div>

              {loading ? (
                <div className="status-panel">Loading the design index…</div>
              ) : error ? (
                <div className="status-panel status-error">
                  <strong>The index couldn't load.</strong><p>{error}</p>
                  <button type="button" onClick={() => {
  setLoading(true);
  setError("");
  loadDesigns();
}}>TRY AGAIN ↗</button>
                </div>
              ) : designs.length === 0 ? (
                <div className="status-panel">
                  <strong>The index is taking shape.</strong>
                  <p>Published work will appear here as the creative community grows.</p>
                  <button type="button" onClick={() => openAuth("signup")}>JOIN THE COMMUNITY ↗</button>
                </div>
              ) : (
                <div className="work-grid">
                  {designs.slice(0, 4).map((design, index) => renderDesignCard(design, index))}
                </div>
              )}
            </section>
          </>
        )}

        {page === "Explore" && (
          <section className="inner-page">
            <div className="section-overline">THE INDEX / OPEN REFERENCES</div>
            <h1 className="inner-heading">Explore<br /><em>the work.</em></h1>
            <p className="inner-intro">Browse by the questions designers are asking, not only the categories they use.</p>
            <label className="index-search">
              <span>⌕</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try: quiet, bold, typography..." />
            </label>
            <div className="filter-row">
              {CATEGORIES.map((item) => (
                <button type="button" key={item} className={category === item ? "filter-chip chosen" : "filter-chip"} onClick={() => setCategory(item)}>
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
                        {exploreError && (
              <div className="status-panel status-error">
                <strong>Explore couldn't load.</strong>
                <p>{exploreError}</p>
                <button
                  type="button"
                  onClick={() => loadExplorePage(1, false)}
                >
                  TRY AGAIN ↗
                </button>
              </div>
            )}

            {exploreLoading && exploreDesigns.length === 0 ? (
              <div className="status-panel">
                Loading references…
              </div>
            ) : filteredDesigns.length > 0 ? (
              <>
                <p className="section-overline">
                  Showing {filteredDesigns.length} matching designs
                  from {exploreDesigns.length} loaded · {exploreTotal} total
                </p>

                <div className="work-grid">
                  {filteredDesigns.map((design, index) =>
                    renderDesignCard(design, index)
                  )}
                </div>

                {exploreHasNextPage && (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
                    <button
                      type="button"
                      className="button-outline"
                      onClick={() =>
                        loadExplorePage(explorePage + 1, true)
                      }
                      disabled={exploreLoading}
                    >
                      {exploreLoading ? "LOADING…" : "LOAD MORE ↗"}
                    </button>
                  </div>
                )}
              </>
            ) : exploreLoading ? (
              <div className="status-panel">
                Loading references…
              </div>
            ) : (
              <div className="status-panel">
                <strong>
                  {exploreDesigns.length === 0
                    ? "The index is taking shape."
                    : "No loaded references match those filters."}
                </strong>

                <p>
                  {exploreDesigns.length === 0
                    ? "Published work will appear here as the creative community grows."
                    : "Try another search or category. Load more designs to search further."}
                </p>

                {exploreHasNextPage && (
                  <button
                    type="button"
                    onClick={() =>
                      loadExplorePage(explorePage + 1, true)
                    }
                    disabled={exploreLoading}
                  >
                    LOAD MORE DESIGNS ↗
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All work");
                  }}
                >
                  RESET FILTERS ↗
                </button>
              </div>
            )}
          </section>
        )}

        
        {page === "Following" && (
  <section className="inner-page">
    <div className="section-overline">
      YOUR NETWORK / FOLLOWING
    </div>

    <h1 className="inner-heading">
      Your creative<br />
      <em>circle.</em>
    </h1>

    <p className="inner-intro">
      Discover the latest work from the designers you follow.
    </p>

    {!token ? (
      <div className="status-panel">
        <strong>Your creative circle is waiting.</strong>
        <p>Log in to see work from creators you follow.</p>
        <button
          type="button"
          onClick={() => openAuth("login")}
        >
          LOG IN TO VIEW FEED ↗
        </button>
      </div>
    ) : followingLoading ? (
      <div className="status-panel">
        Loading your following feed…
      </div>
    ) : followingError ? (
      <div className="status-panel status-error">
        <strong>Couldn't load your feed.</strong>
        <p>{followingError}</p>
        <button
          type="button"
          onClick={loadFollowingDesigns}
        >
          TRY AGAIN ↗
        </button>
      </div>
    ) : followingDesigns.length > 0 ? (
      <div className="work-grid">
        {followingDesigns.map((design, index) =>
          renderDesignCard(design, index)
        )}
      </div>
    ) : (
      <div className="status-panel">
        <strong>Your creative circle starts here.</strong>
        <p>
          Follow designers whose work inspires you.
          Their latest published designs will appear here.
        </p>
        <button
          type="button"
          onClick={() => {
            setPage("Explore");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          DISCOVER CREATORS ↗
        </button>
      </div>
    )}
  </section>
)}

        {page === "Boards" && (
          <section className="inner-page">
            <div className="section-overline">YOUR REFERENCES / SAVED WORK</div>
            <h1 className="inner-heading">Keep the<br /><em>good questions.</em></h1>
            <p className="inner-intro">Save work that gives you something to think about. Return to it when your own ideas need a nudge.</p>
            {!token ? (
              <div className="status-panel">
                <strong>Your references should travel with you.</strong><p>Log in to see and manage your saved designs.</p>
                <button type="button" onClick={() => openAuth("login")}>LOG IN TO VIEW SAVED WORK ↗</button>
              </div>
            ) : (
              <>
                <div className="shelf-heading">
                  <div><span className="section-overline">OPEN SHELVES</span><h2>Saved references</h2><p>A working shelf for designs worth returning to.</p></div>
                  <span>{savedDesigns.length} SAVED</span>
                </div>
                {savedDesigns.length ? (
                  <div className="work-grid">
                    {savedDesigns.map((entry, index) => entry.design ? renderDesignCard(entry.design, index) : null)}
                  </div>
                ) : (
                  <div className="status-panel">
                    <strong>Your shelf is still empty.</strong><p>Explore the index and save a design to start your reference library.</p>
                    <button type="button" onClick={showWorkFeed}>EXPLORE THE INDEX ↗</button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

{page === "Liked" && (
  <section className="inner-page">
    <div className="section-overline">
      YOUR PRACTICE / LIKED WORK
    </div>

    <h1 className="inner-heading">
      Keep the<br />
      <em>work that moves you.</em>
    </h1>

    <p className="inner-intro">
      A collection of designs that caught your eye and ideas worth returning to.
    </p>

    {!token ? (
      <div className="status-panel">
        <strong>Your inspiration, all in one place.</strong>
        <p>Log in to see the designs you've liked.</p>
        <button
          type="button"
          onClick={() => openAuth("login")}
        >
          LOG IN TO VIEW LIKES ↗
        </button>
      </div>
    ) : loading ? (
      <div className="status-panel">Loading your liked designs…</div>
    ) : designs.filter((design) =>
        likedDesignIds.includes(String(design._id))
      ).length > 0 ? (
      <div className="work-grid">
        {designs
          .filter((design) =>
            likedDesignIds.includes(String(design._id))
          )
          .map((design, index) => renderDesignCard(design, index))}
      </div>
    ) : (
      <div className="status-panel">
        <strong>Your liked collection is waiting to begin.</strong>
        <p>Explore the index and tap the heart on designs you love.</p>
        <button
          type="button"
          onClick={() => setPage("Explore")}
        >
          EXPLORE DESIGNS ↗
        </button>
      </div>
    )}
  </section>
)}

{page === "Creator" && (
  <section className="inner-page">
    <div className="section-overline">
      PALETTE / CREATOR PROFILE
    </div>

    {creatorLoading ? (
      <div className="status-panel">
        Loading creator profile…
      </div>
    ) : creatorError ? (
      <div className="status-panel status-error">
        <strong>Could not load this creator.</strong>
        <p>{creatorError}</p>
        <button
          type="button"
          onClick={() => setPage("Explore")}
        >
          BACK TO EXPLORE ↗
        </button>
      </div>
    ) : publicCreator ? (
      <>
        <div className="profile-summary">
          {publicCreator.profileImage ? (
            <img
              src={publicCreator.profileImage}
              alt={`${publicCreator.name}'s profile`}
              className="creator-avatar-image"
            />
          ) : (
            <span className="profile-monogram">
              {(publicCreator.name || publicCreator.username || "P")
                .charAt(0)
                .toUpperCase()}
            </span>
          )}

          <div>
            <h2>{publicCreator.name || "Palette creator"}</h2>
            <p>@{publicCreator.username}</p>
            {publicCreator.headline && (
  <p className="profile-headline">
    {publicCreator.headline}
  </p>
)}
            <span>{creatorDesigns.length} published designs</span>
          </div>
        </div>

                <div className="profile-follow-actions">
          <span>{creatorFollowersCount} followers</span>

          {(!user || String(user._id) !== String(publicCreator._id)) && (
            <button
              type="button"
              className="button-outline"
              onClick={handleToggleFollow}
              disabled={followBusy}
            >
              {followBusy
                ? "PLEASE WAIT..."
                : isFollowingCreator
                  ? "UNFOLLOW"
                  : "FOLLOW CREATOR ↗"}
            </button>
          )}

          {followError && (
            <p role="alert" className="status-error">
              {followError}
            </p>
          )}
        </div>
        {publicCreator.bio && (
          <p className="profile-bio">{publicCreator.bio}</p>
        )}

        {publicCreator.skills?.length > 0 && (
          <div className="profile-skills">
            <div className="section-overline">SKILLS & PRACTICE</div>
            <div className="work-tags">
              {publicCreator.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        <div className="shelf-heading">
          <div>
            <span className="section-overline">THE PORTFOLIO</span>
            <h2>Published work</h2>
          </div>
        </div>

        {creatorDesigns.length > 0 ? (
          <div className="work-grid">
            {creatorDesigns.map((design, index) =>
              renderDesignCard(design, index)
            )}
          </div>
        ) : (
          <div className="status-panel">
            <strong>No published designs yet.</strong>
            <p>This creator's portfolio is ready for its first project.</p>
          </div>
        )}

        <button
          type="button"
          className="button-outline"
          onClick={() => setPage("Explore")}
          style={{ marginTop: "24px" }}
        >
          ← BACK TO EXPLORE
        </button>
      </>
    ) : null}
  </section>
)}

        {page === "Learn" && (
  <section className="inner-page learn-page">
    <div className="section-overline">PALETTE ACADEMY / DESIGN PATH</div>

    

    <div className="learn-hero">
      <div>
        <p className="learn-kicker">LEVEL UP YOUR DESIGN EYE</p>
        <h1 className="inner-heading">
          Learn design,
          <br />
          <em>one small win at a time.</em>
        </h1>
        <p className="inner-intro">
          Short lessons, quick quizzes, and practical challenges to help
          you become a more thoughtful designer.
        </p>
      </div>

      <div className="learn-stats">
        <div className="learn-stat">
          <strong>{designProgress.xp}</strong>
          <span>XP earned</span>
        </div>
        <div className="learn-stat">
          <strong>{designProgress.completedLessonIds.length}</strong>
          <span>Lessons completed</span>
        </div>
        <div className="learn-stat">
          <strong>{designProgress.streak}</strong>
          <span>Day streak</span>
        </div>
      </div>
    </div>

{!selectedDesignLesson && (
  <section className="learn-revision-panel">
    <div className="learn-revision-heading">
      <div>
        <p className="learn-kicker">YOUR PERSONAL REVIEW</p>
        <h2>Smart revision</h2>
        <p>Learn from your mistakes and strengthen your design knowledge.</p>
      </div>

      <span className="learn-revision-count">
        {designProgress.mistakes.length}
      </span>
    </div>

    {designProgress.mistakes.length === 0 ? (
      <div className="learn-revision-empty">
        <span className="learn-revision-icon">✦</span>
        <div>
          <strong>You're ready to learn.</strong>
          <p>
            When you get a quiz question wrong, it will appear here
            so you can revisit it later.
          </p>
        </div>
      </div>
    ) : (
      <div className="learn-revision-list">
        {designProgress.mistakes.map((mistake) => (
          <article
            className="learn-revision-card"
            key={mistake.lessonId}
          >
            <div className="learn-revision-card-top">
              <span className="learn-revision-tag">
                NEEDS REVIEW
              </span>

              <span className="learn-revision-attempts">
                {mistake.attempts}{" "}
                {mistake.attempts === 1 ? "attempt" : "attempts"}
              </span>
            </div>

            <h3>{mistake.lessonTitle}</h3>
            <p className="learn-revision-question">
              {mistake.question}
            </p>

            <div className="learn-revision-answer">
              <span>Your previous answer</span>
              <p>{mistake.chosenAnswer}</p>
            </div>

            <div className="learn-revision-answer is-correct">
              <span>Correct answer</span>
              <p>{mistake.correctAnswer}</p>
            </div>

            <button
              type="button"
              className="learn-primary"
              onClick={() => {
                const lesson = DESIGN_UNITS
                  .flatMap((unit) =>
                    unit.lessons.map((item) => ({
                      ...item,
                      unitTitle: unit.title,
                    }))
                  )
                  .find((item) => item.id === mistake.lessonId);

                if (!lesson) return;

                setSelectedDesignLesson(lesson);
                setSelectedQuizAnswer(null);
                setQuizSubmitted(false);
                setSelectedPracticeOption(null);
              }}
            >
              REVIEW LESSON ↗
            </button>
          </article>
        ))}
      </div>
    )}
  </section>
)}


{!selectedDesignLesson && (
  <section className="learn-content">
    <div className="section-overline">HANDS-ON DESIGN</div>
    <h2>Design Practice Studio</h2>
    <p className="learn-explanation">
      Practice real UI/UX decisions through small design challenges.
      Choose a challenge, think through the problem, and check your answer.
    </p>

<p className="learn-kicker">
  STUDIO PROGRESS: {completedStudioChallenges.length} /{" "}
  {DESIGN_STUDIO_CHALLENGES.length} CHALLENGES COMPLETED
</p>

{studioAchievementNotice && (
  <div
    className="studio-achievement-notice"
    role="status"
  >
    {studioAchievementNotice}
  </div>
)}

<section className="studio-achievements">
  <p className="learn-kicker">🏆 YOUR ACHIEVEMENTS</p>

  <div className="learn-answers">
    {DESIGN_STUDIO_ACHIEVEMENTS.map((achievement) => {
      const unlocked =
        completedStudioChallenges.length >=
        achievement.requiredCompletions;

      const remaining =
        achievement.requiredCompletions -
        completedStudioChallenges.length;

      return (
        <article className="learn-lesson" key={achievement.id}>
          <div className="section-overline">
            {unlocked
              ? "✓ UNLOCKED"
              : `🔒 ${remaining} MORE CHALLENGE${remaining === 1 ? "" : "S"}`}
          </div>

          <h3>
            {achievement.icon} {achievement.title}
          </h3>

          <p className="learn-explanation">
            {achievement.description}
          </p>
        </article>
      );
    })}
  </div>
</section>

    {selectedStudioChallenge ? (
      <article className="learn-lesson">
        <button
          type="button"
          className="button-outline learn-back"
          onClick={() => {
            setSelectedStudioChallenge(null);
            setSelectedStudioChoice(null);
            setStudioSubmitted(false);
          }}
        >
          ← ALL CHALLENGES
        </button>

        <div className="section-overline">
          {selectedStudioChallenge.level} / DESIGN CHALLENGE
        </div>

        <h3>{selectedStudioChallenge.title}</h3>

        <p className="learn-explanation">
          {selectedStudioChallenge.brief}
        </p>

        <div className="learn-quiz">
          <p className="learn-kicker">YOUR DESIGN DECISION</p>
          <h3>{selectedStudioChallenge.question}</h3>

          <div className="learn-answers">
            {selectedStudioChallenge.options.map((option, index) => (
              <button
                type="button"
                key={option}
                className={`learn-answer ${
                  selectedStudioChoice === index ? "is-selected" : ""
                } ${
                  studioSubmitted &&
                  index === selectedStudioChallenge.answer
                    ? "is-correct"
                    : ""
                } ${
                  studioSubmitted &&
                  selectedStudioChoice === index &&
                  selectedStudioChoice !== selectedStudioChallenge.answer
                    ? "is-wrong"
                    : ""
                }`}
                onClick={() => {
                  setSelectedStudioChoice(index);
                  setStudioSubmitted(false);
                }}
              >
                <span className="learn-answer-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>

        {studioSubmitted && (
          <p className="learn-explanation">
            {selectedStudioChoice === selectedStudioChallenge.answer
              ? selectedStudioChallenge.feedback
              : `Not quite! The best answer is: ${
                  selectedStudioChallenge.options[
                    selectedStudioChallenge.answer
                  ]
                }`}
          </p>
        )}

        {!studioSubmitted && (
          <button
            type="button"
            className="learn-primary"
            disabled={selectedStudioChoice === null}
            onClick={() => {
  if (selectedStudioChoice === null) return;

  setStudioSubmitted(true);

  if (selectedStudioChoice === selectedStudioChallenge.answer) {
  if (!completedStudioChallenges.includes(selectedStudioChallenge.id)) {
    setDesignProgress((current) => ({
      ...current,
      xp: (current.xp || 0) + 10,
    }));
  }

  if (selectedStudioChoice === selectedStudioChallenge.answer) {
  const isNewCompletion = !completedStudioChallenges.includes(
    selectedStudioChallenge.id
  );

  if (isNewCompletion) {
    setDesignProgress((current) => ({
      ...current,
      xp: (current.xp || 0) + 10,
    }));

    const newCompletionCount = completedStudioChallenges.length + 1;

    const newlyUnlockedAchievement = DESIGN_STUDIO_ACHIEVEMENTS.find(
      (achievement) =>
        achievement.requiredCompletions === newCompletionCount
    );

    if (newlyUnlockedAchievement) {
      setStudioAchievementNotice(
        `🏆 Achievement unlocked: ${newlyUnlockedAchievement.title}!`
      );
    }
  }

  setCompletedStudioChallenges((current) =>
    current.includes(selectedStudioChallenge.id)
      ? current
      : [...current, selectedStudioChallenge.id]
  );
}
}
}}
          >
            CHECK MY DESIGN DECISION
          </button>
        )}
      </article>
    ) : (
      <div className="learn-answers">
        {DESIGN_STUDIO_CHALLENGES.map((challenge) => (
          <article className="learn-lesson" key={challenge.id}>
            <div className="section-overline">
              {challenge.level} / HANDS-ON
{completedStudioChallenges.includes(challenge.id) && (
  <span className="studio-completed-badge">✓ COMPLETED</span>
)}
            </div>

            <h3>{challenge.title}</h3>

            <p className="learn-explanation">
              {challenge.brief}
            </p>

            <button
              type="button"
              className="learn-primary"
              onClick={() => {
                setSelectedStudioChallenge(challenge);
                setSelectedStudioChoice(null);
                setStudioSubmitted(false);
                setStudioAchievementNotice("");
              }}
            >
              START CHALLENGE ↗
            </button>
          </article>
        ))}
      </div>
    )}
  </section>
)}


    {selectedDesignLesson ? (
      
      <div className="learn-content">
        <button
          type="button"
          className="button-outline learn-back"
          onClick={() => {
            setSelectedDesignLesson(null);
            setSelectedQuizAnswer(null);
            setQuizSubmitted(false);
          }}
        >
          ← BACK TO LEARNING PATH
        </button>

        <article className="learn-lesson">
          <div className="section-overline">
            {selectedDesignLesson.unitTitle} /{" "}
            {selectedDesignLesson.duration}
          </div>

          <h2>{selectedDesignLesson.title}</h2>
          <p className="learn-explanation">
            {selectedDesignLesson.explanation}
          </p>

          <div className="learn-quiz">
            <p className="learn-kicker">QUICK CHECK</p>
            <h3>{selectedDesignLesson.question}</h3>

            <div className="learn-answers">
              {selectedDesignLesson.options.map((option, answerIndex) => (
                <button
                  type="button"
                  key={option}
                  className={`learn-answer ${
                    selectedQuizAnswer === answerIndex ? "is-selected" : ""
                  } ${
                    quizSubmitted &&
                    answerIndex === selectedDesignLesson.answer
                      ? "is-correct"
                      : ""
                  } ${
                    quizSubmitted &&
                    selectedQuizAnswer === answerIndex &&
                    selectedQuizAnswer !== selectedDesignLesson.answer
                      ? "is-wrong"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedQuizAnswer(answerIndex);
                    setQuizSubmitted(false);
                  }}
                >
                  <span className="learn-answer-letter">
                    {String.fromCharCode(65 + answerIndex)}
                  </span>
                  <span>{option}</span>
                </button>
              ))}
            </div>

            {!quizSubmitted && (
              <button
                type="button"
                className="learn-primary"
                disabled={selectedQuizAnswer === null}
                onClick={() => {
  if (selectedQuizAnswer === null) return;

  setQuizSubmitted(true);

  if (selectedQuizAnswer === selectedDesignLesson.answer) {
  setDesignProgress((current) => ({
    ...current,
    mistakes: current.mistakes.filter(
      (mistake) => mistake.lessonId !== selectedDesignLesson.id
    ),
  }));
  return;
}

  if (selectedQuizAnswer !== selectedDesignLesson.answer) {
    const lesson = selectedDesignLesson;
    const now = new Date().toISOString();

    setDesignProgress((current) => {
      const mistakes = Array.isArray(current.mistakes)
        ? current.mistakes
        : [];

      const existingMistake = mistakes.find(
        (mistake) => mistake.lessonId === lesson.id
      );

      if (existingMistake) {
        return {
          ...current,
          mistakes: mistakes.map((mistake) =>
            mistake.lessonId === lesson.id
              ? {
                  ...mistake,
                  attempts: (Number(mistake.attempts) || 1) + 1,
                  chosenAnswer:
                    lesson.options[selectedQuizAnswer],
                  correctAnswer: lesson.options[lesson.answer],
                  lastAttemptAt: now,
                }
              : mistake
          ),
        };
      }

      return {
        ...current,
        mistakes: [
          ...mistakes,
          {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            question: lesson.question,
            chosenAnswer: lesson.options[selectedQuizAnswer],
            correctAnswer: lesson.options[lesson.answer],
            attempts: 1,
            lastAttemptAt: now,
          },
        ],
      };
    });
  }
}}
              >
                CHECK ANSWER
              </button>
            )}

            {quizSubmitted && (
              <div
                className={`learn-feedback ${
                  selectedQuizAnswer === selectedDesignLesson.answer
                    ? "is-correct"
                    : "is-wrong"
                }`}
              >
                <strong>
                  {selectedQuizAnswer === selectedDesignLesson.answer
                    ? "Correct! Great work."
                    : "Not quite. Try again!"}
                </strong>

                <p>
                  {selectedQuizAnswer === selectedDesignLesson.answer
                    ? selectedDesignLesson.feedback
                    : "Review the lesson and choose another answer."}
                </p>
              </div>
            )}
          </div>

{selectedDesignLesson.practice && (
  <section className="learn-practice">
    <p className="learn-kicker">PRACTICE ROUND · DESIGN EYE</p>

    <h3>{selectedDesignLesson.practice.title}</h3>

    <p className="learn-practice-prompt">
      {selectedDesignLesson.practice.prompt}
    </p>

    <div className="learn-practice-grid">
  {selectedDesignLesson.practice.options.map((option) => (
    <button
      type="button"
      key={option.id}
      className={`learn-practice-option ${option.style || ""} ${
        selectedPracticeOption === option.id ? "is-selected" : ""
      }`}
      aria-pressed={selectedPracticeOption === option.id}
      onClick={() => setSelectedPracticeOption(option.id)}
    >
      {selectedDesignLesson.practice.type === "spot-issue" ? (
        <div className="learn-issue-choice">
          <span className="learn-issue-letter">
            {option.label}
          </span>

          <span className="learn-issue-text">
            {option.text}
          </span>
        </div>
      ) : (
        <>
          <div className={`learn-mockup ${option.style}`}>
            <div className="learn-mockup-topbar">
              <span />
              <span />
              <span />
              <small>PALETTE STUDIO</small>
            </div>

            <div className="learn-mockup-content">
              <span className="learn-mockup-eyebrow">
                YOUR CREATIVE SPACE
              </span>

              <strong>{option.headline}</strong>

              <p>{option.description}</p>

              <span className="learn-mockup-button">
                {option.buttonLabel}
              </span>
            </div>
          </div>

          <div className="learn-practice-label">
            <strong>SCREEN {option.label}</strong>

            <span>
              {selectedPracticeOption === option.id
                ? "✓ Selected"
                : "Choose this design"}
            </span>
          </div>
        </>
      )}
    </button>
  ))}
</div>

    {selectedPracticeOption && (
      <div
        className={`learn-practice-feedback ${
          selectedDesignLesson.practice.options.find(
            (option) => option.id === selectedPracticeOption
          )?.isCorrect
            ? "is-correct"
            : "is-wrong"
        }`}
      >
        <strong>
          {selectedDesignLesson.practice.options.find(
            (option) => option.id === selectedPracticeOption
          )?.isCorrect
            ? "Great design thinking! ✨"
            : "Look a little closer 👀"}
        </strong>

        <p>
          {
            selectedDesignLesson.practice.options.find(
              (option) => option.id === selectedPracticeOption
            )?.feedback
          }
        </p>
      </div>
    )}
  </section>
)}

          <div className="learn-challenge">
            <p className="learn-kicker">YOUR DESIGN CHALLENGE</p>
            <p>{selectedDesignLesson.challenge}</p>
            <span>Try it in a real app or design project.</span>
          </div>

          {quizSubmitted &&
  selectedQuizAnswer === selectedDesignLesson.answer &&
  (!selectedDesignLesson.practice ||
    selectedDesignLesson.practice.options.some(
      (option) =>
        option.id === selectedPracticeOption && option.isCorrect
    )) && (
              <button
                type="button"
                className="learn-primary learn-complete"
                onClick={() => {
                  setDesignProgress((current) => {
                    if (
                      current.completedLessonIds.includes(
                        selectedDesignLesson.id
                      )
                    ) {
                      return current;
                    }

                    const now = new Date();

                    const today = [
                      now.getFullYear(),
                      String(now.getMonth() + 1).padStart(2, "0"),
                      String(now.getDate()).padStart(2, "0"),
                    ].join("-");

                    const yesterdayDate = new Date(now);
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

                    const yesterday = [
                      yesterdayDate.getFullYear(),
                      String(yesterdayDate.getMonth() + 1).padStart(2, "0"),
                      String(yesterdayDate.getDate()).padStart(2, "0"),
                    ].join("-");

                    const nextStreak =
                      current.lastStudyDate === today
                        ? current.streak
                        : current.lastStudyDate === yesterday
                          ? current.streak + 1
                          : 1;

                    return {
                      completedLessonIds: [
                        ...current.completedLessonIds,
                        selectedDesignLesson.id,
                      ],
                      xp: current.xp + selectedDesignLesson.xp,
                      streak: nextStreak,
                      lastStudyDate: today,
                    };
                  });

                  setSelectedDesignLesson(null);
                  setSelectedPracticeOption(null);
                  setSelectedQuizAnswer(null);
                  setQuizSubmitted(false);
                  
                  
                }}
              >
                COMPLETE LESSON · +{selectedDesignLesson.xp} XP
              </button>
            )}
        </article>
      </div>
    ) : (
      <div className="learn-path">
        {DESIGN_UNITS.map((unit, unitIndex) => {
          const completedInUnit = unit.lessons.filter((lesson) =>
            designProgress.completedLessonIds.includes(lesson.id)
          ).length;

          return (
            <section className="learn-unit" key={unit.id}>
              <div className="learn-unit-heading">
                <div>
                  <p className="learn-kicker">
                    UNIT {String(unitIndex + 1).padStart(2, "0")}
                  </p>
                  <h2>{unit.title}</h2>
                  <p>{unit.description}</p>
                </div>

                <span className="learn-unit-count">
                  {completedInUnit}/{unit.lessons.length}
                </span>
              </div>

              <div className="learn-progress-track">
                <div
                  className="learn-progress-fill"
                  style={{
                    width: `${
                      (completedInUnit / unit.lessons.length) * 100
                    }%`,
                  }}
                />
              </div>

              <div className="learn-path-lessons">
                {unit.lessons.map((lesson, lessonIndex) => {
                  const previousUnit =
                    unitIndex > 0 ? DESIGN_UNITS[unitIndex - 1] : null;

                  const previousLesson =
                    lessonIndex > 0
                      ? unit.lessons[lessonIndex - 1]
                      : previousUnit
                        ? previousUnit.lessons[
                            previousUnit.lessons.length - 1
                          ]
                        : null;

                  const isUnlocked =
                    !previousLesson ||
                    designProgress.completedLessonIds.includes(
                      previousLesson.id
                    );

                  const isCompleted =
                    designProgress.completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      type="button"
                      key={lesson.id}
                      className={`learn-path-lesson ${
                        isCompleted ? "is-completed" : ""
                      } ${!isUnlocked ? "is-locked" : ""}`}
                      disabled={!isUnlocked}
                      onClick={() => {
                        setSelectedDesignLesson({
                          ...lesson,
                          unitTitle: unit.title,
                        });
                        setSelectedQuizAnswer(null);
                        setQuizSubmitted(false);
                        setSelectedPracticeOption(null);
                      }}
                    >
                      <span className="learn-path-icon">
                        {isCompleted ? "✓" : isUnlocked ? "↗" : "🔒"}
                      </span>

                      <span className="learn-path-copy">
                        <strong>{lesson.title}</strong>
                        <small>
                          {lesson.duration} · {lesson.xp} XP
                        </small>
                      </span>

                      <span className="learn-path-status">
                        {isCompleted
                          ? "COMPLETED"
                          : isUnlocked
                            ? "START"
                            : "LOCKED"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    )}
  </section>
)}
        {page === "Market" && (
          <section className="inner-page">
            <div className="section-overline">THE WIDER PICTURE / MARKET NOTES</div>
            <h1 className="inner-heading">Read the<br /><em>signals.</em></h1>
            <p className="inner-intro">A place for observing design movements, understanding expectations, and asking better questions about the work ahead.</p>
            <div className="learning-list">
  {MARKET_NOTES.map((note, index) => (
    <article
      className={`learning-card ${
        index % 2 === 0 ? "learning-dark" : "learning-light"
      }`}
      key={note.number}
    >
      <div className="learning-label">
        {note.number} / {note.label}
      </div>

      <h2>{note.title}</h2>
      <p>{note.description}</p>

      <button
        type="button"
        className="learning-link"
        onClick={() => setSelectedMarketNote(note)}
      >
        EXPLORE NOTE ↗
      </button>
    </article>
  ))}
</div>

{selectedMarketNote && (
  <article className="market-note learning-detail">
    <span className="section-overline">
      MARKET NOTE / {selectedMarketNote.number}
    </span>

    <h2>{selectedMarketNote.title}</h2>
    <p>{selectedMarketNote.content}</p>

    <h3>PUT IT INTO PRACTICE</h3>
    <p>{selectedMarketNote.exercise}</p>

    <h3>KEY TAKEAWAY</h3>
    <p>{selectedMarketNote.takeaway}</p>

    <button
      type="button"
      className="button-outline"
      onClick={() => setSelectedMarketNote(null)}
    >
      CLOSE NOTE
    </button>
  </article>
)}
          </section>
        )}

        {page === "Profile" && (
          <section className="inner-page">
            <div className="section-overline">YOUR PRACTICE / PROFILE</div>
            <h1 className="inner-heading">Your work,<br /><em>your story.</em></h1>
            {!token ? (
              <div className="status-panel"><strong>Sign in to see your profile.</strong><button type="button" onClick={() => openAuth("login")}>LOG IN ↗</button></div>
            ) : (
              <>
                <div className="profile-summary">
                <span className="profile-monogram">
  {user?.profileImage ? (
    <img
      src={user.profileImage}
      alt={`${user.name || "Creator"} profile`}
      className="profile-avatar-image"
    />
  ) : (
    (user?.name || user?.username || "P")
      .charAt(0)
      .toUpperCase()
  )}
</span>
<div>
  <h2>{user?.name || "Palette creator"}</h2>
  <p>@{user?.username || "creator"}</p>

  {user?.headline && (
  <p className="profile-headline">
    {user.headline}
  </p>
)}
  <span>{myDesigns.length} published designs</span>
</div>
                </div>

                {user?.bio && (
  <p className="profile-bio">
    {user.bio}
  </p>
)}

{user?.skills?.length > 0 && (
  <div className="profile-skills">
    <div className="section-overline">YOUR SKILLS</div>

    <div className="work-tags">
      {user.skills.map((skill) => (
        <span key={skill}>{skill}</span>
      ))}
    </div>
  </div>
)}
                
                <button
  type="button"
  className="profile-edit-trigger"
  onClick={openProfileEditor}
>
  EDIT PROFILE ↗
</button>

                <div className="shelf-heading"><div><span className="section-overline">YOUR PORTFOLIO</span><h2>Published work</h2></div></div>
                {myDesigns.length ? (
                  <div className="work-grid">{myDesigns.map((design, index) => renderDesignCard(design, index))}</div>
                ) : (
                  <div className="status-panel"><strong>Your portfolio is ready for its first project.</strong><p>Publish your first design to start building your portfolio.</p><button type="button" onClick={() => setPublishOpen(true)}>+ PUBLISH WORK</button></div>
                )}
              </>
            )}
          </section>
        )}

        <footer className="palette-footer">
          <span>PALETTE / DESIGN PRACTICE, IN MOTION</span>
          <span>LOOK CLOSELY. MAKE DELIBERATELY.</span>
        </footer>
      </main>

      {publishOpen && (
        <div className="auth-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPublishOpen(false); }}>
          <section className="auth-panel publish-panel" role="dialog" aria-modal="true" aria-labelledby="publish-title">
            <button type="button" className="auth-close" onClick={() => setPublishOpen(false)} aria-label="Close publish form">×</button>
            <div className="section-overline">PALETTE / SHARE YOUR PRACTICE</div>
            <h2 id="publish-title">Publish your work.</h2>
            <p className="auth-intro">Add a project to your portfolio and share it with the creative community.</p>

            <form className="auth-form publish-form" onSubmit={handlePublish}>
              <label>
                Project title
                <input value={designTitle} onChange={(event) => setDesignTitle(event.target.value)} required maxLength={120} placeholder="e.g. A calmer banking app" />
              </label>

              
<label>
  Upload an image from your device
  <input
    type="file"
    accept="image/jpeg,image/png,image/webp,image/gif"
    onChange={handleImageUpload}
    disabled={imageUploadBusy}
  />
  <span className="form-help">
    {imageUploadBusy
      ? "Uploading image..."
      : "JPG, PNG, WEBP, or GIF. Maximum size: 5 MB."}
  </span>

  {uploadedImageName && !imageUploadBusy && (
  <span className="upload-success" role="status">
    ✓ Image uploaded successfully: {uploadedImageName}
  </span>
)}

</label>

<label>
  Image URL
  <input
    type="url"
    value={designImageUrl}
    onChange={(event) => setDesignImageUrl(event.target.value)}
    required
    disabled={imageUploadBusy}
    placeholder="Or paste a public image URL"
  />
  <span className="form-help">
    Upload an image above or paste an existing image URL.
  </span>
</label>

{designImageUrl && (
  <div className="image-upload-preview">
    <p>Image preview</p>
    <img
      src={designImageUrl}
      alt="Design image preview"
      style={{
        width: "100%",
        maxHeight: "220px",
        objectFit: "contain",
      }}
    />
    <button
      type="button"
      className="button-outline"
      onClick={() => setDesignImageUrl("")}
      disabled={imageUploadBusy}
    >
      REMOVE IMAGE
    </button>
  </div>
)}


              <label>
                Category
                <select value={designCategory} onChange={(event) => setDesignCategory(event.target.value)} required>
                  {PUBLISH_CATEGORIES.map((item) => <option value={item} key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                Description
                <textarea value={designDescription} onChange={(event) => setDesignDescription(event.target.value)} rows={3} maxLength={2000} placeholder="What was the idea behind this project?" />
              </label>

              <label>
                Tags <span className="form-help">Separate tags with commas.</span>
                <input value={designTags} onChange={(event) => setDesignTags(event.target.value)} placeholder="mobile, minimal, accessibility" />
              </label>

              <label>
                Tools used <span className="form-help">Separate tools with commas.</span>
                <input value={designTools} onChange={(event) => setDesignTools(event.target.value)} placeholder="Figma, Illustrator" />
              </label>

              {publishError && <p className="auth-error" role="alert">{publishError}</p>}

              <button className="button-dark auth-submit" type="submit" disabled={publishBusy || imageUploadBusy}>
                {publishBusy ? "PUBLISHING…" : "PUBLISH PROJECT ↗"}
              </button>
              <button type="button" className="button-outline cancel-publish" onClick={() => setPublishOpen(false)} disabled={publishBusy}>CANCEL</button>
            </form>
          </section>
        </div>
      )}

{profileEditOpen && (
  <div
    className="auth-backdrop"
    onMouseDown={(event) => {
      if (
        event.target === event.currentTarget &&
        !profileEditBusy
      ) {
        setProfileEditOpen(false);
      }
    }}
  >
    <section
      className="auth-panel publish-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-title"
    >
      <button
        type="button"
        className="auth-close"
        onClick={() => setProfileEditOpen(false)}
        disabled={profileEditBusy}
        aria-label="Close profile editor"
      >
        ×
      </button>

      <div className="section-overline">
        PALETTE / YOUR IDENTITY
      </div>

      <h2 id="profile-edit-title">Edit your profile.</h2>

      <p className="auth-intro">
        Tell the creative community a little about yourself.
      </p>

      <form
        className="auth-form publish-form"
        onSubmit={handleProfileUpdate}
      >
        <label>
          Full name
          <input
            value={profileName}
            onChange={(event) => setProfileName(event.target.value)}
            required
            maxLength={100}
          />
        </label>

        <label>
          Username
          <input
            value={profileUsername}
            onChange={(event) => setProfileUsername(event.target.value)}
            required
            maxLength={40}
          />
        </label>

        <label>
          Profile image URL
          <input
            type="url"
            value={profileImage}
            onChange={(event) => setProfileImage(event.target.value)}
            placeholder="https://example.com/profile.jpg"
          />
          <span className="form-help">
            Use a publicly accessible image URL.
          </span>
        </label>

        <label>
          Bio
          <textarea
            value={profileBio}
            onChange={(event) => setProfileBio(event.target.value)}
            rows={4}
            maxLength={500}
            placeholder="What do you create, and what inspires you?"
          />
        </label>

        <label>
  Professional headline
  <input
    type="text"
    value={profileHeadline}
    onChange={(event) => setProfileHeadline(event.target.value)}
    maxLength={120}
    placeholder="UI/UX Designer | Product Designer | Figma"
  />
  <span className="form-help">
    Describe your professional focus in 120 characters or fewer.
  </span>
</label>

        <label>
          Skills
          <span className="form-help">
            Separate skills with commas.
          </span>
          <input
            value={profileSkills}
            onChange={(event) => setProfileSkills(event.target.value)}
            placeholder="UI/UX, Figma, Branding"
          />
        </label>

        {profileEditError && (
          <p className="auth-error" role="alert">
            {profileEditError}
          </p>
        )}

        <button
          type="submit"
          className="button-dark auth-submit"
          disabled={profileEditBusy}
        >
          {profileEditBusy ? "SAVING PROFILE…" : "SAVE PROFILE ↗"}
        </button>

        <button
          type="button"
          className="button-outline cancel-publish"
          onClick={() => setProfileEditOpen(false)}
          disabled={profileEditBusy}
        >
          CANCEL
        </button>
      </form>
    </section>
  </div>
)}

{editingDesign && (
  <div
    className="auth-backdrop"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget && !editDesignBusy) {
        setEditingDesign(null);
      }
    }}
  >
    <section
      className="auth-panel publish-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-design-title"
    >
      <button
        type="button"
        className="auth-close"
        onClick={() => setEditingDesign(null)}
        disabled={editDesignBusy}
        aria-label="Close edit form"
      >
        ×
      </button>

      <div className="section-overline">
        PALETTE / REFINE YOUR PRACTICE
      </div>

      <h2 id="edit-design-title">Edit your work.</h2>

      <p className="auth-intro">
        Update your project details and keep your portfolio current.
      </p>

      <form className="auth-form publish-form" onSubmit={handleUpdateDesign}>
        <label>
          Project title
          <input
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            required
            maxLength={120}
          />
        </label>

        <label>
          Image URL
          <input
            type="url"
            value={editImageUrl}
            onChange={(event) => setEditImageUrl(event.target.value)}
            required
          />
        </label>

        <label>
          Category
          <select
            value={editCategory}
            onChange={(event) => setEditCategory(event.target.value)}
            required
          >
            {PUBLISH_CATEGORIES.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Description
          <textarea
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
            rows={3}
            maxLength={2000}
          />
        </label>

        <label>
          Tags
          <span className="form-help">Separate tags with commas.</span>
          <input
            value={editTags}
            onChange={(event) => setEditTags(event.target.value)}
            placeholder="mobile, minimal, accessibility"
          />
        </label>

        <label>
          Tools used
          <span className="form-help">Separate tools with commas.</span>
          <input
            value={editTools}
            onChange={(event) => setEditTools(event.target.value)}
            placeholder="Figma, Illustrator"
          />
        </label>

        {editDesignError && (
          <p className="auth-error" role="alert">
            {editDesignError}
          </p>
        )}

        <button
          type="submit"
          className="button-dark auth-submit"
          disabled={editDesignBusy}
        >
          {editDesignBusy ? "SAVING CHANGES…" : "SAVE CHANGES ↗"}
        </button>

        <button
          type="button"
          className="button-outline cancel-publish"
          onClick={() => setEditingDesign(null)}
          disabled={editDesignBusy}
        >
          CANCEL
        </button>
      </form>
    </section>
  </div>
)}


      {authOpen && (
        <div className="auth-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false); }}>
          <section className="auth-panel" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button type="button" className="auth-close" onClick={() => setAuthOpen(false)} aria-label="Close sign-in form">×</button>
            <div className="section-overline">PALETTE / YOUR PRACTICE</div>
            <h2 id="auth-title">{authMode === "signup" ? "Join the index." : "Welcome back."}</h2>
            <p className="auth-intro">{authMode === "signup" ? "Make a place for your work and the ideas you want to keep." : "Return to your saved references and creative space."}</p>

            <form className="auth-form" onSubmit={handleAuth}>
              {authMode === "signup" && (
                <>
                  <label>Name<input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" /></label>
                  <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} required autoComplete="username" /></label>
                </>
              )}
              <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
              <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete={authMode === "signup" ? "new-password" : "current-password"} /></label>
              {authError && <p className="auth-error" role="alert">{authError}</p>}
              <button className="button-dark auth-submit" type="submit" disabled={authBusy}>{authBusy ? "PLEASE WAIT…" : authMode === "signup" ? "CREATE ACCOUNT ↗" : "LOG IN ↗"}</button>
            </form>

            <p className="auth-switch">
              {authMode === "signup" ? "Already have an account?" : "New to Palette?"} {" "}
              <button type="button" onClick={() => { setAuthMode(authMode === "signup" ? "login" : "signup"); setAuthError(""); }}>
                {authMode === "signup" ? "Log in" : "Join the index"}
              </button>
            </p>
          </section>
        </div>
      )}

      {selectedDesign && (
        <div className="auth-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedDesign(null); }}>
          <section className="design-detail-panel" role="dialog" aria-modal="true" aria-labelledby="design-detail-title">
            <button type="button" className="auth-close" onClick={() => setSelectedDesign(null)} aria-label="Close design details">×</button>
            <div className="section-overline">THE INDEX / PROJECT DETAIL</div>
            {selectedDesign.imageUrl && (
  <div className="design-detail-image">
    <img
      src={selectedDesign.imageUrl}
      alt={selectedDesign.title}
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  </div>
)}
            <h2 id="design-detail-title">{selectedDesign.title}</h2>
            <p className="detail-category">{selectedDesign.category || "Creative practice"}</p>
            <p>{selectedDesign.description || "No project description yet."}</p>
            <p>By <strong>{selectedDesign.creator?.name || selectedDesign.creator?.username || "Community creator"}</strong></p>
            {selectedDesign.tools?.length > 0 && <p>Tools: {selectedDesign.tools.join(", ")}</p>}
            {selectedDesign.tags?.length > 0 && <div className="work-tags">{selectedDesign.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
            
            <section className="comments-section" aria-labelledby="comments-heading">
  <div className="comments-heading-row">
    <h3 id="comments-heading">Conversation</h3>
    <span>
      {comments.length} {comments.length === 1 ? "COMMENT" : "COMMENTS"}
    </span>
  </div>

  {commentsError && (
    <p className="comments-error" role="alert">
      {commentsError}
    </p>
  )}

  {commentsLoading ? (
    <p className="comments-status">Loading comments…</p>
  ) : comments.length === 0 ? (
    <p className="comments-status">
      No comments yet. Start the conversation.
    </p>
  ) : (
    <div className="comments-list">
      {comments.map((comment) => {
        const commentId = comment._id;
        const commentUser =
          comment.user && typeof comment.user === "object"
            ? comment.user
            : null;

        const authorId = commentUser?._id || comment.user;

        const canManageComment = Boolean(
          user?._id &&
          authorId &&
          String(user._id) === String(authorId)
        );

        return (
          <article className="comment-item" key={commentId}>
            <div className="comment-meta">
              <strong>
                {commentUser?.name ||
                  commentUser?.username ||
                  "Community member"}
              </strong>

              {comment.createdAt && (
                <time dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </time>
              )}
            </div>

            {editingCommentId === commentId ? (
              <form
                className="comment-edit-form"
                onSubmit={(event) =>
                  handleUpdateComment(event, commentId)
                }
              >
                <label className="comment-label">
                  Edit your comment
                  <textarea
                    value={editingCommentText}
                    onChange={(event) =>
                      setEditingCommentText(event.target.value)
                    }
                    rows={3}
                    maxLength={2000}
                    required
                  />
                </label>

                <div className="comment-actions">
                  <button
                    type="submit"
                    className="comment-action-button"
                    disabled={commentBusy}
                  >
                    {commentBusy ? "SAVING…" : "SAVE CHANGES"}
                  </button>

                  <button
                    type="button"
                    className="comment-action-button"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingCommentText("");
                    }}
                    disabled={commentBusy}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="comment-text">{comment.text}</p>

                {canManageComment && (
                  <div className="comment-actions">
                    <button
                      type="button"
                      className="comment-action-button"
                      onClick={() => {
                        setEditingCommentId(commentId);
                        setEditingCommentText(comment.text || "");
                        setCommentsError("");
                      }}
                    >
                      EDIT
                    </button>

                    <button
                      type="button"
                      className="comment-action-button"
                      onClick={() => handleDeleteComment(commentId)}
                      disabled={commentBusy}
                    >
                      DELETE
                    </button>
                  </div>
                )}
              </>
            )}
          </article>
        );
      })}
    </div>
  )}

  <form
    className="comment-compose-form"
    onSubmit={handleCreateComment}
  >
    <label className="comment-label" htmlFor="new-comment-text">
      Add to the conversation
    </label>

    <textarea
      id="new-comment-text"
      value={newComment}
      onChange={(event) => setNewComment(event.target.value)}
      rows={3}
      maxLength={2000}
      placeholder="Share a thought about this design…"
      required
    />

    <div className="comment-compose-footer">
      <span>{newComment.length}/2000</span>

      <button
        type="submit"
        className="button-dark"
        disabled={commentBusy || !newComment.trim()}
      >
        {commentBusy
          ? "SAVING…"
          : token
            ? "POST COMMENT ↗"
            : "LOG IN TO COMMENT ↗"}
      </button>
    </div>
  </form>

  {!token && (
    <p className="comments-login-note">
      You will be asked to log in before posting a comment.
    </p>
  )}
</section>

            <div className="detail-actions">
              <button type="button" className="button-dark" onClick={() => {
                const isSaved = savedDesigns.some((entry) => entry.design?._id === selectedDesign._id);
                handleSave(selectedDesign, isSaved);
              }}>SAVE / REMOVE REFERENCE ↗</button>
              <button type="button" className="button-outline" onClick={() => setSelectedDesign(null)}>CLOSE</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;

