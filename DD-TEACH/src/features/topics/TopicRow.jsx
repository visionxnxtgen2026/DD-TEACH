import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, PlayCircle, ArrowRight } from "lucide-react";

export default function TopicRow({
  topic,
  index,
  standard,
  subject,
}) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/topic/${standard}/${subject}/${topic.title}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition">
      
      {/* 🔷 LEFT SIDE */}
      <div className="flex gap-4 items-start">
        
        {/* 🔢 NUMBER */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
          {index + 1}
        </div>

        {/* 📘 TEXT */}
        <div>
          <h3 className="font-semibold text-gray-800">
            {topic.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {topic.desc}
          </p>
        </div>
      </div>

      {/* 🔥 ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3">

        {/* 📂 PPT BUTTON */}
        <a
          href={topic.pptUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
        >
          <FileText size={18} />
          PPT
        </a>

        {/* ▶️ YOUTUBE BUTTON */}
        <a
          href={topic.youtubeUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
        >
          <PlayCircle size={18} />
          YouTube
        </a>

        {/* 🔍 VIEW DETAILS */}
        <button
          onClick={handleViewDetails}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          View Details
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
}