import { useState, useCallback } from "react";

/**
 * 🔥 useToggle Hook
 * @param {boolean} initialValue - default state (true / false)
 */
export default function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  // 🔁 Toggle (true ↔ false)
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  // ✅ Set true
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  // ❌ Set false
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  // 🔄 Reset to initial value
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    reset,
  };
}