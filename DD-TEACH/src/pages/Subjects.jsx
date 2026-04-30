import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BookOpen, 
  Loader2, 
  Info, 
  Search, 
  Layers, 
  ChevronRight,
  BookCheck
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SubjectCard from "../features/subjects/SubjectCard";
import { API } from "../utils/api";

export default function Subjects() {
  const { standard } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 1. PATH PROTECTION & DATA FETCHING
  useEffect(() => {
    const pathType = localStorage.getItem("pathType") || "school";
    
    if (!standard) {
      navigate("/standards");
      return;
    }

    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError("");

        // Unified API call for school curriculum
        const data = await API.getSubjects({ 
          type: "school", 
          standard: standard 
        });

        setSubjects(data || []);
      } catch (err) {
        console.error("❌ Curriculum Fetch Error:", err);
        setError("Unable to retrieve the curriculum. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [standard, navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* 🔷 NAVIGATION HEADER */}
      <Navbar />

      {/* 🔷 BREADCRUMB BAR */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/standards")}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-all text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Grades
          </button>
          
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>01. Standard</span>
            <ChevronRight size={12} className="text-slate-200" />
            <span className="text-blue-600 font-black">02. Subject</span>
            <ChevronRight size={12} className="text-slate-200" />
            <span>03. Topic</span>
          </div>
        </div>
      </div>

      {/* 🔥 HERO SECTION */}
      <header className="bg-white border-b border-slate-100 px-6 md:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.15em] rounded-full border border-blue-100 mb-4">
                <BookCheck size={12} /> Grade {standard} Curriculum
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                Explore Your <span className="text-blue-600">Subjects</span>
              </h1>
              
              <p className="text-slate-500 text-lg md:text-xl max-w-lg font-medium leading-relaxed mx-auto md:mx-0">
                There are <strong>{subjects.length}</strong> core subjects available for Grade {standard}. Select a course to begin your learning journey.
              </p>
            </motion.div>
          </div>

          {/* Metadata Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
            <div className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl flex items-center gap-8">
               <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Modules</p>
                 <p className="text-3xl font-black text-slate-900">{subjects.length}</p>
               </div>
               <div className="w-px h-12 bg-slate-100"></div>
               <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Layers size={32} />
               </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 📚 SUBJECT GRID */}
      <main className="px-6 md:px-20 py-20 flex-1">
        <div className="max-w-7xl mx-auto">
          
          {/* 🔄 LOADING STATE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-blue-600">
              <Loader2 className="animate-spin mb-4" size={56} strokeWidth={2.5} />
              <p className="font-bold tracking-widest text-[10px] uppercase opacity-60">Initializing Course Data...</p>
            </div>
          ) : error ? (
            /* ❌ ERROR STATE */
            <div className="bg-white border border-red-100 p-12 rounded-[3rem] shadow-xl text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Info size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Sync Error</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                Retry Connection
              </button>
            </div>
          ) : subjects.length > 0 ? (
            /* 📚 DATA DISPLAY */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {subjects.map((sub) => (
                <div key={sub._id} className="group transition-all duration-300">
                  <SubjectCard
                    subjectData={sub}
                    standard={standard}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            /* ⚠️ EMPTY STATE */
            <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 border-dashed">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <BookOpen size={48} className="text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Curriculum Pending</h3>
              <p className="text-slate-400 mt-4 max-w-xs mx-auto font-medium leading-relaxed">
                The administrative board is currently finalizing the subjects for Grade {standard}.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 🚀 QUICK ACCESS FOOTER */}
      <section className="bg-white border-t border-slate-100 py-12 px-6 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
             © 2026 Academic Hub • Powered by DD Teach
           </p>
           <div className="flex items-center gap-6 text-sm font-bold text-blue-600">
             <a href="#" className="hover:underline">Contact Support</a>
             <a href="#" className="hover:underline">Privacy Policy</a>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}