import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  Info, 
  Layout, 
  BookOpen, 
  ArrowLeft,
  ChevronRight,
  BookCheck,
  SearchX
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import SubjectSidebar from "../features/topics/SubjectSidebar";
import TopicRow from "../features/topics/TopicRow";
import SearchBar from "../features/topics/SearchBar";

import { API } from "../utils/api";

export default function Topics() {
  const { standard, subject } = useParams(); // subject is the MongoDB ID
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [dataStructure, setDataStructure] = useState([]); // Array of { unitTitle, topics }
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pathType = localStorage.getItem("pathType") || "school";

  // 🔥 1. DATA SYNCHRONIZATION LOGIC
  useEffect(() => {
    if (!subject) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError("");

        // Sync Subject Metadata
        const subRes = await await API.getSubjectById(subject);
        if (subRes) setSubjectName(subRes.name);

        // Conditional Path Logic (School vs College)
        if (pathType === "school") {
          // 🏫 SCHOOL FLOW: Unit-Based Structure
          const unitsRes = await API.getUnits({ subject });
          
          if (Array.isArray(unitsRes)) {
            const unitsWithTopics = await Promise.all(
              unitsRes.map(async (unit) => {
                const topicsRes = await API.getTopics({ unit: unit._id });
                return {
                  unitId: unit._id,
                  unitTitle: `Unit ${unit.unitNumber}: ${unit.title}`,
                  topics: Array.isArray(topicsRes) ? topicsRes : [],
                  order: parseInt(unit.unitNumber) || 0
                };
              })
            );
            setDataStructure(unitsWithTopics.sort((a, b) => a.order - b.order));
          }
        } else {
          // 🎓 COLLEGE FLOW: Subject-Direct Structure
          const topicsRes = await API.getTopics({ subject });
          setDataStructure([
            {
              unitId: "direct",
              unitTitle: "Comprehensive Curriculum",
              topics: Array.isArray(topicsRes) ? topicsRes : [],
            },
          ]);
        }
      } catch (err) {
        console.error("❌ Content Sync Error:", err);
        setError("Unable to retrieve the topic catalogue. Please verify your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [subject, pathType]);

  // 🔍 OPTIMIZED FILTERING
  const filteredData = useMemo(() => {
    return dataStructure
      .map((section) => ({
        ...section,
        topics: section.topics.filter((topic) =>
          topic.title.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((section) => section.topics.length > 0);
  }, [dataStructure, search]);

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
            <span>{pathType === "school" ? `Grade ${standard}` : "Higher Ed"}</span>
            <ChevronRight size={12} className="text-slate-200" />
            <span>Course Catalog</span>
            <ChevronRight size={12} className="text-slate-200" />
            <span className="text-blue-600 font-black">Topics</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative max-w-7xl mx-auto w-full">
        
        {/* 📘 ACADEMIC SIDEBAR (Sticky Workspace) */}
        <aside className="hidden lg:block w-80 h-[calc(100vh-120px)] sticky top-24 border-r border-slate-100 pr-8 mt-12">
          <SubjectSidebar standard={standard} subjectId={subject} />
        </aside>

        {/* 🚀 MAIN CONTENT INTERFACE */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          
          {/* 🔷 HEADER SECTION */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 text-blue-600 font-black mb-3 uppercase tracking-widest text-[10px] bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
                <Layout size={12} /> 
                {pathType === "school" ? `Grade ${standard} Content` : "University Course"}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                {subjectName || "Loading Subject..."}
              </h1>
              <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed">
                Select a topic from the curriculum below to access detailed presentation materials and multimedia lectures.
              </p>
            </motion.div>

            <div className="w-full md:w-80 flex-shrink-0">
              <SearchBar value={search} onChange={setSearch} />
            </div>
          </header>

          {/* 🔄 LOADING & CONTENT STATES */}
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
                <p className="font-bold tracking-widest text-[10px] uppercase opacity-60">Synchronizing Academic Catalog...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                className="bg-white border border-red-100 p-12 rounded-[3rem] shadow-xl text-center max-w-lg mx-auto mt-10"
              >
                <p className="text-red-600 font-bold mb-6 text-lg">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                >
                  Retry Connection
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 mt-8"
              >
                {filteredData.map((section) => (
                  <div key={section.unitId} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* 🔷 SECTION HEADER / DIVIDER */}
                    {pathType === "school" && (
                      <div className="flex items-center gap-6 mb-6">
                        <div className="h-px w-8 bg-slate-200"></div>
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] bg-white px-4 py-2 border border-slate-100 rounded-full shadow-sm">
                          {section.unitTitle}
                        </h2>
                        <div className="h-px flex-1 bg-slate-200"></div>
                      </div>
                    )}

                    {/* 🔥 TOPICS LISTING */}
                    <div className="grid gap-4">
                      {section.topics.map((topic, index) => (
                        <div key={topic._id} className="group">
                          <TopicRow
                            topic={topic}
                            index={index}
                            standard={standard}
                            subject={subject}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* ⚠️ EMPTY STATE (No Search Results or No Data) */}
                {filteredData.length === 0 && (
                  <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed mt-10">
                    <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                      {search ? <SearchX size={48} /> : <BookOpen size={48} />}
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                      {search ? "No matches found" : "Catalogue Pending"}
                    </h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                      {search 
                        ? `We couldn't find any topics matching "${search}". Please try adjusting your search terms.` 
                        : "The academic board has not yet published content for this curriculum sector."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ℹ️ PRODUCTIVITY TIP MODULE */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="mt-20 flex flex-col md:flex-row items-center md:items-start gap-6 bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10">
               <Info size={32} />
            </div>
            
            <div className="relative z-10 text-center md:text-left">
              <h4 className="text-white text-xl font-bold mb-2">Workspace Productivity Tip</h4>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                Utilize the persistent academic sidebar on the left to seamlessly navigate between different units and subjects without losing your current progress.
              </p>
            </div>
          </motion.div>

        </main>
      </div>

      <Footer />
    </div>
  );
}