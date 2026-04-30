import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

export default function SyllabusRow({ unit, index }) {
  const navigate = useNavigate();
  const { standard, subject } = useParams();

  const handleClick = () => {
    navigate(`/unit/${standard}/${subject}/${unit.id}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Open Unit ${index + 1}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
      className={clsx(
        "group bg-white rounded-xl shadow-sm p-5",
        "flex justify-between items-center",
        "cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* 🔷 LEFT */}
      <div className="flex items-center gap-4">

        {/* 🔢 NUMBER */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
          {index + 1}
        </div>

        {/* 📘 TITLE */}
        <h3 className="font-semibold text-blue-600 group-hover:text-blue-700 transition">
          Unit {index + 1}: {unit.title}
        </h3>

      </div>

      {/* ➡️ RIGHT ICON */}
      <ChevronRight
        size={20}
        className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1"
      />
    </div>
  );
}