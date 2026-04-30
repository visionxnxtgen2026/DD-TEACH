import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  BookOpen, 
  Loader2, 
  ChevronRight, 
  Hash, 
  GraduationCap,
  AlertCircle,
  SearchX
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { API } from "../../utils/api";

export default function CollegeSubjects() {
  const { stream, sem } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 1. DATA SYNCHRONIZATION
  useEffect(() => {
    if (!stream || !sem) return;

    const fetchSubjectsData = async () => {
      try {
        setLoading(true);
        setError("");

        // The query builder in api.js formats these parameters into a valid request
        const data = await API.getSubjects({ 
          type: "college", 
          stream: stream, 
          semester: sem 
        });

        setSubjects(data || []);

      } catch (err) {
        console.error("❌ Subject Sync Error:", err);
        setError("Unable to synchronize subject data. Please verify your database connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectsData();
  }, [stream, sem]);

  // 🔥 EVENT HANDLERS
  const handleSubjectClick = (subjectId) => {
    // Navigates directly to the topic catalog (Higher Ed skips the Unit structure)
    navigate(`/college/${stream}/${sem}/${subjectId}`);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* 🔥 ACADEMIC HEADER SECTION */}
      <section className="bg-white border-b border-slate-200 px-6 md:px-20 py-12">
        <div className="max-w-7xl mx-auto">
          
          <button
            onClick={() => navigate(`/college/${stream}`)}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all mb-8"
          >
            <div className="p-2 bg-slate-50 group-hover:bg-blue-50 rounded-xl transition-colors">
              <ArrowLeft size={16} />
            </div>
            Return to Semester Selection
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 text-blue-600 font-black mb-3 uppercase tracking-[0.2em] text-[10px] bg-blue-50 w-fit px-4 py-1 rounded-full border border-blue-100">
                <GraduationCap size={14} /> {stream} Engineering Path
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                Semester <span className="text-blue-600">{sem}</span> Curriculum
              </h1>
              <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed">
                Explore your core modules and specialized subjects for this academic term. Select a course to begin your learning journey.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 px-8 py-5 rounded-[2rem] shadow-2xl shadow-blue-900/10 flex items-center gap-5"
            >
               <div className="w-12 h-12 bg-blue-600 text-white rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
                  {subjects.length}
               </div>
               <div>
                  <span className="block text-blue-400 font-black text-[10px] uppercase tracking-widest">Enrollment Status</span>
                  <span className="text-white font-bold text-sm">Active Core Subjects</span>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 📚 DYNAMIC SUBJECT CATALOG */}
      <main className="px-6 md:px-20 py-16 flex-1">
        <div className="max-w-5xl mx-auto">

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 text-blue-600"
              >
                <Loader2 className="animate-spin mb-4" size={56} strokeWidth={2.5} />
                <p className="font-bold tracking-widest text-[10px] uppercase opacity-60">Synchronizing Curriculum Catalogue...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                className="text-center py-20 bg-white rounded-[3rem] border border-red-100 shadow-xl max-w-lg mx-auto"
              >
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <AlertCircle size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Sync Error</h3>
                <p className="text-slate-500 font-medium mb-8 px-10 leading-relaxed">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                >
                  Retry Connection
                </button>
              </motion.div>
            ) : subjects.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-5"
              >
                {subjects.map((sub) => (
                  <div
                    key={sub._id}
                    onClick={() => handleSubjectClick(sub._id)}
                    className="group flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-900/5 cursor-pointer transition-all duration-500"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-inner">
                        <BookOpen size={28} />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-700 transition-colors tracking-tight">
                          {sub.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Hash size={12} className="text-slate-300" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                            {sub.code || "REG-ACAD-MODULE"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="hidden md:block text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-blue-500 transition-all">
                        Access Resources
                      </span>
                      <div className="p-3 bg-slate-50 text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-100">
                        <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-white rounded-[4rem] border border-slate-200 border-dashed"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <SearchX size={48} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">Catalogue Pending</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                  No core subjects have been registered for Semester {sem} yet. Please contact the administrator to update the academic directory.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>
  );
}