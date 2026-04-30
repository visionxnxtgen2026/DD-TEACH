import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    clsx(
      "transition font-medium",
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-600 hover:text-blue-600"
    );

  const handleClose = () => setIsOpen(false);

  // 🔥 DEFAULT SUBJECT NAVIGATION (can make dynamic later)
  const goToSubjects = () => {
    navigate("/standard/9th");
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* 🔷 LOGO */}
        <NavLink to="/" className="flex items-center gap-2">
          <BookOpen className="text-blue-600" size={26} />
          <span className="text-xl font-bold text-blue-700">
            DD Teach
          </span>
        </NavLink>

        {/* 🔹 DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8">

          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/standards" className={linkClass}>
            Standards
          </NavLink>

          {/* 🔥 Subjects button (dynamic) */}
          <button
            onClick={goToSubjects}
            className="text-gray-600 hover:text-blue-600 transition font-medium"
          >
            Subjects
          </button>

        </nav>

        {/* 🎯 CTA */}
        <div className="hidden md:block text-blue-600 font-semibold text-sm">
          Learn Smart. Achieve More.
        </div>

        {/* 📱 MOBILE BUTTON */}
        <button
          className="md:hidden text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 📱 MOBILE MENU */}
      <div
        className={clsx(
          "md:hidden px-6 bg-white border-t overflow-hidden transition-all duration-300",
          isOpen ? "max-h-60 py-4" : "max-h-0"
        )}
      >
        <div className="flex flex-col gap-4 font-medium">

          <NavLink
            to="/"
            onClick={handleClose}
            className={linkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/standards"
            onClick={handleClose}
            className={linkClass}
          >
            Standards
          </NavLink>

          {/* 🔥 Subjects */}
          <button
            onClick={goToSubjects}
            className="text-left text-gray-600 hover:text-blue-600 transition"
          >
            Subjects
          </button>

        </div>

        <div className="mt-4 text-blue-600 text-sm font-semibold">
          Learn Smart. Achieve More.
        </div>
      </div>
    </header>
  );
}