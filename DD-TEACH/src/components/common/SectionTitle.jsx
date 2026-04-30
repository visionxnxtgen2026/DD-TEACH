import React from "react";
import clsx from "clsx";

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  size = "md", // sm | md | lg
  underline = true,
  rightContent = null, // optional (button etc.)
  className = "",
}) {
  const sizes = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
  };

  return (
    <div
      className={clsx(
        "mb-8 flex flex-col gap-2",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        align === "right" && "items-end text-right",
        className
      )}
    >
      {/* 🔷 TOP ROW (TITLE + ACTION) */}
      <div className="w-full flex items-center justify-between">
        
        {/* TITLE BLOCK */}
        <div>
          <h2
            className={clsx(
              "font-bold text-gray-800",
              sizes[size]
            )}
          >
            {title}
          </h2>

          {/* 🔹 SUBTITLE */}
          {subtitle && (
            <p className="mt-2 text-gray-500 text-sm md:text-base">
              {subtitle}
            </p>
          )}

          {/* 🔥 UNDERLINE */}
          {underline && (
            <div
              className={clsx(
                "mt-3 h-1 w-16 bg-blue-600 rounded-full",
                align === "center" && "mx-auto",
                align === "left" && "mx-0",
                align === "right" && "ml-auto"
              )}
            />
          )}
        </div>

        {/* 👉 RIGHT SIDE (OPTIONAL BUTTON / ACTION) */}
        {rightContent && (
          <div className="hidden md:block">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}