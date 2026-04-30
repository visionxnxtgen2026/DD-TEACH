export const ROUTES = {
  HOME: "/",
  STANDARDS: "/standards",

  SUBJECTS: (standard) => `/standard/${standard}`,

  TOPICS: (standard, subject) =>
    `/subject/${standard}/${subject}`,

  SYLLABUS: (standard, subject) =>
    `/subject/${standard}/${subject}/syllabus`,

  UNIT: (standard, subject, unitId) =>
    `/unit/${standard}/${subject}/${unitId}`,

  CONTENT: (standard, subject, topic) =>
    `/topic/${standard}/${subject}/${topic}`,

  BOOKMARKS: "/bookmarks",
};