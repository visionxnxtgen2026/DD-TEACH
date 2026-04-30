import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  className = "",
}) {
  // 🎨 VARIANTS
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",

    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-50",

    ghost:
      "text-blue-600 hover:bg-blue-50",

    gradient:
      "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg",
  };

  // 📏 SIZES
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 ease-in-out focus:outline-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* 🔄 LOADING SPINNER */}
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}

      {/* ⬅️ LEFT ICON */}
      {!loading && leftIcon}

      {/* TEXT */}
      <span>{children}</span>

      {/* ➡️ RIGHT ICON */}
      {!loading && rightIcon}
    </button>
  );
}