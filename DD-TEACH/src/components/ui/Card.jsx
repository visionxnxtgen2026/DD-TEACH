import React from "react";
import clsx from "clsx";

export default function Card({
  children,
  className = "",
  hover = true,
  onClick,
  padding = "md",
  variant = "default",
  disabled = false,
  loading = false,
  header = null,
  footer = null,
}) {
  // 🎨 VARIANTS
  const variants = {
    default: "bg-white",
    gradient:
      "bg-gradient-to-br from-blue-600 to-blue-500 text-white",
    outline: "border border-gray-200 bg-white",
    soft: "bg-blue-50",
  };

  // 📏 PADDING
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    none: "p-0",
  };

  const isClickable = !!onClick && !disabled;

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          onClick();
        }
      }}
      className={clsx(
        "rounded-2xl transition-all duration-300 ease-in-out",
        variants[variant],
        paddings[padding],

        // shadow
        "shadow-sm",

        // hover
        hover &&
          isClickable &&
          "hover:shadow-xl hover:-translate-y-1 cursor-pointer",

        // disabled
        disabled && "opacity-50 cursor-not-allowed",

        className
      )}
    >
      {/* 🔷 HEADER */}
      {header && (
        <div className="mb-4 font-semibold text-gray-800">
          {header}
        </div>
      )}

      {/* 🔄 LOADING */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}

      {/* 🔻 FOOTER */}
      {footer && (
        <div className="mt-4 pt-4 border-t text-sm text-gray-500">
          {footer}
        </div>
      )}
    </div>
  );
}