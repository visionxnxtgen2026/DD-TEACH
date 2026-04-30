const BASE = "http://localhost:5000/api";

/**
 * ========================
 * 🔧 QUERY BUILDER (SAFE)
 * ========================
 * Converts { type: "college", stream: "AIML" } -> "?type=college&stream=AIML"
 */
const buildQuery = (params = {}) => {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
  );

  const query = new URLSearchParams(filtered).toString();
  return query ? `?${query}` : "";
};

/**
 * ========================
 * 🔥 COMMON REQUEST HANDLER
 * ========================
 */
const request = async (url, options = {}) => {
  try {
    const isFormData = options.body instanceof FormData;
    const token = localStorage.getItem("adminToken");

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        // Optional: window.location.href = "/login";
      }
      throw new Error(data.message || "API Error");
    }

    /**
     * 💡 Response Normalization
     * Backend follows { success: true, data: [...] }
     * We return the whole object so components can check for 'success' flag
     */
    return data;

  } catch (err) {
    console.error("❌ API Error:", err.message);
    throw err;
  }
};

/**
 * ========================
 * 🚀 API METHODS
 * ========================
 */
export const API = {
  // ========================
  // 🔐 AUTHENTICATION
  // ========================
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

  // ========================
  // 📊 DASHBOARD
  // ========================
  getDashboardStats: () =>
    request(`${BASE}/dashboard/stats`),

  // ========================
  // 📚 SUBJECTS
  // ========================
  // Usage: API.getSubjects({ type: 'college', stream: 'AIML' })
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

  // ========================
  // 📘 UNITS (Only for School Path)
  // ========================
  // Usage: API.getUnits({ subject: subjectId })
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

  // ========================
  // 📖 TOPICS
  // ========================
  // Usage: API.getTopics({ unit: unitId }) OR API.getTopics({ subject: subjectId })
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

  // ========================
  // 🎥 CONTENT (PPT & VIDEO)
  // ========================
  // Usage: API.getContent({ topic: topicId })
  getContent: (params = {}) =>
    request(`${BASE}/content${buildQuery(params)}`),

  createContent: (formData) =>
    request(`${BASE}/content`, {
      method: "POST",
      body: formData, // FormData handles its own boundary
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