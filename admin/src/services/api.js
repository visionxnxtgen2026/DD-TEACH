/**
 * api.js - Centralized API Service
 */

// 1. Configuration: Use Vite environment variables with a fallback for local dev
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE = `${API_URL}/api`;

/**
 * 🔧 QUERY BUILDER
 * Filters out empty/null/undefined values and returns a URL query string.
 * Example: { category: "tech", page: 1, search: "" } -> "?category=tech&page=1"
 */
const buildQuery = (params = {}) => {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
  );

  const query = new URLSearchParams(filtered).toString();
  return query ? `?${query}` : "";
};

/**
 * 🔥 COMMON REQUEST HANDLER
 * Handles JSON vs FormData, Authorization headers, and 401 Unauthorized logic.
 */
const request = async (url, options = {}) => {
  try {
    const isFormData = options.body instanceof FormData;
    const token = localStorage.getItem("adminToken");

    const res = await fetch(url, {
      ...options,
      headers: {
        // Automatically set JSON header unless sending FormData
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        // Attach Bearer token if it exists
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    // Handle potential empty responses (like 204 No Content)
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      // Auto-logout on token expiration/invalid token
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        // Optional: Trigger a redirect or event here
        // window.location.href = "/login"; 
      }
      throw new Error(data.message || data || "API Error");
    }

    return data;
  } catch (err) {
    console.error("❌ API Error:", err.message);
    throw err;
  }
};

/**
 * 🚀 API METHODS
 */
export const API = {
  // 🔐 AUTHENTICATION
  login: (data) =>
    request(`${BASE}/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data) =>
    request(`${BASE}/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProfile: () => request(`${BASE}/auth/me`),

  // 📊 DASHBOARD
  getDashboardStats: () => request(`${BASE}/dashboard/stats`),

  // 📚 SUBJECTS
  getSubjects: (params = {}) => 
    request(`${BASE}/subjects${buildQuery(params)}`),

  createSubject: (data) =>
    request(`${BASE}/subjects`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSubject: (id, data) =>
    request(`${BASE}/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSubject: (id) =>
    request(`${BASE}/subjects/${id}`, {
      method: "DELETE",
    }),

  // 📘 UNITS
  getUnits: (params = {}) => 
    request(`${BASE}/units${buildQuery(params)}`),

  createUnit: (data) =>
    request(`${BASE}/units`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateUnit: (id, data) =>
    request(`${BASE}/units/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteUnit: (id) =>
    request(`${BASE}/units/${id}`, {
      method: "DELETE",
    }),

  // 📖 TOPICS
  getTopics: (params = {}) => 
    request(`${BASE}/topics${buildQuery(params)}`),

  createTopic: (data) =>
    request(`${BASE}/topics`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTopic: (id, data) =>
    request(`${BASE}/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTopic: (id) =>
    request(`${BASE}/topics/${id}`, {
      method: "DELETE",
    }),

  // 🎥 CONTENT (PPT & VIDEO)
  getContent: (params = {}) => 
    request(`${BASE}/content${buildQuery(params)}`),

  createContent: (formData) =>
    request(`${BASE}/content`, {
      method: "POST",
      body: formData, // Browser handles boundary for FormData automatically
    }),

  updateContent: (id, data) =>
    request(`${BASE}/content/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteContent: (id) =>
    request(`${BASE}/content/${id}`, {
      method: "DELETE",
    }),
};