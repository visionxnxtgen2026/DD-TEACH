import React, { useEffect, useState } from "react";
import { API } from "../services/api";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { LayoutList, PlusCircle, Trash2, Edit3 } from "lucide-react";

export default function Topics() {
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [topics, setTopics] = useState([]);

  const [type, setType] = useState("school"); // 'school' or 'college'

  // Filter States
  const [standard, setStandard] = useState("");
  const [stream, setStream] = useState("");
  const [semester, setSemester] = useState("");

  // Selection States
  const [subjectId, setSubjectId] = useState("");
  const [unitId, setUnitId] = useState("");

  // Form States
  const [name, setName] = useState("");
  const [topicNumber, setTopicNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

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
    } catch (err) {
      console.error("Error loading subjects:", err);
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
      console.error("Error loading units:", err);
      setUnits([]);
    }
  };

  // ========================
  // 📖 3. LOAD TOPICS
  // ========================
  const loadTopics = async () => {
    try {
      let params = { type };
      if (type === "school") {
        if (!unitId) return setTopics([]);
        params.unit = unitId;
      } else {
        if (!subjectId) return setTopics([]);
        params.subject = subjectId;
        params.stream = stream;
        params.semester = semester;
      }

      const res = await API.getTopics(params);
      const data = res?.success ? res.data : (Array.isArray(res) ? res : []);
      setTopics(data);
    } catch (err) {
      console.error("Error loading topics:", err);
      setTopics([]);
    }
  };

  // 🔄 Watchers
  useEffect(() => { loadSubjects(); }, [type, standard, stream, semester]);
  useEffect(() => { loadUnits(); }, [subjectId, type]);
  useEffect(() => { loadTopics(); }, [unitId, subjectId, type, stream, semester]);

  // ========================
  // ➕ ADD TOPIC (🔥 FIXED LOGIC)
  // ========================
  const handleAdd = async () => {
    setError("");
    if (!name.trim()) return setError("Enter topic name");
    if (!subjectId) return setError("Select a subject");
    
    // Strict Validation
    if (type === "school" && !unitId) return setError("Select a unit");

    try {
      setLoading(true);
      const selectedSubject = subjects.find(s => s._id === subjectId);
      
      // 🔥 Construct Body correctly for Backend
      const body = {
        title: name,
        topicNumber: topicNumber || "1",
        subject: subjectId,
        type: type,
      };

      if (type === "school") {
        body.unit = unitId;
        body.standard = selectedSubject?.standard; // Send the string standard
      } else {
        // 🎓 College flow requirements
        body.stream = stream;
        body.semester = Number(semester);
      }

      await API.createTopic(body);
      
      // Success: Reset and Reload
      setName("");
      setTopicNumber("");
      loadTopics();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add topic");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // ✏️ EDIT & 🗑️ DELETE
  // ========================
  const startEdit = (t) => { setEditId(t._id); setEditName(t.title); };

  const handleUpdate = async () => {
    if (!editName.trim()) return;
    try {
      await API.updateTopic(editId, { title: editName });
      setEditId(null);
      loadTopics();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await API.deleteTopic(id);
        loadTopics();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <LayoutList className="text-blue-600" size={32} />
        <h1 className="text-2xl font-bold">Manage Topics</h1>
      </div>

      {/* STEP 1: FILTERS */}
      <Card title="Step 1: Selection & Filters" className="mb-6 border-t-4 border-blue-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Institution Type</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setSubjectId("");
                setUnitId("");
                setTopics([]);
              }}
              className="border p-2 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="school">🏫 School Path</option>
              <option value="college">🎓 College Path</option>
            </select>
          </div>

          {type === "school" ? (
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Standard</label>
              <Input placeholder="e.g. 10" value={standard} onChange={(e) => setStandard(e.target.value)} />
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Stream</label>
                <Input placeholder="e.g. AIML" value={stream} onChange={(e) => setStream(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Semester</label>
                <Input placeholder="e.g. 1" value={semester} onChange={(e) => setSemester(e.target.value)} />
              </div>
            </>
          )}

          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Select Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="border p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Choose Subject --</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>

          {type === "school" && (
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Select Unit</label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="border p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Choose Unit --</option>
                {units.map((u) => <option key={u._id} value={u._id}>Unit {u.unitNumber}: {u.title}</option>)}
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* STEP 2: FORM */}
      <Card title="Step 2: Add Topic" className="mb-6 border-t-4 border-green-500">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-32">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Number</label>
            <Input placeholder="1.1" value={topicNumber} onChange={(e) => setTopicNumber(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Topic Name</label>
            <Input placeholder="Enter topic title..." value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={handleAdd} className="bg-blue-600 text-white px-8 flex items-center gap-2">
            <PlusCircle size={18} /> {loading ? "Adding..." : "Add"}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2 text-sm font-semibold">⚠️ {error}</p>}
      </Card>

      {/* LIST */}
      <Card title="Topic List">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase w-20">No.</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Topic Title</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.length === 0 ? (
                <tr><td colSpan="3" className="p-10 text-center text-gray-400 italic">Select filters to view topics.</td></tr>
              ) : (
                topics.map((t, i) => (
                  <tr key={t._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-400">{t.topicNumber || i + 1}</td>
                    <td className="p-4 font-semibold text-gray-800">
                      {editId === t._id ? (
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="py-1" />
                      ) : t.title}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {editId === t._id ? (
                          <>
                            <Button onClick={handleUpdate} className="bg-green-600 text-white text-xs py-1">Save</Button>
                            <Button onClick={() => setEditId(null)} variant="outline" className="text-xs py-1">Cancel</Button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={18} /></button>
                            <button onClick={() => handleDelete(t._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}