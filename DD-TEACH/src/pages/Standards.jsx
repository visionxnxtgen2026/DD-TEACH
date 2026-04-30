import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BookOpen, 
  GraduationCap, 
  Loader2, 
  Search, 
  Filter, 
  LayoutGrid,
  Info
} from "lucide-react";

import { API } from "../utils/api"; 
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import StandardCard from "../features/standards/StandardCard";

export default function Standards() {
  const navigate = useNavigate();
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 1. FETCH & EXTRACT STANDARDS
  const loadDynamicStandards = async () => {
    try {
      setLoading(true);
      const res = await API.getSubjects({ type: "school" });
      
      if (res) {
        const data = Array.isArray(res) ? res : (res.data || []);
        const allStds = data.map((s) => s.standard);
        const uniqueStds = [...new Set(allStds)].filter(Boolean);
        
        // Sorting: Alphanumeric sort
        const sortedStds = uniqueStds.sort((a, b) => parseInt(a) - parseInt(b));
        setStandards(sortedStds);
      }
    } catch (err) {
      console.error("Error loading standards:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 2. INITIAL PATH CHECKS
  useEffect(() => {
    const pathType = localStorage.getItem("pathType");
    if (pathType !== "school") {
      navigate("/");
    } else {
      loadDynamicStandards();
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* 🔷 TOP NAVIGATION BAR */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-all text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Return to Learning Hub
          </button>
          
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="text-blue-600">01. Standard</span>
            <span className="text-slate-200">/</span>
            <span>02. Subject</span>
            <span className="text-slate-200">/</span>
            <span>03. Topic</span>
          </div>
        </div>
      </div>

      {/* 🔥 HERO SECTION */}
      <header className="bg-white px-6 md:px-20 pt-12 pb-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-blue-600 font-black mb-3 uppercase tracking-widest text-[10px] bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
                <LayoutGrid size={12} /> Academic Catalog
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Select Your <span className="text-blue-600">Standard</span>
              </h1>
              <p className="text-slate-500 mt-4 text-lg font-medium max-w-lg leading-relaxed">
                Choose your grade level to access curated study materials and syllabus-aligned resources.
              </p>
            </div>

            {/* QUICK STATS / INFO */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Available Classes</p>
                <p className="text-2xl font-black text-slate-900">{standards.length}</p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Syllabus Year</p>
                <p className="text-2xl font-black text-slate-900">2026-27</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 📚 DYNAMIC CONTENT GRID */}
      <main className="px-6 md:px-20 py-16 flex-1">
        <div className="max-w-7xl mx-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-blue-600">
              <Loader2 className="animate-spin mb-4" size={48} strokeWidth={2.5} />
              <p className="font-bold tracking-widest text-xs uppercase opacity-60">Synchronizing Catalog...</p>
            </div>
          ) : standards.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {standards.map((std) => (
                <div key={std} className="group">
                  <StandardCard 
                     standard={std} 
                     className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-slate-100"
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            /* ⚠️ EMPTY STATE (Professional administrative look) */
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
               <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Info size={40} />
               </div>
               <h3 className="text-2xl font-black text-slate-800">Catalogue Update in Progress</h3>
               <p className="text-slate-400 mt-2 max-w-sm mx-auto font-medium leading-relaxed">
                 The curriculum for this path is currently being updated by the administration. Please check back shortly.
               </p>
            </div>
          )}

          {/* PATH SWITCHER BANNER */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="mt-24 relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl shadow-slate-900/20"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
             
             <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
               <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center flex-shrink-0 border border-white/10">
                    <GraduationCap size={48} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-3">Higher Education Portal</h3>
                    <p className="text-slate-400 text-lg max-w-md font-medium">
                      Are you looking for University or College degree materials? Switch to our professional degree path.
                    </p>
                  </div>
               </div>

               <button 
                 onClick={() => {
                   localStorage.setItem("pathType", "college");
                   navigate("/college");
                 }}
                 className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/30 active:scale-95 whitespace-nowrap"
               >
                 Go to College Path
               </button>
             </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}