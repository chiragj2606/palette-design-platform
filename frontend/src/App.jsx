import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import AdminDashboard from "./AdminDashboard";
import PaletteLearn from "./components/PaletteLearn";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const NAV_ITEMS = [
  "Discover",
  "Explore",
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
    id: "design-elements",
    title: "Design Elements",
    description: "Understand the building blocks of every visual design.",
    lessons: [
      {
        id: "elements-introduction",
        title: "Introduction to Design Elements",
        duration: "4 min",
        xp: 10,
        explanation:
          "Design elements are the basic visual building blocks used to create interfaces. They include line, shape, form, colour, texture, space and typography. Designers combine these elements to communicate ideas and organise information.",
        question:
          "Which of these is considered a fundamental design element?",
        options: [
          "User authentication",
          "Shape",
          "Database management",
          "Server hosting",
        ],
        answer: 1,
        feedback:
          "Correct! Shape is a fundamental visual element used to create icons, buttons, illustrations and layouts.",
        challenge:
          "Open an app you use regularly. Identify three different design elements you can see on its screen.",
      },
      {
        id: "line-shape-form",
        title: "Line, Shape and Form",
        duration: "5 min",
        xp: 10,
        explanation:
          "Lines guide attention and separate content. Shapes create icons, buttons and visual containers. Form gives objects a sense of depth and dimension. These elements help designers communicate structure and meaning.",
        question:
          "Which design element is commonly used to create the outline of a button?",
        options: [
          "Shape",
          "Sound",
          "Database",
          "Animation timing",
        ],
        answer: 0,
        feedback:
          "Exactly! Buttons commonly use rectangular, rounded or other shapes to create recognisable interactive areas.",
        challenge:
          "Sketch three button shapes: rectangular, rounded and circular. Consider which one suits each action.",
      },
      {
        id: "space-and-balance",
        title: "Space and Balance",
        duration: "5 min",
        xp: 10,
        explanation:
          "Space is the area around and between design elements. White space helps prevent clutter and improves readability. Balance describes how visual elements are distributed to create a stable composition.",
        question:
          "Why is sufficient spacing important in a mobile interface?",
        options: [
          "It makes every screen more crowded",
          "It removes the need for headings",
          "It improves readability and separates content",
          "It makes all buttons identical",
        ],
        answer: 2,
        feedback:
          "Correct! Appropriate spacing makes interfaces easier to scan and helps users distinguish between different sections.",
        challenge:
          "Find a crowded mobile screen and suggest two spacing changes that would make it easier to use.",
      },
    ],
  },


  
{
  id: "colour-theory",
  title: "Colour Theory",
  description: "Learn how colours work together and influence interface design.",
  lessons: [
    {
      id: "colour-wheel",
      title: "Understanding the Colour Wheel",
      duration: "5 min",
      xp: 10,
      explanation:
        "The colour wheel shows the relationships between colours. It helps designers understand primary, secondary and tertiary colours and choose combinations for digital interfaces.",
      question:
        "Which set contains the traditional primary colours in the RYB colour model?",
      options: [
        "Red, yellow and blue",
        "Green, orange and purple",
        "Black, white and grey",
        "Pink, brown and cyan",
      ],
      answer: 0,
      feedback:
        "Correct! Red, yellow and blue are the traditional primary colours in the RYB model.",
      challenge:
        "Find an app and identify three colours used in its interface. Consider how they work together."
    },
    {
      id: "colour-harmony",
      title: "Colour Harmony",
      duration: "5 min",
      xp: 10,
      explanation:
        "Colour harmony is the use of colours that work well together. Complementary colours sit opposite each other on the colour wheel, while analogous colours sit next to each other.",
      question:
        "Where are complementary colours located on the colour wheel?",
      options: [
        "Directly next to each other",
        "Opposite each other",
        "Only in the neutral colour range",
        "At the centre of the wheel",
      ],
      answer: 1,
      feedback:
        "Exactly! Complementary colours are opposite each other on the colour wheel and create strong visual contrast.",
      challenge:
        "Create a small interface colour palette using a complementary colour pair."
    },
    {
      id: "colour-psychology",
      title: "Colour Meaning and Emotion",
      duration: "5 min",
      xp: 10,
      explanation:
        "Colours can influence the mood and tone of an interface. Designers may use warm or cool colours to support a brand's personality, but colour meanings can vary across cultures and contexts.",
      question:
        "What should a designer consider when choosing colours for a brand?",
      options: [
        "Only personal colour preferences",
        "Using as many colours as possible",
        "Brand identity, audience and context",
        "Making every button a different colour",
      ],
      answer: 2,
      feedback:
        "Well done! Colour choices should support the brand, audience and purpose of the experience.",
      challenge:
        "Choose a brand and identify how its colour palette supports its personality."
    },
    {
      id: "colour-accessibility",
      title: "Contrast and Accessible Colours",
      duration: "5 min",
      xp: 10,
      explanation:
        "Accessible colour choices help people read and understand interfaces. Text needs sufficient contrast against its background. Important information should not be communicated through colour alone.",
      question:
        "What is a good way to communicate an error message accessibly?",
      options: [
        "Use only a red background",
        "Remove the error explanation",
        "Use colour alongside text or an icon",
        "Make the message very faint",
      ],
      answer: 2,
      feedback:
        "Correct! Combining colour with text or an icon helps people understand the error without relying on colour alone.",
      challenge:
        "Design an error message using an icon, clear text and a contrasting colour."
    }
  ]
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

// Keep Learn progress in a predictable shape, even when older or incomplete
// data exists in localStorage or a state update.
function normalizeDesignProgress(value) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};

  const toNonNegativeNumber = (input) => {
    const number = Number(input);
    return Number.isFinite(number) && number >= 0 ? number : 0;
  };

  return {
    ...source,
    completedLessonIds: Array.isArray(source.completedLessonIds)
      ? source.completedLessonIds.filter((id) => typeof id === "string")
      : [],
    mistakes: Array.isArray(source.mistakes)
      ? source.mistakes.filter(
          (mistake) => mistake && typeof mistake === "object"
        )
      : [],
    xp: toNonNegativeNumber(source.xp),
    streak: toNonNegativeNumber(source.streak),
    lastStudyDate:
      typeof source.lastStudyDate === "string" ? source.lastStudyDate : "",
  };
}

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

