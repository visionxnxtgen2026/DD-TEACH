import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Download, 
  ArrowLeft, 
  BookOpen, 
  Loader2, 
  Info, 
  ChevronRight, 
  FileText,
  ClipboardList
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SubjectSidebar from "../features/topics/SubjectSidebar";
import SyllabusList from "../features/syllabus/SyllabusList";
import { API } from "../utils/api";

export default function Syllabus() {
  const { standard, subject } = useParams();
  const navigate = useNavigate();

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjectName, setSubjectName] = useState("");

  // 🔥 1. PATH PROTECTION & DATA SYNCHRONIZATION
  useEffect(() => {
    const pathType = localStorage.getItem("pathType") || "school";

    // Standard redirect for higher education paths
    if (pathType === "college") {
      navigate(`/topics/${subject}`);
      return;
    }

    if (!subject) return;

    const fetchSyllabusData = async () => {
      try {
        setLoading(true);
        setError("");

        // Concurrent fetching for optimized performance
        const [subjectRes, unitsRes] = await Promise.all([
          API.getSubjectById(subject),
          API.getUnits({ subject: subject })
        ]);

        if (subjectRes) setSubjectName(subjectRes.name);

        if (Array.isArray(unitsRes)) {
          // Precise alphanumeric sorting for academic units
          const sorted = unitsRes.sort((a, b) => {
            return parseInt(a.unitNumber) - parseInt(b.unitNumber);
          });
          setUnits(sorted);
        }

      } catch (err) {
        console.error("❌ Data Sync Error:", err);
        setError("Unable to synchronize the syllabus. Please verify your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabusData();
  }, [subject, navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      <Navbar />

      {/* 🔷 BREADCRUMB NAVIGATION */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-all text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Curriculum
          </button>
          
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Grade {standard}</span>
            <ChevronRight size={12} className="text-slate-200" />
            <span className="text-blue-600 font-black">Course Syllabus</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative max-w-7xl mx-auto w-full">

        {/* 📘 NAVIGATION SIDEBAR (Sticky) */}
        <aside className="hidden lg:block w-80 h-[calc(100vh-120px)] sticky top-24 border-r border-slate-100 pr-8 mt-12">
           <SubjectSidebar standard={standard} subjectId={subject} />
        </aside>

        {/* 🚀 MAIN ACADEMIC CONTENT */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          
          {/* COURSE HEADER CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.15em] rounded-full border border-blue-100 mb-4">
                <FileText size={12} /> Unit Aligned Curriculum
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                {subjectName || "Academic Syllabus"}
              </h1>
              <p className="text-slate-500 mt-4 text-lg font-medium">
                Comprehensive study path for Grade {standard} containing <strong>{units.length} Modules</strong>.
              </p>
            </div>

            <button className="flex items-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap">
              <Download size={20} />
              Download PDF
            </button>
          </motion.div>

          {/* DYNAMIC SYLLABUS LISTING */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-blue-600">
                <Loader2 className="animate-spin mb-4" size={56} strokeWidth={2.5} />
                <p className="font-bold tracking-widest text-[10px] uppercase opacity-60">Building Study Map...</p>
              </div>
            ) : error ? (
              <div className="bg-white border border-red-100 p-12 rounded-[3rem] shadow-xl text-center max-w-lg mx-auto">
                <p className="text-red-600 font-bold mb-4">⚠️ {error}</p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold">Retry Sync</button>
              </div>
            ) : units.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl font-black text-slate-900">Module Overview</h2>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <SyllabusList syllabus={units} standard={standard} subjectId={subject} />
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed">
                <ClipboardList size={56} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-2xl font-black text-slate-800">No Modules Published</h3>
                <p className="text-slate-400 mt-2 font-medium">The curriculum for this subject is currently being populated by the board.</p>
              </div>
            )}
          </div>

          {/* INFORMATION MODULE */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="mt-20 flex flex-col md:flex-row items-start gap-6 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl relative z-10">
              <Info size={28} />
            </div>
            <div className="relative z-10">
              <h4 className="text-white text-xl font-bold mb-2">How to navigate your studies:</h4>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                Each module is structured to provide a logical learning flow. Select a unit to access 
                its specific learning objectives, high-quality PowerPoint presentations, and expert-led 
                video explanations.
              </p>
            </div>
          </motion.div>

        </main>
      </div>

      <Footer />
    </div>
  );
}