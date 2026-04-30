import React from "react";

export default function Form({
  fields = [],
  values = {},
  onChange,
  onSubmit,
  buttonText = "Submit",
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">

      <div className="flex flex-col md:flex-row gap-4 flex-wrap">

        {fields.map((field) => {
          // 🔥 INPUT
          if (field.type === "text" || field.type === "number") {
            return (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(e) =>
                  onChange(field.name, e.target.value)
                }
                className="border p-2 rounded-lg flex-1"
              />
            );
          }

          // 🔥 SELECT
          if (field.type === "select") {
            return (
              <select
                key={field.name}
                value={values[field.name] || ""}
                onChange={(e) =>
                  onChange(field.name, e.target.value)
                }
                className="border p-2 rounded-lg"
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
          }

          return null;
        })}

        {/* 🔥 BUTTON */}
        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>

    </div>
  );
}