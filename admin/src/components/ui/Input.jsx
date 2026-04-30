import React from "react";

export default function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error = "",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">

      {/* 🔤 LABEL */}
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}

      {/* 🔥 INPUT FIELD */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 rounded-lg border outline-none transition
          ${
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-300"
              : "border-gray-300 focus:ring-2 focus:ring-blue-400"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          ${className}
        `}
        {...props}
      />

      {/* ❌ ERROR MESSAGE */}
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}

    </div>
  );
}