const MARKET_RESOURCES = [
  {
    id: "figma-community",
    title: "Figma Community",
    category: "Design Templates",
    description:
      "Discover UI kits, wireframes, design systems, plugins and community-created resources.",
    url: "https://www.figma.com/community",
    type: "DESIGN TOOL",
  },
  {
    id: "google-fonts",
    title: "Google Fonts",
    category: "Typography",
    description:
      "Explore typefaces and font families for digital interfaces and branding.",
    url: "https://fonts.google.com/",
    type: "TYPOGRAPHY",
  },
  {
    id: "material-design",
    title: "Material Design 3",
    category: "Design Systems",
    description:
      "Learn about interface components, design foundations, accessibility and interaction patterns.",
    url: "https://m3.material.io/",
    type: "DESIGN SYSTEM",
  },
  {
    id: "wcag",
    title: "WCAG Accessibility Guidelines",
    category: "Accessibility",
    description:
      "Understand accessibility requirements for readable, inclusive digital experiences.",
    url: "https://www.w3.org/WAI/WCAG22/quickref/",
    type: "GUIDELINES",
  },
  {
    id: "lucide",
    title: "Lucide Icons",
    category: "Icons",
    description:
      "Explore a consistent open-source icon library for modern interface design.",
    url: "https://lucide.dev/",
    type: "ICON LIBRARY",
  },
];


