import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Card from "../../components/ui/Card";

export default function StandardCard({
  standard,
  activeStandard = null, // 🔥 dynamic active
  description = "Standard",
}) {
  const navigate = useNavigate();

  const isActive = activeStandard === standard;

  const handleClick = () => {
    navigate(`/standard/${standard}`);
  };

  return (
    <Card
      onClick={handleClick}
      variant={isActive ? "gradient" : "default"}
      className="text-center group"
    >
      {/* 🎓 TITLE */}
      <div
        className={`text-2xl font-bold transition ${
          isActive ? "text-white" : "text-gray-800"
        }`}
      >
        {standard}
      </div>

      {/* 📘 SUBTEXT */}
      <div
        className={`mt-1 text-sm transition ${
          isActive ? "text-blue-100" : "text-gray-500"
        }`}
      >
        {description}
      </div>

      {/* ➡️ ICON */}
      <div className="mt-5 flex justify-center">
        <span
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
            isActive
              ? "bg-white text-blue-600"
              : "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
          }`}
        >
          <ArrowRight size={18} />
        </span>
      </div>
    </Card>
  );
}