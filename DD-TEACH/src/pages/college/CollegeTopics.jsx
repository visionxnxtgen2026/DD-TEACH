import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  List, 
  Loader2, 
  ChevronRight, 
  BookOpenCheck, 
  Bookmark,
  Info,
  Layers,
  SearchX
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { API } from "../../utils/api";

export default function CollegeTopics() {
  // Path params: stream = "AIML", sem = "2", subject = "SubjectID"
  const { stream, sem, subject } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 1. SYNCHRONIZE DATA (SUBJECT METADATA + TOPIC CATALOGUE)
  useEffect(() => {
    if (!subject) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError("");

        // Parallel fetch for Subject details and associated Topics
        const [subjectRes, topicsRes] = await Promise.all([
          API.getSubjectById(subject),
          API.getTopics({ subject: subject }) 
        ]);

        if (subjectRes) setSubjectName(subjectRes.name);
        
        if (Array.isArray(topicsRes)) {
          // Sort topics numerically based on the topicNumber field
          const sorted = topicsRes.sort((a, b) => 
            (a.topicNumber || "").localeCompare(b.topicNumber || "", undefined, { numeric: true })
          );
          setTopics(sorted);
        }

      } catch (err) {
        console.error("❌ Topic Synchronization Error:", err);
        setError("Unable to retrieve curriculum topics. Please verify your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [subject]);

  // 🔥 EVENT HANDLERS
  const handleTopicSelection = (topicId) => {
    navigate(`/college/${stream}/${sem}/${subject}/${topicId}`);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans text-slate-900">
      <Navbar />

      {/* 🔥 ACADEMIC HEADER SECTION */}
      <section className="bg-white border-b border-slate-200 px-6 md:px-20 py-12">
        <div className="max-w-7xl mx-auto">
          
          <button
            onClick={() => navigate(`/college/${stream}/${sem}`)}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all mb-8"
          >
            <div className="p-2 bg-slate-50 group-hover:bg-blue-50 rounded-xl transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Subject List
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 text-blue-600 font-black mb-4 uppercase tracking-[0.2em] text-[10px] bg-blue-50 w-fit px-4 py-1.5 rounded-full border border-blue-100">
                <Layers size={14} /> Curriculum Catalogue
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                {subjectName || "Subject Details"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {stream}
                </span>
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Semester {sem}
                </span>
                <span className="text-slate-400 text-sm font-bold ml-2">
                  {topics.length} Published Modules
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:block"
            >
               <div className="bg-indigo-50/50 border border-indigo-100 px-8 py-6 rounded-[2.5rem] flex items-center gap-5 shadow-sm">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                     <List size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Learning Track</p>
                    <p className="text-lg font-black text-slate-800 tracking-tight">Module Inventory</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 📚 TOPIC CATALOGUE INTERFACE */}
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
                <p className="font-bold tracking-widest text-[10px] uppercase opacity-60">Synchronizing curriculum topics...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                className="text-center py-20 bg-white rounded-[3rem] border border-red-100 shadow-xl max-w-lg mx-auto"
              >
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Info size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Sync Failed</h3>
                <p className="text-slate-500 font-medium mb-8 px-10 leading-relaxed">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  Retry Connection
                </button>
              </motion.div>
            ) : topics.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-5"
              >
                {topics.map((topic, index) => (
                  <div
                    key={topic._id}
                    onClick={() => handleTopicSelection(topic._id)}
                    className="group flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-900/5 cursor-pointer transition-all duration-500"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 shadow-inner">
                        {topic.topicNumber || index + 1}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-700 transition-colors tracking-tight">
                          {topic.title}
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                          Access Presentation & Video Lectures
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex items-center gap-2">
                         <span className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                            <Bookmark size={16} />
                         </span>
                      </div>
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
                <h3 className="text-2xl font-black text-slate-800 mb-3">Topic Inventory Empty</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                  No learning modules have been published for this subject yet. Please contact your administrator for schedule updates.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ℹ️ ACADEMIC FOOTNOTE */}
          {!loading && topics.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl shadow-blue-900/20"
            >
              <div className="p-4 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/30">
                 <BookOpenCheck size={32} />
              </div>
              <div className="text-center md:text-left">
                {/* 🔥 CONFLICT FIXED BELOW: Removed tracking-tight */}
                <h4 className="text-lg font-black mb-2 uppercase tracking-[0.1em]">Student Learning Tip</h4>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Each module includes high-fidelity <strong>PowerPoint Presentations</strong> and <strong>Expert Multimedia Explanations</strong>. Integrating both resources will ensure a comprehensive mastery of the subject matter.
                </p>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}