const MARKET_CASE_STUDIES = [
  {
    id: "mobile-checkout",
    title: "Simplifying a mobile checkout",
    category: "UX DESIGN",
    level: "Beginner",
    overview:
      "An educational redesign scenario focused on improving the experience of purchasing products through a mobile interface.",
    problem:
      "Users struggle to complete checkout because the process contains too many steps and competing actions.",
    researchQuestions: [
      "Where do users struggle during checkout?",
      "Which form fields are genuinely necessary?",
      "What information do users need before confirming payment?"
    ],
    approach:
      "Simplify the checkout flow, group related information, reduce unnecessary fields and make the primary action visually clear.",
    designDecisions: [
      "Group delivery and contact information logically.",
      "Make the order summary easy to review.",
      "Give the final checkout action clear visual emphasis."
    ],
    takeaway:
      "A focused checkout experience can reduce friction and make important actions easier to understand."
  },
  {
    id: "accessible-dashboard",
    title: "Making a dashboard more accessible",
    category: "ACCESSIBILITY",
    level: "Intermediate",
    overview:
      "An educational scenario exploring how accessibility improvements can make information easier to understand in a digital dashboard.",
    problem:
      "A dashboard relies heavily on colour to communicate important information, making some statuses difficult to distinguish.",
    researchQuestions: [
      "Can users understand status information without recognising its colour?",
      "Is the text readable against its background?",
      "Are icons and labels used consistently?"
    ],
    approach:
      "Introduce descriptive labels, meaningful icons, improved contrast and consistent visual hierarchy.",
    designDecisions: [
      "Combine colour with descriptive status labels.",
      "Use recognisable icons alongside important information.",
      "Improve text and background contrast."
    ],
    takeaway:
      "Accessible interfaces communicate meaning through more than colour alone."
  },
  {
    id: "navigation-redesign",
    title: "Redesigning a confusing navigation system",
    category: "INFORMATION ARCHITECTURE",
    level: "Beginner",
    overview:
      "An educational redesign scenario focused on helping users find important features in a mobile application.",
    problem:
      "A mobile application has too many navigation options, making it difficult for users to find important features.",
    researchQuestions: [
      "Which destinations do users visit most frequently?",
      "Which navigation items belong together?",
      "What tasks should be easiest to access?"
    ],
    approach:
      "Group related destinations, prioritise common tasks and establish a clear navigation hierarchy.",
    designDecisions: [
      "Group related destinations into meaningful categories.",
      "Prioritise frequently used destinations.",
      "Keep the navigation structure consistent."
    ],
    takeaway:
      "Good information architecture helps people find what they need without unnecessary effort."
  }
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
  
const [page, setPageState] = useState("Discover");

// PALETTE navigation history
const currentPageRef = useRef("Discover");
const pageHistoryRef = useRef(["Discover"]);
const pageHistoryIndexRef = useRef(0);

const [canGoBack, setCanGoBack] = useState(false);
const [canGoForward, setCanGoForward] = useState(false);

// Record every normal page navigation
const setPage = useCallback((nextPage) => {
  const resolvedPage =
    typeof nextPage === "function"
      ? nextPage(currentPageRef.current)
      : nextPage;

  if (!resolvedPage || resolvedPage === currentPageRef.current) {
    return;
  }

  const nextHistory = pageHistoryRef.current.slice(
    0,
    pageHistoryIndexRef.current + 1
  );

  nextHistory.push(resolvedPage);

  pageHistoryRef.current = nextHistory;
  pageHistoryIndexRef.current = nextHistory.length - 1;
  currentPageRef.current = resolvedPage;

  setPageState(resolvedPage);
  setCanGoBack(true);
  setCanGoForward(false);
}, []);

// Navigate backward
const goBack = useCallback(() => {
  if (pageHistoryIndexRef.current <= 0) return;

  pageHistoryIndexRef.current -= 1;

  const previousPage =
    pageHistoryRef.current[pageHistoryIndexRef.current];

  currentPageRef.current = previousPage;
  setPageState(previousPage);

  setCanGoBack(pageHistoryIndexRef.current > 0);
  setCanGoForward(true);

  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

// Navigate forward
const goForward = useCallback(() => {
  if (
    pageHistoryIndexRef.current >=
    pageHistoryRef.current.length - 1
  ) {
    return;
  }

  pageHistoryIndexRef.current += 1;

  const nextPage =
    pageHistoryRef.current[pageHistoryIndexRef.current];

  currentPageRef.current = nextPage;
  setPageState(nextPage);

  setCanGoBack(true);
  setCanGoForward(
    pageHistoryIndexRef.current <
      pageHistoryRef.current.length - 1
  );

  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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
    return Array.isArray(saved)
      ? saved.filter((id) => typeof id === "string")
      : [];
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

const safeCompletedStudioChallenges = Array.isArray(completedStudioChallenges)
  ? completedStudioChallenges.filter((id) => typeof id === "string")
  : [];

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
  try {
    const saved = localStorage.getItem("palette_design_progress");
    return saved
      ? normalizeDesignProgress(JSON.parse(saved))
      : normalizeDesignProgress({});
  } catch {
    return normalizeDesignProgress({});
  }
});

// A render-safe version is used below so an incomplete update cannot crash Learn.
const safeDesignProgress = normalizeDesignProgress(designProgress);

useEffect(() => {
  try {
    localStorage.setItem(
      "palette_design_progress",
      JSON.stringify(normalizeDesignProgress(designProgress))
    );
  } catch {
    // Learning still works if browser storage is unavailable.
  }
}, [designProgress]);
  const [selectedMarketNote, setSelectedMarketNote] = useState(null);
  const [selectedMarketCaseStudy, setSelectedMarketCaseStudy] = useState(null);
  const marketCaseStudyDetailRef = useRef(null);
  useEffect(() => {
  if (!selectedMarketCaseStudy) return;

  marketCaseStudyDetailRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, [selectedMarketCaseStudy]);
  const [marketSearch, setMarketSearch] = useState("");
const [marketCategory, setMarketCategory] = useState("All");
const [marketResourceCategory, setMarketResourceCategory] = useState("All");
const [marketWorkMode, setMarketWorkMode] = useState("All");
const [marketExperience, setMarketExperience] = useState("All");
const [marketLocation, setMarketLocation] = useState("");
const [marketJobs, setMarketJobs] = useState([]);
const [jobForm, setJobForm] = useState({
  title: "",
  company: "",
  location: "",
  employmentType: "Full-time",
  experienceLevel: "Entry-level",
  description: "",
  requirements: "",
  skills: "",
  salary: "",
  workMode: "On-site",
});

const [jobPostMessage, setJobPostMessage] = useState("");
const [jobPostLoading, setJobPostLoading] = useState(false);
const [marketJobsLoading, setMarketJobsLoading] = useState(false);
const [marketJobsError, setMarketJobsError] = useState("");
const [selectedMarketJob, setSelectedMarketJob] = useState(null);
const [showApplicationForm, setShowApplicationForm] = useState(false);
const [coverLetter, setCoverLetter] = useState("");
const [portfolioLink, setPortfolioLink] = useState("");
const [applicationMessage, setApplicationMessage] = useState("");
const [applicationLoading, setApplicationLoading] = useState(false);
const [myApplications, setMyApplications] = useState([]);
const [myPostedJobs, setMyPostedJobs] = useState([]);
const [myPostedJobsLoading, setMyPostedJobsLoading] = useState(false);
const [myPostedJobsError, setMyPostedJobsError] = useState("");
const [applicationsLoading, setApplicationsLoading] = useState(false);
const [applicationsError, setApplicationsError] = useState("");

const normalizedMarketSearch = marketSearch.trim().toLowerCase();

const filteredMarketJobs = marketJobs.filter((job) => {
  const matchesCategory =
    marketCategory === "All" ||
    (marketCategory === "Jobs" && job.employmentType !== "Internship") ||
    (marketCategory === "Internships" && job.employmentType === "Internship");
    const matchesWorkMode =
  marketWorkMode === "All" || job.workMode === marketWorkMode;

const matchesExperience =
  marketExperience === "All" ||
  job.experienceLevel === marketExperience;

const matchesLocation =
  !marketLocation.trim() ||
  job.location?.toLowerCase().includes(marketLocation.trim().toLowerCase());

  const searchableText = [
    job.title,
    job.company,
    job.location,
    job.employmentType,
    job.experienceLevel,
    job.workMode,
    ...(job.skills || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    matchesCategory &&
    matchesWorkMode &&
  matchesExperience &&
  matchesLocation &&
    (!normalizedMarketSearch || searchableText.includes(normalizedMarketSearch))
  );
});

const filteredMarketNotes = MARKET_NOTES.filter((note) => {
  const matchesCategory =
    marketCategory === "All" ||
    (marketCategory === "Trends" && note.label === "DESIGN TRENDS");

  const searchableText = [
    note.title,
    note.description,
    note.content,
    note.label,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    matchesCategory &&
    (!normalizedMarketSearch ||
      searchableText.includes(normalizedMarketSearch))
  );
});


const filteredMarketResources = MARKET_RESOURCES.filter((resource) => {
  const matchesMarketCategory =
    marketCategory === "All" || marketCategory === "Resources";

  const matchesResourceCategory =
    marketResourceCategory === "All" ||
    resource.category === marketResourceCategory;

  const matchesSearch =
    !normalizedMarketSearch ||
    [
      resource.title,
      resource.category,
      resource.description,
      resource.type,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedMarketSearch);

  return (
    matchesMarketCategory &&
    matchesResourceCategory &&
    matchesSearch
  );
});

const filteredMarketCaseStudies = MARKET_CASE_STUDIES.filter((study) => {
  const matchesCategory =
    marketCategory === "All" || marketCategory === "Case Studies";

  const searchableText = [
    study.title,
    study.category,
    study.level,
    study.overview,
    study.problem,
    study.researchQuestions,
    study.approach,
    study.designDecisions,
    study.takeaway,
  ]
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    matchesCategory &&
    (!normalizedMarketSearch ||
      searchableText.includes(normalizedMarketSearch))
  );
});


const handleApplyForJob = async (event) => {
  event.preventDefault();

  if (!token) {
    setApplicationMessage("Please log in before applying.");
    return;
  }

  if (!selectedMarketJob) {
    setApplicationMessage("Please select a job first.");
    return;
  }

  // Cover letter is required.
  if (!coverLetter.trim()) {
    setApplicationMessage("Please enter your cover letter before submitting.");
    return;
  }

  // Portfolio link is optional, but must be valid when provided.
  const trimmedPortfolioLink = portfolioLink.trim();

  if (trimmedPortfolioLink) {
    try {
      const parsedUrl = new URL(trimmedPortfolioLink);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid URL");
      }
    } catch {
      setApplicationMessage(
        "Please enter a valid portfolio URL starting with https://"
      );
      return;
    }
  }

  setApplicationLoading(true);
  setApplicationMessage("");

  try {
    const response = await fetch(
      `${API}/applications/${selectedMarketJob._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coverLetter: coverLetter.trim(),
          portfolioLink: trimmedPortfolioLink,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Application failed.");
    }

    setApplicationMessage("Application submitted successfully!");
    setCoverLetter("");
    setPortfolioLink("");
  } catch (error) {
    setApplicationMessage(error.message || "Unable to submit application.");
  } finally {
    setApplicationLoading(false);
  }
};


const handlePostJob = async (event) => {
  event.preventDefault();

  if (!token) {
    setJobPostMessage("Please log in before posting a job.");
    return;
  }

  setJobPostLoading(true);
  setJobPostMessage("");

  try {
    const response = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...jobForm,
        requirements: jobForm.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        skills: jobForm.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to post job.");
    }

    setJobPostMessage("Job posted successfully!");

    setMarketJobs((previousJobs) => [
      result.job,
      ...previousJobs,
    ]);

    setJobForm({
      title: "",
      company: "",
      location: "",
      employmentType: "Full-time",
      experienceLevel: "Entry-level",
      description: "",
      requirements: "",
      skills: "",
      salary: "",
      workMode: "On-site",
    });
  } catch (error) {
    setJobPostMessage(error.message);
  } finally {
    setJobPostLoading(false);
  }
};

useEffect(() => {
  const fetchMarketJobs = async () => {
    setMarketJobsLoading(true);
    setMarketJobsError("");

    try {
      const response = await fetch(`${API}/jobs`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load jobs.");
      }

      setMarketJobs(result.jobs || []);
    } catch (error) {
      setMarketJobsError(error.message);
    } finally {
      setMarketJobsLoading(false);
    }
  };

  fetchMarketJobs();
}, []);


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
  useEffect(() => {
  if (page !== "My Applications") return;

  const fetchMyApplications = async () => {
    if (!token) {
      setApplicationsError("Please log in to view your applications.");
      setMyApplications([]);
      return;
    }

    setApplicationsLoading(true);
    setApplicationsError("");

    try {
      const response = await fetch(`${API}/applications/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load applications.");
      }

      setMyApplications(result.applications || []);
    } catch (error) {
      setApplicationsError(error.message);
    } finally {
      setApplicationsLoading(false);
    }
  };

  fetchMyApplications();
}, [page, token]);

useEffect(() => {
  if (page !== "My Posted Jobs") return;

  const fetchMyPostedJobs = async () => {
    if (!token) {
      setMyPostedJobsError("Please log in to view your posted jobs.");
      setMyPostedJobs([]);
      return;
    }

    setMyPostedJobsLoading(true);
    setMyPostedJobsError("");

    try {
      const response = await fetch(`${API}/jobs/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load posted jobs.");
      }

      setMyPostedJobs(result.jobs || []);
    } catch (error) {
      setMyPostedJobsError(error.message);
    } finally {
      setMyPostedJobsLoading(false);
    }
  };

  fetchMyPostedJobs();
}, [page, token]);

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
          <div className="nav-history-controls">
  <button
    type="button"
    className="nav-history-button"
    onClick={goBack}
    disabled={!canGoBack}
    aria-label="Go back"
    title="Go back"
  >
    ‹
  </button>

  <button
    type="button"
    className="nav-history-button"
    onClick={goForward}
    disabled={!canGoForward}
    aria-label="Go forward"
    title="Go forward"
  >
    ›
  </button>
</div>
  {NAV_ITEMS.map((item) => (
    <button
      type="button"
      key={item}
      className={page === item ? "nav-item active" : "nav-item"}
      onClick={() => {
        setPage(item);

        if (item === "Explore") {
          loadExplorePage(1, false);
        }

        setProfileMenuOpen(false);
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
onClick={() => setProfileMenuOpen(!profileMenuOpen)}      >
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

{profileMenuOpen && (
  <div className="profile-dropdown">
    {[
      "Profile",
      "Following",
      "Boards",
      "Liked",
      "My Applications",
      "My Posted Jobs",
      ...(user?.role === "admin" ? ["Admin"] : []),
    ].map((item) => (
      <button
        type="button"
        key={item}
        className="profile-dropdown-item"
        onClick={() => {
          setPage(item);

          if (item === "Following") {
            loadFollowingDesigns();
          }

          setProfileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {item}
      </button>
    ))}
  </div>
)}

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

              
<div
  className="hero-feature design-motion"
  role="img"
  aria-label="Animated creative workspace with typography, colours and UI layouts"
>
  <div className="motion-topline">
    <span>PALETTE / CREATIVE LAB</span>
    <span className="motion-live">
      <i /> DESIGN IN MOTION
    </span>
  </div>

  <div className="motion-stage">

    <div className="motion-glow" />
    <div className="motion-orbit" />

    <div className="motion-card motion-type-card">
      <span>01 / TYPOGRAPHY</span>
      <strong>Aa</strong>
      <small>FIND YOUR TYPE.</small>
    </div>

    <div className="motion-card motion-color-card">
      <span>02 / COLOUR THEORY</span>
      <div className="motion-swatches">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <small>COLOUR HAS FEELING.</small>
    </div>

    <div className="motion-card motion-ui-card">
      <span>03 / INTERFACE DESIGN</span>
      <div className="motion-ui-preview">
        <div className="motion-ui-nav" />
        <div className="motion-ui-heading" />
        <div className="motion-ui-line" />
        <div className="motion-ui-line short" />
        <div className="motion-ui-blocks">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>

    <div className="motion-shape motion-shape-one" />
    <div className="motion-shape motion-shape-two" />

    <div className="motion-cursor">
      ↖ <span>CREATING</span>
    </div>

  </div>

  <div className="motion-bottomline">
    <span>THINK / EXPLORE / CREATE</span>
    <span>✳</span>
  </div>
</div>

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
          <PaletteLearn
            apiBase={API}
            token={token}
            user={user}
            legacyProgress={safeDesignProgress}
          />
        )}

{page === "Market" && (
  <section className="inner-page">
    <div className="section-overline">
      THE WIDER PICTURE / MARKET NOTES
    </div>

    <h1 className="inner-heading">
  Design<br /><em>Market.</em>
</h1>

    <p className="inner-intro">
  Explore design industry resources, trends, jobs, and opportunities.
</p>

    {/* MARKET SEARCH AND CATEGORIES */}
    <div className="market-controls">
      <input
        type="search"
        className="market-search"
        placeholder="Search roles, articles, skills, or design resources..."
        value={marketSearch}
        onChange={(event) => setMarketSearch(event.target.value)}
        aria-label="Search Market"
      />

      <div className="market-category-filters">
        {["All", "Jobs", "Internships", "Trends", "Resources", "Case Studies"].map(
          (category) => (
            <button
              key={category}
              type="button"
              className={
                marketCategory === category
                  ? "button-dark"
                  : "button-outline"
              }
              onClick={() => setMarketCategory(category)}
            >
              {category}
            </button>
          )
        )}
      </div>
      {(marketCategory === "All" ||
  marketCategory === "Jobs" ||
  marketCategory === "Internships") && (
  <div className="market-job-filters">
    <label>
      Location
      <input
        type="text"
        placeholder="e.g. Bengaluru, Remote"
        value={marketLocation}
        onChange={(event) => setMarketLocation(event.target.value)}
      />
    </label>

    <label>
      Work mode
      <select
        value={marketWorkMode}
        onChange={(event) => setMarketWorkMode(event.target.value)}
      >
        {["All", "On-site", "Remote", "Hybrid"].map((mode) => (
          <option key={mode} value={mode}>{mode}</option>
        ))}
      </select>
    </label>

    <label>
      Experience
      <select
        value={marketExperience}
        onChange={(event) => setMarketExperience(event.target.value)}
      >
        {["All", "Entry-level", "Junior", "Mid-level", "Senior", "Lead"].map((level) => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>
    </label>

    <button
      type="button"
      className="button-outline"
      onClick={() => {
        setMarketLocation("");
        setMarketWorkMode("All");
        setMarketExperience("All");
      }}
    >
      CLEAR FILTERS
    </button>
  </div>
)}
    </div>

    {/* JOB LISTINGS */}
    {(marketCategory === "All" ||
      marketCategory === "Jobs" ||
      marketCategory === "Internships") && (
      <div className="market-jobs-section">
        <div className="section-overline">CAREER OPPORTUNITIES</div>

        <h2>Find your next opportunity.</h2>
        <p>Explore opportunities from the design industry.</p>

        <button
          type="button"
          className="button-dark"
          onClick={() => setPage("Post a Job")}
        >
          POST A JOB ↗
        </button>

        {marketJobsLoading && (
          <p>Loading opportunities...</p>
        )}

        {marketJobsError && (
          <p className="error-message">{marketJobsError}</p>
        )}

        {!marketJobsLoading &&
          !marketJobsError &&
          filteredMarketJobs.length === 0 && (
            <p>
              No matching opportunities found. Try another search or category.
            </p>
          )}

        <div className="learning-list">
          {filteredMarketJobs.map((job) => (
  <article
    className="learning-card learning-light market-job-card"
    key={job._id}
  >
    <div className="market-job-card-top">
      <div className="learning-label">
        {job.company} / {job.location || "Location not specified"}
      </div>

      {job.status && (
        <span className="market-job-status">
          {job.status}
        </span>
      )}
    </div>

    <h2>{job.title}</h2>

    <div className="market-job-meta">
      <span>{job.employmentType}</span>
      <span>{job.experienceLevel}</span>
      <span>{job.workMode}</span>
    </div>

    <p className="market-job-salary">
      {job.salary || "Compensation not specified"}
    </p>

    <p className="market-job-description">
      {job.description}
    </p>

    {Array.isArray(job.skills) && job.skills.length > 0 && (
      <div className="market-job-skills">
        {job.skills.slice(0, 4).map((skill, index) => (
          <span key={`${skill}-${index}`}>{skill}</span>
        ))}
      </div>
    )}

    <button
      type="button"
      className="button-outline market-job-action"
      onClick={() => setSelectedMarketJob(job)}
    >
      VIEW DETAILS & APPLY ↗
    </button>
  </article>
))}
        </div>
        
              </div>
    )}

    {/* DESIGN RESOURCES */}
{(marketCategory === "All" || marketCategory === "Resources") && (
  <div className="market-resources-section">
    <div className="section-overline">THE DESIGN TOOLKIT</div>

    <h2>Resources worth keeping.</h2>

    <p>
      A curated collection of tools, references and guidelines
      for your design practice.
    </p>

<div className="market-resource-filters">
  {[
    "All",
    "Design Templates",
    "Typography",
    "Design Systems",
    "Accessibility",
    "Icons",
  ].map((category) => (
    <button
      key={category}
      type="button"
      className={
        marketResourceCategory === category
          ? "button-dark"
          : "button-outline"
      }
      onClick={() => setMarketResourceCategory(category)}
    >
      {category}
    </button>
  ))}

  <button
    type="button"
    className="button-outline"
    onClick={() => {
      setMarketResourceCategory("All");
      setMarketSearch("");
    }}
  >
    CLEAR FILTERS
  </button>
</div>

    {filteredMarketResources.length > 0 ? (
      <div className="learning-list">
        {filteredMarketResources.map((resource) => (
          <article
            className="learning-card learning-light"
            key={resource.id}
          >
            <div className="learning-label">
              {resource.type} / {resource.category}
            </div>

            <h2>{resource.title}</h2>

            <p>{resource.description}</p>

            <a
              className="learning-link"
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              EXPLORE RESOURCE ↗
            </a>
          </article>
        ))}
      </div>
    ) : (
      <p>No matching resources found. Try another search.</p>
    )}
  </div>
)}


{/* CASE STUDIES */}
{(marketCategory === "All" || marketCategory === "Case Studies") && (
  <div className="market-case-studies">
    <div className="section-overline">
  PRACTICE WITH REAL-WORLD-INSPIRED DESIGN PROBLEMS
</div>

    <h2>Design thinking in practice.</h2>

    <p>
  Explore practical UI/UX scenarios, investigate user problems,
  evaluate design decisions and learn how thoughtful solutions
  can improve digital experiences.
</p>

    <div className="learning-list">
      {filteredMarketCaseStudies.map((study) => (
        <article
          className="learning-card learning-light"
          key={study.id}
        >
          <div className="learning-label">
            {study.category} / {study.level}
          </div>

          <h2>{study.title}</h2>

          <h3>THE PROBLEM</h3>
          <p>{study.problem}</p>

          <h3>THE DESIGN APPROACH</h3>
          <p>{study.approach}</p>

          <h3>KEY TAKEAWAY</h3>
          <p>{study.takeaway}</p>
          <button
  type="button"
  className="button-dark"
  onClick={() => setSelectedMarketCaseStudy(study)}
>
  READ CASE STUDY ↗
</button>
        </article>

      ))}
    </div>

    {filteredMarketCaseStudies.length === 0 && (
      <p>No matching case studies found. Try another search.</p>
    )}
    {selectedMarketCaseStudy && (
  <article 
  ref={marketCaseStudyDetailRef}
  className="market-note learning-detail market-case-study-detail">
    <span className="section-overline">
      CASE STUDY / {selectedMarketCaseStudy.category}
    </span>

    <h2>{selectedMarketCaseStudy.title}</h2>
    <p>{selectedMarketCaseStudy.overview}</p>

    <h3>THE DESIGN PROBLEM</h3>
    <p>{selectedMarketCaseStudy.problem}</p>

    <h3>RESEARCH QUESTIONS</h3>
    <ul>
      {selectedMarketCaseStudy.researchQuestions.map((question, index) => (
        <li key={index}>{question}</li>
      ))}
    </ul>

    <h3>THE DESIGN APPROACH</h3>
    <p>{selectedMarketCaseStudy.approach}</p>

    <h3>KEY DESIGN DECISIONS</h3>
    <ul>
      {selectedMarketCaseStudy.designDecisions.map((decision, index) => (
        <li key={index}>{decision}</li>
      ))}
    </ul>

    <h3>KEY TAKEAWAY</h3>
    <p>{selectedMarketCaseStudy.takeaway}</p>

    <button
      type="button"
      className="button-outline"
      onClick={() => setSelectedMarketCaseStudy(null)}
    >
      CLOSE CASE STUDY
    </button>
  </article>
)}
  </div>
)}


    {/* MARKET NOTES AND TRENDS */}
    {(marketCategory === "All" || marketCategory === "Trends") && (
      <>
        <div className="learning-list">
          {filteredMarketNotes.map((note, index) => (
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
      </>
    )}
  </section>
)}


{page === "My Applications" && (
  <section className="inner-page">
    <div className="section-overline">
      PALETTE MARKET / CAREER TRACKER
    </div>

    <h1 className="inner-heading">
      My<br /><em>applications.</em>
    </h1>

    <p className="inner-intro">
      Keep track of your opportunities and follow your application progress.
    </p>

    {applicationsLoading && (
      <p>Loading your applications...</p>
    )}

    {applicationsError && (
      <p className="error-message">{applicationsError}</p>
    )}

    {!applicationsLoading &&
      !applicationsError &&
      myApplications.length === 0 && (
        <p>You haven't applied for any jobs yet.</p>
      )}

    {!applicationsLoading && myApplications.length > 0 && (
      <div className="learning-list">
        {myApplications.map((application) => (
          <article
            className="learning-card learning-light"
            key={application._id}
          >
            <div className="learning-label">
              {application.job?.company || "Company"} /{" "}
              {application.job?.location || "Location"}
              
            </div>

            <h2>
              {application.job?.title || "Job no longer available"}
            </h2>

            <p>
              {application.job?.employmentType || "Not specified"} ·{" "}
              {application.job?.workMode || "Not specified"}
            </p>

            <p>
              Status: <strong>{application.status}</strong>
            </p>

            <p>
              Applied on:{" "}
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>
    )}

    <p>
      Showing {myApplications.length} applications
    </p>
  </section>
)}


{page === "Post a Job" && (
  <section className="inner-page market-post-page">

    {/* PAGE INTRODUCTION */}
    <div className="section-overline">
      PALETTE MARKET / EMPLOYERS
    </div>

    <div className="market-post-hero">
      <div>
        <h1 className="inner-heading">
          Find your next<br />
          <em>creative mind.</em>
        </h1>
      </div>

      <p className="inner-intro">
        Share an opportunity with the PALETTE design community.
        Connect with designers who can bring meaningful ideas
        and thoughtful experiences to life.
      </p>
    </div>

    {/* JOB POSTING FORM */}
    <form
      className="market-post-form"
      onSubmit={handlePostJob}
    >

      {/* SECTION 01 — OPPORTUNITY */}
      <div className="market-form-section">
        <div className="market-form-section-heading">
          <span>01 / THE OPPORTUNITY</span>
          <p>Start with the essentials.</p>
        </div>

        <div className="market-form-grid">

          <label className="market-form-field market-form-field-wide">
            <span>JOB TITLE *</span>
            <input
              required
              value={jobForm.title}
              onChange={(e) =>
                setJobForm({...jobForm, title: e.target.value})
              }
              placeholder="e.g. Product Designer"
            />
          </label>

          <label className="market-form-field">
            <span>COMPANY NAME *</span>
            <input
              required
              value={jobForm.company}
              onChange={(e) =>
                setJobForm({...jobForm, company: e.target.value})
              }
              placeholder="Your company name"
            />
          </label>

          <label className="market-form-field">
            <span>JOB LOCATION *</span>
            <input
              required
              value={jobForm.location}
              onChange={(e) =>
                setJobForm({...jobForm, location: e.target.value})
              }
              placeholder="e.g. Bengaluru or Remote"
            />
          </label>

        </div>
      </div>

      {/* SECTION 02 — WORK ARRANGEMENT */}
      <div className="market-form-section">
        <div className="market-form-section-heading">
          <span>02 / WORK ARRANGEMENT</span>
          <p>Tell designers how the role works.</p>
        </div>

        <div className="market-form-grid">

          <label className="market-form-field">
            <span>EMPLOYMENT TYPE</span>
            <select
              value={jobForm.employmentType}
              onChange={(e) =>
                setJobForm({...jobForm, employmentType: e.target.value})
              }
            >
              {["Full-time", "Part-time", "Internship", "Freelance", "Contract"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="market-form-field">
            <span>EXPERIENCE LEVEL</span>
            <select
              value={jobForm.experienceLevel}
              onChange={(e) =>
                setJobForm({...jobForm, experienceLevel: e.target.value})
              }
            >
              {["Entry-level", "Junior", "Mid-level", "Senior", "Lead"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="market-form-field">
            <span>WORK MODE</span>
            <select
              value={jobForm.workMode}
              onChange={(e) =>
                setJobForm({...jobForm, workMode: e.target.value})
              }
            >
              {["On-site", "Remote", "Hybrid"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="market-form-field">
            <span>SALARY / COMPENSATION</span>
            <input
              value={jobForm.salary}
              onChange={(e) =>
                setJobForm({...jobForm, salary: e.target.value})
              }
              placeholder="e.g. ₹6–10 LPA"
            />
          </label>

        </div>
      </div>

      {/* SECTION 03 — ROLE DETAILS */}
      <div className="market-form-section">
        <div className="market-form-section-heading">
          <span>03 / ABOUT THE ROLE</span>
          <p>Give potential applicants a better understanding of the opportunity.</p>
        </div>

        <div className="market-form-grid">

          <label className="market-form-field market-form-field-wide">
            <span>JOB DESCRIPTION *</span>
            <textarea
              required
              rows={6}
              value={jobForm.description}
              onChange={(e) =>
                setJobForm({...jobForm, description: e.target.value})
              }
              placeholder="Describe the role, responsibilities and the kind of designer you're looking for..."
            />
          </label>

          <label className="market-form-field market-form-field-wide">
            <span>REQUIREMENTS</span>
            <textarea
              rows={5}
              value={jobForm.requirements}
              onChange={(e) =>
                setJobForm({...jobForm, requirements: e.target.value})
              }
              placeholder="Enter each requirement on a new line..."
            />
          </label>

          <label className="market-form-field market-form-field-wide">
            <span>REQUIRED SKILLS</span>
            <input
              value={jobForm.skills}
              onChange={(e) =>
                setJobForm({...jobForm, skills: e.target.value})
              }
              placeholder="e.g. Figma, UI Design, UX Research, Prototyping"
            />
            <small>Separate skills with commas.</small>
          </label>

        </div>
      </div>

      {/* SUBMISSION */}
      <div className="market-form-footer">

        {jobPostMessage && (
          <p role="status">{jobPostMessage}</p>
        )}

        <button
          type="submit"
          className="button-dark market-publish-button"
          disabled={jobPostLoading}
        >
          {jobPostLoading ? "PUBLISHING OPPORTUNITY..." : "PUBLISH JOB ↗"}
        </button>

        <p>
          Your opportunity will be shared with the PALETTE design community.
        </p>

      </div>

    </form>
  </section>
)}

{page === "My Posted Jobs" && (
  <section className="inner-page">
    <div className="section-overline">
      PALETTE MARKET / EMPLOYER DASHBOARD
    </div>

    <h1 className="inner-heading">
      My posted<br /><em>jobs.</em>
    </h1>

    <p className="inner-intro">
      Manage the opportunities you've shared with the PALETTE community.
    </p>

    {myPostedJobsLoading && (
      <p>Loading your posted jobs...</p>
    )}

    {myPostedJobsError && (
      <p className="error-message">{myPostedJobsError}</p>
    )}

    {!myPostedJobsLoading &&
      !myPostedJobsError &&
      myPostedJobs.length === 0 && (
        <p>You haven't posted any jobs yet.</p>
      )}

    {!myPostedJobsLoading && myPostedJobs.length > 0 && (
      <div className="learning-list">
        {myPostedJobs.map((job) => (
          <article
            className="learning-card learning-light"
            key={job._id}
          >
            <div className="learning-label">
              {job.company} / {job.location}
            </div>

            <h2>{job.title}</h2>

            <p>
              {job.employmentType} · {job.experienceLevel} · {job.workMode}
            </p>

            <p>{job.salary}</p>

            <p>
              Status: <strong>{job.status}</strong>
            </p>
          </article>
        ))}
      </div>
    )}

    <p>Showing {myPostedJobs.length} posted jobs</p>
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

                {page === "Admin" && user?.role === "admin" && (
          <AdminDashboard token={token} />
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

      
{selectedMarketJob && (
  <div
    className="auth-backdrop"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        setSelectedMarketJob(null);
      }
    }}
  >
    
<section
  className="design-detail-panel market-job-detail-panel"
  role="dialog"
  aria-modal="true"
  aria-labelledby="job-detail-title"
>
  <button
    type="button"
    className="auth-close"
    onClick={() => setSelectedMarketJob(null)}
    aria-label="Close job details"
  >
    ×
  </button>

  {/* JOB HEADER */}
  <div className="section-overline">
    PALETTE MARKET / OPPORTUNITIES
  </div>

  <div className="market-detail-header">
    <h2 id="job-detail-title">
      {selectedMarketJob.title}<span>.</span>
    </h2>

    <p className="market-detail-company">
      {selectedMarketJob.company} · {selectedMarketJob.location}
    </p>

    <div className="market-detail-tags">
      <span>{selectedMarketJob.employmentType}</span>
      <span>{selectedMarketJob.experienceLevel}</span>
      <span>{selectedMarketJob.workMode}</span>
    </div>
  </div>

  {/* SALARY */}
  <div className="market-detail-salary">
    <span>COMPENSATION</span>
    <strong>{selectedMarketJob.salary || "Not specified"}</strong>
  </div>

  {/* JOB INFORMATION */}
  <div className="market-detail-content">

    <div className="market-detail-section">
      <div className="market-detail-label">
        01 / ABOUT THE OPPORTUNITY
      </div>
      <p className="market-detail-description">
        {selectedMarketJob.description}
      </p>
    </div>

    <div className="market-detail-section">
      <div className="market-detail-label">
        02 / REQUIREMENTS
      </div>

      {selectedMarketJob.requirements?.length > 0 ? (
        <ul className="market-detail-requirements">
          {selectedMarketJob.requirements.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="market-detail-muted">
          No specific requirements listed.
        </p>
      )}
    </div>

    <div className="market-detail-section">
      <div className="market-detail-label">
        03 / REQUIRED SKILLS
      </div>

      <div className="market-detail-skills">
        {selectedMarketJob.skills?.length > 0 ? (
          selectedMarketJob.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))
        ) : (
          <span>Not specified</span>
        )}
      </div>
    </div>
  </div>

  {/* APPLICATION FORM */}
  {showApplicationForm && (
    <form
      className="market-application-form"
      onSubmit={handleApplyForJob}
    >
      <div className="market-application-heading">
        <div className="market-detail-label">
          04 / YOUR APPLICATION
        </div>

        <h3>Make your introduction.</h3>

        <p>
          Tell the employer what makes you a good fit for this opportunity.
        </p>
      </div>

      <label htmlFor="application-cover-letter">
        COVER LETTER *
      </label>

      <textarea
        id="application-cover-letter"
        value={coverLetter}
        onChange={(event) => setCoverLetter(event.target.value)}
        rows={5}
        maxLength={3000}
        required
        placeholder="Tell the employer about your experience, approach and interest in this role..."
      />

      <label htmlFor="application-portfolio">
        PORTFOLIO LINK
      </label>

      <input
        id="application-portfolio"
        type="url"
        value={portfolioLink}
        onChange={(event) => setPortfolioLink(event.target.value)}
        placeholder="https://your-portfolio.com"
      />

      {applicationMessage && (
        <p role="status" className="market-application-message">
          {applicationMessage}
        </p>
      )}

      <div className="market-application-actions">
        <button
          type="submit"
          className="button-dark"
          disabled={applicationLoading}
        >
          {applicationLoading
            ? "SUBMITTING..."
            : "SUBMIT APPLICATION ↗"}
        </button>

        <button
          type="button"
          className="button-outline"
          onClick={() => setShowApplicationForm(false)}
          disabled={applicationLoading}
        >
          CANCEL
        </button>
      </div>
    </form>
  )}

  {/* BOTTOM ACTIONS */}
  <div className="market-detail-actions">
    {!showApplicationForm && (
      <button
        type="button"
        className="button-dark"
        onClick={() => {
          setShowApplicationForm(true);
          setApplicationMessage("");
        }}
      >
        APPLY NOW ↗
      </button>
    )}

    <button
      type="button"
      className="button-outline"
      onClick={() => setSelectedMarketJob(null)}
    >
      CLOSE
    </button>
  </div>
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

