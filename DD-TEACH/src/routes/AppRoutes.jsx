import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// 🏫 SCHOOL PAGES
import Home from "../pages/Home";
import Standards from "../pages/Standards";
import Subjects from "../pages/Subjects";
import Topics from "../pages/Topics";
import Syllabus from "../pages/Syllabus";
import UnitDetails from "../pages/UnitDetails";
import Content from "../pages/Content";
import Bookmarks from "../pages/Bookmarks";

// 🎓 COLLEGE PAGES
import CollegeHome from "../pages/college/CollegeHome";
import Semester from "../pages/college/Semester";
import CollegeSubjects from "../pages/college/CollegeSubjects";
import CollegeTopics from "../pages/college/CollegeTopics";
import CollegeContent from "../pages/college/CollegeContent";

import ScrollToTop from "../components/common/ScrollToTop";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* 🏠 HOME */}
        <Route path="/" element={<Home />} />

        {/* 🏫 SCHOOL */}
        <Route path="/standards" element={<Standards />} />
        <Route path="/standard/:standard" element={<Subjects />} />

        <Route
          path="/subject/:standard/:subject/syllabus"
          element={<Syllabus />}
        />

        <Route
          path="/subject/:standard/:subject"
          element={<Topics />}
        />

        <Route
          path="/unit/:standard/:subject/:unitId"
          element={<UnitDetails />}
        />

        <Route
          path="/topic/:standard/:subject/:topic"
          element={<Content />}
        />

        {/* 🎓 COLLEGE */}
        <Route path="/college" element={<CollegeHome />} />
        <Route path="/college/:stream" element={<Semester />} />
        <Route path="/college/:stream/:sem" element={<CollegeSubjects />} />
        <Route
          path="/college/:stream/:sem/:subject"
          element={<CollegeTopics />}
        />
        <Route
          path="/college/:stream/:sem/:subject/:topic"
          element={<CollegeContent />}
        />

        {/* 🔖 COMMON */}
        <Route path="/bookmarks" element={<Bookmarks />} />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// ❌ 404 PAGE
function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      
      <h1 className="text-5xl font-bold text-blue-600 mb-4">
        404
      </h1>

      <p className="text-gray-600 mb-6">
        Page not found
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Home
      </button>

    </div>
  );
}