import React from "react";
import SyllabusRow from "./SyllabusRow";

export default function SyllabusList({ syllabus = [] }) {

  // ⚠️ EMPTY STATE
  if (!syllabus.length) {
    return (
      <div className="text-center text-gray-400 py-10">
        No syllabus available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {syllabus.map((unit, index) => (
        <SyllabusRow
          key={unit.id}
          unit={unit}
          index={index}
        />
      ))}
    </div>
  );
}