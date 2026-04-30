// 🌐 APP INFO
export const APP_NAME = "DD Teach";
export const APP_TAGLINE = "Learn Smart. Achieve More.";

// 🎓 STANDARDS
export const STANDARDS = [
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];

// 📚 SUBJECTS
export const SUBJECTS = [
  "Tamil",
  "English",
  "Maths",
  "Science",
  "Social",
];

// 🎨 SUBJECT COLORS (for UI)
export const SUBJECT_COLORS = {
  Tamil: "bg-purple-100 text-purple-600",
  English: "bg-blue-100 text-blue-600",
  Maths: "bg-green-100 text-green-600",
  Science: "bg-red-100 text-red-600",
  Social: "bg-yellow-100 text-yellow-600",
};

// 📘 SAMPLE SYLLABUS (fallback data)
export const SAMPLE_SYLLABUS = [
  {
    id: 1,
    title: "Matter in Our Surroundings",
  },
  {
    id: 2,
    title: "Is Matter Around Us Pure?",
  },
  {
    id: 3,
    title: "Atoms and Molecules",
  },
  {
    id: 4,
    title: "Structure of the Atom",
  },
  {
    id: 5,
    title: "The Fundamental Unit of Life",
  },
];

// 📚 SAMPLE TOPICS (Unit wise)
export const SAMPLE_UNITS = [
  {
    unitId: 1,
    unitTitle: "Matter in Our Surroundings",
    topics: [
      {
        id: "1.1",
        title: "States of Matter",
        ppt: "#",
        youtube: "#",
      },
      {
        id: "1.2",
        title: "Characteristics of Particles",
        ppt: "#",
        youtube: "#",
      },
    ],
  },
];

// 🔗 ROUTES (centralized)
export const ROUTES = {
  HOME: "/",
  STANDARDS: "/standards",
  SUBJECTS: "/standard/:standard",
  TOPICS: "/subject/:standard/:subject",
  SYLLABUS: "/subject/:standard/:subject/syllabus",
  UNIT: "/unit/:standard/:subject/:unitId",
  CONTENT: "/topic/:standard/:subject/:topic",
  BOOKMARKS: "/bookmarks",
};

// 🎯 LOCAL STORAGE KEYS
export const STORAGE_KEYS = {
  BOOKMARKS: "ddteach_bookmarks",
};

// 🎥 DEFAULT LINKS
export const DEFAULT_LINKS = {
  PPT: "#",
  YOUTUBE: "#",
};