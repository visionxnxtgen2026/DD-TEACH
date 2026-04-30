/**
 * api.js - Centralized API Service
 */

// 🌐 BASE URL: Use environment variable from Vite with a local fallback
// We append /api here so we don't have to repeat it in every method.
const API_URL = import.meta.env.VITE_API_URL || "${import.meta.env.VITE_API_URL}";
const BASE_URL = `${API_URL}/api`;

/**
 * 🔧 QUERY BUILDER (SAFE)
 * Filters out empty strings, null, or undefined to keep URLs clean.
 * Example: { type: 'college', stream: 'AIML' } -> "?type=college&stream=AIML"
 */
const buildQuery = (params = {}) => {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined
    )
  );
  const query = new URLSearchParams(filtered).toString();
  return query ? `?${query}` : "";
};

/**
 * 🔥 COMMON FETCH WRAPPER
 * Handles JSON parsing, FormData detection, Auth headers, and Error handling.
 */
async function request(url, options = {}) {
  try {
    const isFormData = options.body instanceof FormData;
    const token = localStorage.getItem("adminToken");

    const res = await fetch(url, {
      ...options,
      headers: {
        // Automatically set JSON header unless sending FormData (browser needs to set boundary)
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    // Handle potential empty responses (like 204 No Content) or non-JSON errors
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = { message: await res.text() };
    }

    if (!res.ok) {
      // Auto-logout on 401 Unauthorized
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        // window.location.href = "/login"; 
      }
      throw new Error(data.message || `API Error: ${res.status}`);
    }

    // Backend normalization: returns data if success:true, else returns the full object
    return data?.success ? data.data : data;

  } catch (error) {
    console.error("❌ API ERROR:", error.message);
    throw error;
  }
}

/**
 * 🚀 API METHODS
 */
export const API = {
  // 🔐 AUTHENTICATION
  login: (body) =>
    request(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getProfile: () => request(`${BASE_URL}/auth/me`),

  // 📊 DASHBOARD
  getDashboardStats: () => request(`${BASE_URL}/dashboard/stats`),

  // 📚 SUBJECTS
  getSubjects: (params = {}) =>
    request(`${BASE_URL}/subjects${buildQuery(params)}`),

  getSubjectById: (id) => request(`${BASE_URL}/subjects/${id}`),

  createSubject: (body) =>
    request(`${BASE_URL}/subjects`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSubject: (id, body) =>
    request(`${BASE_URL}/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteSubject: (id) =>
    request(`${BASE_URL}/subjects/${id}`, { method: "DELETE" }),

  // 📘 UNITS
  getUnits: (params = {}) =>
    request(`${BASE_URL}/units${buildQuery(params)}`),

  getUnitById: (id) => request(`${BASE_URL}/units/${id}`),

  createUnit: (body) =>
    request(`${BASE_URL}/units`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateUnit: (id, body) =>
    request(`${BASE_URL}/units/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteUnit: (id) =>
    request(`${BASE_URL}/units/${id}`, { method: "DELETE" }),

  // 📖 TOPICS
  getTopics: (params = {}) =>
    request(`${BASE_URL}/topics${buildQuery(params)}`),

  getTopicById: (id) => request(`${BASE_URL}/topics/${id}`),

  createTopic: (body) =>
    request(`${BASE_URL}/topics`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateTopic: (id, body) =>
    request(`${BASE_URL}/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteTopic: (id) =>
    request(`${BASE_URL}/topics/${id}`, { method: "DELETE" }),

  // 🎥 CONTENT
  getContent: (params = {}) =>
    request(`${BASE_URL}/content${buildQuery(params)}`),

  createContent: (formData) =>
    request(`${BASE_URL}/content`, {
      method: "POST",
      body: formData, // FormData handles its own boundary
    }),

  updateContent: (id, body) =>
    request(`${BASE_URL}/content/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteContent: (id) =>
    request(`${BASE_URL}/content/${id}`, { method: "DELETE" }),
};