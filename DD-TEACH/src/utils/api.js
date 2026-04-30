// 🌐 BASE URL - Environment variable check with fallback
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * 🔧 QUERY BUILDER (SAFE)
 * Filter panni empty values illadha query string build pannum.
 * Example: { type: 'college', stream: 'AIML' } -> "?type=college&stream=AIML"
 */
const buildQuery = (params = {}) => {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
  );
  const query = new URLSearchParams(filtered).toString();
  return query ? `?${query}` : "";
};

/**
 * 🔥 COMMON FETCH WRAPPER
 */
async function request(url, options = {}) {
  try {
    const isFormData = options.body instanceof FormData;
    const token = localStorage.getItem("adminToken"); // If auth is needed

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      // credentials: "include", // Enable if using cookies
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    // Backend { success: true, data: [...] } nu anupuna, direct data-va return pannum
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
  // ========================
  // 🔐 AUTH (Optional/Future)
  // ========================
  login: (body) => request(`${API_BASE}/auth/login`, { method: "POST", body: JSON.stringify(body) }),

  // ========================
  // 📊 DASHBOARD STATS
  // ========================
  getDashboardStats: () => request(`${API_BASE}/dashboard/stats`),

  // ========================
  // 📚 SUBJECTS (School & College)
  // ========================
  // Usage: API.getSubjects({ type: 'school', standard: '10' }) 
  // OR API.getSubjects({ type: 'college', stream: 'AIML', semester: 1 })
  getSubjects: (params = {}) => 
    request(`${API_BASE}/subjects${buildQuery(params)}`),

  getSubjectById: (id) => request(`${API_BASE}/subjects/${id}`),

  createSubject: (body) =>
    request(`${API_BASE}/subjects`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSubject: (id, body) =>
    request(`${API_BASE}/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteSubject: (id) =>
    request(`${API_BASE}/subjects/${id}`, { method: "DELETE" }),

  // ========================
  // 📘 UNITS (SCHOOL PATH ONLY)
  // ========================
  // Usage: API.getUnits({ subject: subjectId })
  getUnits: (params = {}) => 
    request(`${API_BASE}/units${buildQuery(params)}`),

  getUnitById: (id) => request(`${API_BASE}/units/${id}`),

  createUnit: (body) =>
    request(`${API_BASE}/units`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // ========================
  // 📖 TOPICS
  // ========================
  // Usage: API.getTopics({ unit: unitId }) -> School
  // OR API.getTopics({ subject: subjectId }) -> College
  getTopics: (params = {}) => 
    request(`${API_BASE}/topics${buildQuery(params)}`),

  getTopicById: (id) => request(`${API_BASE}/topics/${id}`),

  createTopic: (body) =>
    request(`${API_BASE}/topics`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // ========================
  // 🎥 CONTENT
  // ========================
  // Usage: API.getContent({ topic: topicId })
  getContent: (params = {}) => 
    request(`${API_BASE}/content${buildQuery(params)}`),

  createContent: (formData) =>
    request(`${API_BASE}/content`, {
      method: "POST",
      body: formData, // Auto headers for FormData
    }),
};