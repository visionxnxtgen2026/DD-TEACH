import React from "react";

export default function Card({
  children,
  title,
  footer,
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
    >

      {/* 🔷 HEADER */}
      {title && (
        <div className="px-5 py-3 border-b text-gray-700 font-semibold">
          {title}
        </div>
      )}

      {/* 📦 BODY */}
      <div className="p-5">
        {children}
      </div>

      {/* 🔻 FOOTER */}
      {footer && (
        <div className="px-5 py-3 border-t bg-gray-50">
          {footer}
        </div>
      )}

    </div>
  );
}