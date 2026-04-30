import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../services/api";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";
// 🔥 School icon-ah inga add panniruken
import { FilterX, BookOpen, GraduationCap, Plus, Trash2, Edit3, School } from "lucide-react";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔄 Default to 'school' or get from URL
  const [type, setType] = useState(searchParams.get("type") || "school");

  // 🏫 School specific
  const [standard, setStandard] = useState("");
  // 🎓 College specific
  const [stream, setStream] = useState("");
  const [semester, setSemester] = useState("");

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ========================
  // 🔥 LOAD SUBJECTS
  // ========================
  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await API.getSubjects({ type });
      const data = res?.success ? res.data : (Array.isArray(res) ? res : []);
      setSubjects(data);
    } catch (err) {
      console.error("❌ Error loading subjects:", err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = searchParams.get("type");
    if (t) {
      setType(t.toLowerCase());
    }
  }, [searchParams]);

  useEffect(() => {
    loadSubjects();
  }, [type]);

  // ========================
  // ➕ ADD SUBJECT
  // ========================
  const handleAdd = async () => {
    setError("");
    if (!name.trim()) return setError("Enter subject name");

    try {
      const body = {
        name: name.trim(),
        type,
      };

      if (type === "school") {
        if (!standard) return setError("Standard is required (e.g., 10)");
        body.standard = standard;
      } else {
        if (!stream || !semester) return setError("Stream and Semester are required");
        body.stream = stream;
        body.semester = Number(semester);
      }

      const res = await API.createSubject(body);
      
      if (res.success || res._id) {
        setName("");
        setStandard("");
        setStream("");
        setSemester("");
        loadSubjects();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subject");
    }
  };

  // ========================
  // ✏️ EDIT LOGIC
  // ========================
  const startEdit = (sub) => {
    setEditId(sub._id);
    setEditData({ ...sub });
  };

  const handleUpdate = async () => {
    try {
      const res = await API.updateSubject(editId, editData);
      if (res.success || res._id) {
        setEditId(null);
        loadSubjects();
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ========================
  // 🗑️ DELETE LOGIC
  // ========================
  const handleDelete = async () => {
    try {
      await API.deleteSubject(deleteId);
      setIsModalOpen(false);
      setDeleteId(null);
      loadSubjects();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-2 md:p-4">
      {/* 🔷 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {/* 🔥 Ippo intha School component work aagum */}
            {type === "school" ? <School className="text-blue-600" /> : <GraduationCap className="text-purple-600" />}
            {type.toUpperCase()} Subjects
          </h1>
          <p className="text-sm text-gray-500">Manage curriculum for your institution</p>
        </div>

        {searchParams.get("type") && (
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchParams({});
              setType("school");
            }}
            className="flex items-center gap-2"
          >
            <FilterX size={16} /> Reset Path
          </Button>
        )}
      </div>

      {/* ➕ ADD SUBJECT FORM */}
      <Card title={`Add ${type.charAt(0).toUpperCase() + type.slice(1)} Subject`} className="mb-8 border-t-4 border-blue-500 shadow-sm">
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
          
          <div className="flex flex-col min-w-[150px]">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Path Type</label>
            <select
              value={type}
              onChange={(e) => {
                const newType = e.target.value;
                setType(newType);
                setSearchParams({ type: newType });
              }}
              className="border px-3 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="school">🏫 School</option>
              <option value="college">🎓 College</option>
            </select>
          </div>

          {type === "school" ? (
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Standard</label>
              <Input
                placeholder="e.g., 10"
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="w-32"
              />
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Stream</label>
                <Input
                  placeholder="e.g., AIML"
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Sem</label>
                <Input
                  placeholder="1"
                  type="number"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-20"
                />
              </div>
            </>
          )}

          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Subject Name</label>
            <Input
              placeholder="e.g., Mathematics"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Button onClick={handleAdd} className="bg-blue-600 text-white px-6 flex items-center gap-2">
            <Plus size={18} /> Add Subject
          </Button>
        </div>

        {error && <p className="text-red-500 mt-3 text-sm font-medium">⚠️ {error}</p>}
      </Card>

      {/* 📊 SUBJECTS LIST TABLE */}
      <Card title="Curriculum List" className="overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading subjects...</div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No subjects found for this category.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">#</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Subject Name</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Details</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub, i) => (
                  <tr key={sub._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-400 font-medium">{i + 1}</td>
                    <td className="p-4 font-semibold text-gray-800">
                      {editId === sub._id ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="py-1"
                        />
                      ) : (
                        <span className="flex items-center gap-2">
                          <BookOpen size={16} className="text-blue-400" />
                          {sub.name}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${sub.type === 'school' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {sub.type === "school" 
                          ? `Std ${sub.standard}` 
                          : `${sub.stream} (Sem ${sub.semester})`}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {editId === sub._id ? (
                          <>
                            <Button onClick={handleUpdate} className="bg-green-600 text-white text-xs py-1">Save</Button>
                            <Button onClick={() => setEditId(null)} variant="outline" className="text-xs py-1">Cancel</Button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEdit(sub)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Subject"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(sub._id);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Subject"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Subject?"
        message="This will remove the subject and may affect linked units/topics."
      />
    </div>
  );
}