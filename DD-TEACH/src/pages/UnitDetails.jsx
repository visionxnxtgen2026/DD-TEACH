import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  PlayCircle,
  Bookmark,
  Download,
  ChevronRight,
  Loader2,
  BookOpen,
  BookCheck,
  Info,
  CheckCircle2
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SubjectSidebar from "../features/topics/SubjectSidebar";

import { addBookmark } from "../utils/bookmark";
import { API } from "../utils/api";

export default function UnitDetails() {
  const { standard, subject, unitId } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [unitInfo, setUnitInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 1. PATH PROTECTION & DATA SYNCHRONIZATION
  useEffect(() => {
    const pathType = localStorage.getItem("pathType") || "school";

    // Security Guard: Units are restricted to the K-12 track
    if (pathType === "college") {
      navigate("/");
      return;
    }

    if (!unitId) return;

    const fetchUnitData = async () => {
      try {
        setLoading(true);
        setError("");

        // Concurrent fetching for optimized module loading
        const [unitRes, topicsRes] = await Promise.all([
          API.getUnitById(unitId),
          API.getTopics({ unit: unitId })
        ]);

        if (unitRes) setUnitInfo(unitRes);
        
        if (Array.isArray(topicsRes)) {
          // Precise numeric sorting for the academic sequence
          const sortedTopics = topicsRes.sort((a, b) => 
            (a.topicNumber || "").localeCompare(b.topicNumber || "", undefined, { numeric: true })
          );
          setTopics(sortedTopics);
        }

      } catch (err) {
        console.error("❌ Resource Fetch Error:", err);
        setError("Unable to synchronize unit data. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchUnitData();
  }, [unitId, navigate]);

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
            Back to Syllabus
          </button>
          
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Grade {standard}</span>
            <ChevronRight size={12} className="text-slate-200" />
            <span className="text-blue-600 font-black">Unit Explorer</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative max-w-7xl mx-auto w-full">
        
        {/* 📘 ACADEMIC SIDEBAR (Sticky Workspace) */}
        <aside className="hidden lg:block w-80 h-[calc(100vh-120px)] sticky top-24 border-r border-slate-100 pr-8 mt-12">
          <SubjectSidebar standard={standard} subjectId={subject} />
        </aside>

        {/* 🚀 MAIN LEARNING INTERFACE */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">

            {/* 🔷 UNIT HEADER CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.15em] rounded-full border border-blue-100 mb-4">
                  <BookCheck size={12} /> Detailed Academic Module
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                  {unitInfo ? `Unit ${unitInfo.unitNumber}: ${unitInfo.title}` : "Loading Curriculum..."}
                </h1>
                <p className="text-slate-500 mt-4 text-lg font-medium flex items-center gap-2">
                  <span className="text-blue-600 font-black">{topics.length}</span> Topics documented for this session.
                </p>
              </div>

              <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap">
                <Download size={20} />
                Download Unit
              </button>
            </motion.div>

            {/* 🔄 LOADING / ERROR HANDLING */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center justify-center py-32 text-blue-600"
                >
                  <Loader2 className="animate-spin mb-4" size={56} strokeWidth={2.5} />
                  <p className="font-bold tracking-widest text-[10px] uppercase opacity-60">Synchronizing Academic Assets...</p>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  className="bg-white border border-red-100 p-12 rounded-[3rem] shadow-xl text-center"
                >
                  <p className="text-red-600 font-bold mb-4">⚠️ {error}</p>
                  <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold">Retry Sync</button>
                </motion.div>
              ) : (
                /* 📚 LEARNING PATH (TOPICS) */
                <motion.div 
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Topic Sequence</h2>
                    <div className="h-px flex-1 bg-slate-100"></div>
                  </div>

                  {topics.length > 0 ? (
                    topics.map((topic, index) => (
                      <motion.div
                        key={topic._id}
                        whileHover={{ x: 8 }}
                        className="group bg-white rounded-[1.5rem] border border-slate-100 p-3 pr-6 flex items-center justify-between hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300"
                      >
                        {/* LEFT: Sequence & Metadata */}
                        <div 
                          onClick={() => navigate(`/topic-view/${topic._id}`)}
                          className="flex items-center gap-6 cursor-pointer flex-1 py-3 pl-3"
                        >
                          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 font-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                            {topic.topicNumber || index + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                              {topic.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                               <CheckCircle2 size={12} className="text-green-500" />
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Available Resource</span>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Multimedia Actions */}
                        <div className="flex items-center gap-4">
                          {/* PPT RESOURCE */}
                          {topic.pptUrl && (
                            <a
                              href={topic.pptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              title="Download Presentation"
                            >
                              <FileText size={18} />
                            </a>
                          )}

                          {/* VIDEO RESOURCE */}
                          {topic.youtubeUrl && (
                            <a
                              href={topic.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Watch Lecture"
                            >
                              <PlayCircle size={18} />
                            </a>
                          )}

                          {/* BOOKMARK SYSTEM */}
                          <button
                            onClick={() => {
                              addBookmark({
                                id: topic._id,
                                title: topic.title,
                                unit: unitInfo?.title,
                                subjectId: subject,
                                standard,
                              });
                              alert("Resource successfully bookmarked.");
                            }}
                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-amber-50 hover:text-amber-500 transition-all"
                          >
                            <Bookmark size={18} />
                          </button>
                          
                          <ChevronRight className="text-slate-200 group-hover:text-blue-400 transition-all" size={20} />
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed">
                      <BookOpen size={48} className="mx-auto text-slate-200 mb-6" />
                      <h3 className="text-xl font-bold text-slate-400 italic">No topics have been published for this module yet.</h3>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ℹ️ ACADEMIC USAGE GUIDE */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="mt-20 flex flex-col md:flex-row items-start gap-6 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl relative z-10">
                <Info size={28} />
              </div>
              <div className="relative z-10">
                <h4 className="text-white text-xl font-bold mb-2">Academic Instructions:</h4>
                <p className="text-slate-400 text-base leading-relaxed font-medium">
                  Utilize the multimedia icons to access specific learning materials. The presentation icon 
                  triggers the download of study notes, while the playback icon redirects to the expert video 
                  lecture. Bookmarked resources are accessible via the "My Saves" portal for future revision.
                </p>
              </div>
            </motion.div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}