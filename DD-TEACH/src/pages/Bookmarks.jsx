import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Trash2,
  FileText,
  PlayCircle,
  Bookmark as BookmarkIcon,
  ChevronRight,
} from "lucide-react";

import {
  removeBookmark,
  getBookmarks,
  clearBookmarks,
} from "../utils/bookmark";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SubjectSidebar from "../features/topics/SubjectSidebar";

export default function Bookmarks() {
  const { standard, subject } = useParams();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState([]);

  // 🔥 LOAD
  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  // ❌ REMOVE ONE
  const handleRemove = (id) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  // 🧹 CLEAR ALL
  const handleClear = () => {
    clearBookmarks();
    setBookmarks([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <Navbar />

      <div className="flex flex-1">

        <SubjectSidebar standard={standard} subject={subject} />

        <div className="flex-1 p-6 md:p-10">

          {/* 🔷 HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <BookmarkIcon className="text-blue-600" />
                Bookmarks
              </h1>

              <p className="text-gray-500 mt-1">
                Saved topics for quick access
              </p>
            </div>

            <button
              onClick={handleClear}
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 border border-red-400 text-red-500 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>

          {/* 📚 LIST */}
          <div className="space-y-5">

            {bookmarks.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition"
              >

                {/* 🔷 LEFT CLICKABLE */}
                <div
                  onClick={() =>
                    navigate(
                      `/topic/${item.standard}/${item.subject}/${item.id}`
                    )
                  }
                  className="flex items-center gap-4 cursor-pointer flex-1"
                >

                  {/* 🔖 ICON */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <BookmarkIcon size={18} />
                  </div>

                  {/* 📘 TITLE */}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.unit} • {item.subject}
                    </p>
                  </div>
                </div>

                {/* 🔷 ACTIONS */}
                <div className="flex items-center gap-3">

                  {/* 📄 PPT */}
                  {item.ppt && (
                    <button
                      onClick={() => window.open(item.ppt, "_blank")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <FileText size={16} />
                      PPT
                    </button>
                  )}

                  {/* ▶️ YOUTUBE */}
                  {item.youtube && (
                    <button
                      onClick={() => window.open(item.youtube, "_blank")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <PlayCircle size={16} />
                      YouTube
                    </button>
                  )}

                  {/* ❌ DELETE */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>

                  <ChevronRight className="text-gray-400" />
                </div>

              </div>
            ))}

            {/* ⚠️ EMPTY */}
            {!bookmarks.length && (
              <div className="text-center text-gray-400 mt-20">
                <BookmarkIcon className="mx-auto mb-3 opacity-50" size={40} />
                <p className="text-lg">No bookmarks yet</p>
                <p className="text-sm mt-1">
                  Save topics to access them quickly 🚀
                </p>
              </div>
            )}

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}