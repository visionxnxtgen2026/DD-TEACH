import React, { useEffect, useState } from "react";
import { API } from "../services/api";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { 
  Layers, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  School, 
  GraduationCap, 
  Info 
} from "lucide-react";

export default function Units() {
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);

  // 🔄 Path Selection
  const [type, setType] = useState("school"); // 'school' or 'college'

  // Filters (School Path)
  const [standard, setStandard] = useState("");
  const [subjectId, setSubjectId] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit State
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // ========================
  // 📚 1. LOAD SUBJECTS (School Path Only)
  // ========================
  const loadSubjects = async () => {
    if (type !== "school" || !standard) {
      setSubjects([]);
      return;
    }
    try {
      const res = await API.getSubjects({
        type: "school",
        standard,
      });
      // Handle standardized response { success: true, data: [...] }
      const data = res?.success ? res.data : (Array.isArray(res) ? res : []);
      setSubjects(data);
      if (data.length > 0) setSubjectId(data[0]._id);
    } catch (err) {
      console.error("Subject Load Error:", err);
      setSubjects([]);
    }
  };

  // ========================
  // 📘 2. LOAD UNITS
  // ========================
  const loadUnits = async () => {
    if (type !== "school" || !subjectId) {
      setUnits([]);
      return;
    }
    try {
      setLoading(true);
      const res = await API.getUnits({ subject: subjectId });
      const data = res?.success ? res.data : (Array.isArray(res) ? res : []);
      setUnits(data);
    } catch (err) {
      console.error("Units Load Error:", err);
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Watchers
  useEffect(() => { loadSubjects(); }, [standard, type]);
  useEffect(() => { loadUnits(); }, [subjectId, type]);

  // ========================
  // ➕ 3. ADD UNIT
  // ========================
  const handleAdd = async () => {
    setError("");
    if (type !== "school") return;

    if (!standard) return setError("Please enter a standard (e.g., 10)");
    if (!subjectId) return setError("Please select a subject");
    if (!name.trim()) return setError("Please enter a unit title");
    if (!unitNumber) return setError("Please enter a unit number");

    try {
      setLoading(true);
      await API.createUnit({
        title: name,
        subject: subjectId,
        standard: standard,
        unitNumber: unitNumber,
      });

      setName("");
      setUnitNumber("");
      loadUnits();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add unit");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // ✏️ EDIT & 🗑️ DELETE
  // ========================
  const startEdit = (u) => {
    setEditId(u._id);
    setEditName(u.title);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) return;
    try {
      await API.updateUnit(editId, { title: editName });
      setEditId(null);
      loadUnits();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      await API.deleteUnit(id);
      loadUnits();
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* 🔷 HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <Layers className="text-blue-600" size={32} />
        <h1 className="text-2xl font-bold">Units Management</h1>
      </div>

      {/* 🏛️ PATH SELECTOR */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setType("school")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            type === "school" 
            ? "bg-blue-600 text-white shadow-lg" 
            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <School size={20} /> School
        </button>
        <button
          onClick={() => setType("college")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            type === "college" 
            ? "bg-purple-600 text-white shadow-lg" 
            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <GraduationCap size={20} /> College
        </button>
      </div>

      {type === "school" ? (
        <>
          {/* ➕ ADD UNIT FORM */}
          <Card title="Step 1: Create New Unit" className="mb-8 border-t-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Standard</label>
                <Input
                  placeholder="e.g. 10"
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                />
              </div>

              <div className="flex flex-col col-span-1 md:col-span-1">
                <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="border px-3 py-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Choose --</option>
                  {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col w-24">
                <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Unit No.</label>
                <Input
                  placeholder="1"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                />
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Unit Title</label>
                <Input
                  placeholder="e.g. Laws of Motion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <Button onClick={handleAdd} className="bg-blue-600 text-white flex items-center justify-center gap-2 px-6">
                <PlusCircle size={18} /> {loading ? "Adding..." : "Add Unit"}
              </Button>
            </div>
            {error && <p className="text-red-500 mt-2 text-sm font-semibold">⚠️ {error}</p>}
          </Card>

          {/* 📊 UNITS LIST */}
          <Card title="Step 2: Units List">
            {units.length === 0 ? (
              <div className="text-center py-10 text-gray-400 italic">
                {subjectId ? "No units created for this subject yet." : "Please select a standard and subject to view units."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase w-16 text-center">No.</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase">Unit Title</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center w-40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((u, i) => (
                      <tr key={u._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-center font-bold text-gray-500 bg-gray-50/50">
                          {u.unitNumber}
                        </td>
                        <td className="p-4 font-semibold text-gray-800">
                          {editId === u._id ? (
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="py-1"
                            />
                          ) : (
                            u.title
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            {editId === u._id ? (
                              <>
                                <Button onClick={handleUpdate} className="bg-green-600 text-white text-xs py-1">Save</Button>
                                <Button onClick={() => setEditId(null)} variant="outline" className="text-xs py-1">Cancel</Button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => startEdit(u)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="Edit"
                                >
                                  <Edit3 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(u._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Delete"
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
        </>
      ) : (
        /* 🎓 COLLEGE PATH NOTICE */
        <div className="flex flex-col items-center justify-center p-20 bg-purple-50 rounded-3xl border-2 border-dashed border-purple-200">
          <div className="bg-white p-6 rounded-full shadow-md mb-6">
            <Info size={48} className="text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900 mb-2">Units are not required for College Path</h2>
          <p className="text-purple-600 text-center max-w-md">
            Unga setup-padi College curriculum-la **Subject-ku aprame neradiya Topics** varum. 
            Adhunala neenga inga data create panna thevai illa.
          </p>
          <Button 
            className="mt-8 bg-purple-600 text-white px-8" 
            onClick={() => window.location.href = "/topics"}
          >
            Go to Topics Management
          </Button>
        </div>
      )}
    </div>
  );
}