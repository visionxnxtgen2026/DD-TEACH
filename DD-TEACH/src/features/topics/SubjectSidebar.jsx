import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, FileText, Bookmark } from "lucide-react";

export default function SubjectSidebar({ standard, subject }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 🔥 SAFE ACTIVE MATCH (FIXED)
  const basePath = `/subject/${standard}/${subject}`;

  const isTopics =
    pathname === basePath ||
    pathname.startsWith(`${basePath}/topic`);

  const isSyllabus = pathname.includes("/syllabus");
  const isBookmarks = pathname.includes("/bookmarks");

  // 🚨 SAFETY (prevent undefined navigation)
  const goSubjects = () => {
    if (!standard) return;
    navigate(`/standard/${standard}`);
  };

  const goTopics = () => {
    if (!standard || !subject) return;
    navigate(basePath);
  };

  const goSyllabus = () => {
    if (!standard || !subject) return;
    navigate(`${basePath}/syllabus`);
  };

  const goBookmarks = () => {
    navigate("/bookmarks");
  };

  return (
    <aside className="w-64 bg-white border-r p-5 hidden md:flex flex-col justify-between">

      <div>
        {/* 🔙 BACK */}
        <button
          onClick={goSubjects}
          className="text-blue-600 mb-6 flex items-center gap-1 hover:underline"
        >
          ← Back to Subjects
        </button>

        {/* 📘 SUBJECT INFO */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-800 text-lg capitalize">
            {subject || "Subject"}
          </h2>
          <p className="text-sm text-gray-500">
            {standard || "-"} Standard
          </p>
        </div>

        {/* 📂 MENU */}
        <nav className="space-y-2">

          {/* 📚 ALL TOPICS */}
          <button
            onClick={goTopics}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              isTopics
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BookOpen size={18} />
            All Topics
          </button>

          {/* 📘 SYLLABUS */}
          <button
            onClick={goSyllabus}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              isSyllabus
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FileText size={18} />
            Syllabus
          </button>

          {/* 🔖 BOOKMARKS */}
          <button
            onClick={goBookmarks}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              isBookmarks
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Bookmark size={18} />
            Bookmarks
          </button>

        </nav>
      </div>

      {/* 🎨 FOOTER */}
      <div className="mt-10 text-xs text-gray-400">
        DD Teach © {new Date().getFullYear()}
      </div>

    </aside>
  );
}