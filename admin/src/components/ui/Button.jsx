import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | outline | danger | ghost
  size = "md", // sm | md | lg
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
}) {
  // 🎨 VARIANTS
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-gray-600 hover:bg-gray-100",
  };

  // 📏 SIZES
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2
        rounded-lg transition font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {/* ⏳ LOADING */}
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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