import React from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";

import Card from "../../components/ui/Card";

export default function TopicCard({ topic, subject, standard }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/topic/${standard}/${subject}/${topic}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="flex flex-col justify-between h-full"
    >
      {/* 📘 TOPIC NAME */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {topic}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Learn this topic easily
        </p>
      </div>

      {/* ▶️ ACTION AREA */}
      <div className="mt-6 flex items-center justify-between">
        
        <span className="text-blue-600 text-sm font-medium">
          View Content
        </span>

        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <PlayCircle size={20} />
        </span>
      </div>
    </Card>
  );
}