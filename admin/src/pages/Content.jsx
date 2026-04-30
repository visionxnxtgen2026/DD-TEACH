import React, { useEffect, useState, useRef } from "react";
import { API } from "../services/api";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Content() {
  const [type, setType] = useState("school"); // 'school' or 'college'

  // 🔥 DATA STATES
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [topics, setTopics] = useState([]);
  const [contents, setContents] = useState([]);

  // 🏫 SCHOOL FILTERS
  const [standard, setStandard] = useState("");

  // 🎓 COLLEGE FILTERS
  const [stream, setStream] = useState("");
  const [semester, setSemester] = useState("");

  // 🔗 SELECTIONS (Stored as _id)
  const [subjectId, setSubjectId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [topicId, setTopicId] = useState("");

  // 📝 FORM STATES
  const [pptFile, setPptFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editYoutube, setEditYoutube] = useState("");

  const fileRef = useRef();

  // ========================
  // 📚 1. LOAD SUBJECTS
  // ========================
  const loadSubjects = async () => {
    try {
      let params = { type };
      if (type === "school") {
        if (!standard) return setSubjects([]);
        params.standard = standard;
      } else {
        if (!stream) return setSubjects([]);
        params.stream = stream;
        if (semester) params.semester = semester;
      }

      const res = await API.getSubjects(params);
      const data = res?.success ? res.data : (Array.isArray(res) ? res : []);
      setSubjects(data);
      setSubjectId(""); // Reset selection
    } catch (err) {
      console.error("Subjects Load Error:", err);
      setSubjects([]);
    }
  };

  // ========================
  // 📘 2. LOAD UNITS (SCHOOL ONLY)
  // ========================
  const loadUnits = async () => {
    if (type !== "school" || !subjectId) {
      setUnits([]);
      setUnitId("");
      return;
    }
    try {
      const res = await API.getUnits({ subject: subjectId });
      const data = res?.success ? res.data : (Array.isArray(res) ? res : []);
      setUnits(data);
    } catch (err) {
      console.error("Units Load Error:", err);
      setUnits([]);
    }
  };

  // ========================
  // 📖 3. LOAD TOPICS
  // ========================
  const loadTopics = async () => {
    try {
      let params = {};
      if (type === "school") {
        // School Flow: Subject -> Unit -> Topic
        if (!unitId) return setTopics([]);
        params.unit = unitId;
      } else {
        // College Flow: Subject -> Topic (Direct)
        if (!subjectId) return setTopics([]);
        params.subject = subjectId;
      }

      const res = await API.getTopics(params);
      const data = res?.success ? res.data : (Array.isArray(res) ? res : []);
      setTopics(data);
    } catch (err) {
      console.error("Topics Load Error:", err);
      setTopics([]);
    }
  };

  // ========================
  // 🎥 4. LOAD CONTENT
  // ========================
  const loadContent = async () => {
    if (!topicId) {
      setContents([]);
      return;
    }
    try {
      const res = await API.getContent({ topic: topicId });
      // Content logic: 1 Topic has 1 Content (usually an object, so we wrap in array)
      const data = res?.success ? res.data : res;
      setContents(data ? [data] : []);
    } catch (err) {
      console.error("Content Load Error:", err);
      setContents([]);
    }
  };

  // 🔄 WATCHERS
  useEffect(() => { loadSubjects(); }, [type, standard, stream, semester]);
  useEffect(() => { loadUnits(); }, [subjectId, type]);
  useEffect(() => { loadTopics(); }, [unitId, subjectId, type]);
  useEffect(() => { loadContent(); }, [topicId]);

  // ========================
  // ➕ ADD CONTENT
  // ========================
  const handleAdd = async () => {
    setError("");
    if (!topicId) return setError("Please select a Topic first");
    if (!pptFile && !youtubeUrl) return setError("Upload a PPT or provide a YouTube link");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("topic", topicId);
      formData.append("youtubeUrl", youtubeUrl);
      if (pptFile) formData.append("ppt", pptFile);

      await API.createContent(formData);

      // Reset
      setPptFile(null);
      setYoutubeUrl("");
      if (fileRef.current) fileRef.current.value = "";
      loadContent();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // ✏️ UPDATE / 🗑️ DELETE
  // ========================
  const startEdit = (c) => {
    setEditId(c._id);
    setEditYoutube(c.youtubeUrl);
  };

  const handleUpdate = async () => {
    try {
      await API.updateContent(editId, { youtubeUrl: editYoutube });
      setEditId(null);
      loadContent();
    } catch (err) { setError("Update failed"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      await API.deleteContent(id);
      loadContent();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>

      <Card title="Step 1: Select Hierarchy" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Path Toggle */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Path Type</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setSubjectId("");
                setUnitId("");
                setTopicId("");
              }}
              className="border p-2 rounded bg-white"
            >
              <option value="school">🏫 School Path</option>
              <option value="college">🎓 College Path</option>
            </select>
          </div>

          {/* Type Specific Inputs */}
          {type === "school" ? (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Standard</label>
              <Input placeholder="e.g. 10" value={standard} onChange={(e) => setStandard(e.target.value)} />
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Stream</label>
                <Input placeholder="e.g. AIML" value={stream} onChange={(e) => setStream(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Semester</label>
                <Input placeholder="e.g. 1" value={semester} onChange={(e) => setSemester(e.target.value)} />
              </div>
            </>
          )}

          {/* Subject Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="border p-2 rounded bg-white"
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>

          {/* Unit Dropdown (SCHOOL ONLY) */}
          {type === "school" && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Unit</label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="border p-2 rounded bg-white"
              >
                <option value="">-- Select Unit --</option>
                {units.map((u) => <option key={u._id} value={u._id}>Unit {u.unitNumber}: {u.title}</option>)}
              </select>
            </div>
          )}

          {/* Topic Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Topic</label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="border p-2 rounded bg-white"
            >
              <option value="">-- Select Topic --</option>
              {topics.map((t) => <option key={t._id} value={t._id}>{t.topicNumber ? `${t.topicNumber}. ` : ""}{t.title}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <Card title="Step 2: Add Files/Links" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Upload PPTX</label>
            <input
              type="file"
              ref={fileRef}
              accept=".ppt,.pptx"
              onChange={(e) => setPptFile(e.target.files[0])}
              className="border p-2 rounded w-full bg-white"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">YouTube Link</label>
            <Input
              placeholder="https://youtube.com/..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleAdd} className="bg-blue-600 text-white px-8">
            {loading ? "Processing..." : "Add Content"}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </Card>

      {/* CONTENT LIST */}
      <Card title="Current Topic Content">
        {contents.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No content added for this topic yet.</p>
        ) : (
          <div className="space-y-4">
            {contents.map((c) => (
              <div key={c._id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <p className="font-semibold text-blue-600">
                    📄 PPT: {c.pptUrl ? (
                      <a href={`http://${import.meta.env.VITE_API_URL}${c.pptUrl}`} target="_blank" rel="noreferrer" className="underline ml-2">
                        View/Download PPT
                      </a>
                    ) : "Not available"}
                  </p>
                  <div className="text-sm">
                    🎥 YouTube: {editId === c._id ? (
                      <Input value={editYoutube} onChange={(e) => setEditYoutube(e.target.value)} />
                    ) : (
                      <span className="text-gray-600">{c.youtubeUrl || "No link added"}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  {editId === c._id ? (
                    <>
                      <Button onClick={handleUpdate} className="bg-green-600 text-white">Save</Button>
                      <Button onClick={() => setEditId(null)} className="bg-gray-400 text-white">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => startEdit(c)} className="bg-blue-100 text-blue-700">Edit</Button>
                      <Button onClick={() => handleDelete(c._id)} className="bg-red-100 text-red-700">Delete</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}