import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search topics...",
}) {
  return (
    <div className="flex items-center bg-white border rounded-lg px-3 py-2 w-full md:w-72 shadow-sm">
      
      {/* 🔍 ICON */}
      <Search size={18} className="text-gray-400" />

      {/* ✏️ INPUT */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="ml-2 outline-none w-full text-sm"
      />

      {/* ❌ CLEAR BUTTON */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}