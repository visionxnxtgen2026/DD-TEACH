import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowLeft, Loader2, BookOpen, Layers, ChevronRight, School } from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SectionTitle from "../../components/common/SectionTitle";
import Card from "../../components/ui/Card";

import { API } from "../../utils/api";

export default function CollegeHome() {
  const navigate = useNavigate();

  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 1. PATH PROTECTION & DATA SYNCHRONIZATION
  useEffect(() => {
    // Security Check: Verify user is on the Higher Learning track
    const pathType = localStorage.getItem("pathType");
    if (pathType !== "college") {
      navigate("/");
      return;
    }

    const fetchDynamicStreams = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch academic subjects documented for the College path
        const data = await API.getSubjects({ type: "college" });

        // Extract and deduplicate unique stream names (e.g., CSE, AIML, Mechanical)
        if (data && Array.isArray(data)) {
          const uniqueStreams = [
            ...new Set(
              data
                .map((item) => item.stream)
                .filter((s) => s && s.trim() !== "")
            ),
          ].sort();

          setStreams(uniqueStreams);
        }
      } catch (err) {
        console.error("❌ Stream Synchronization Error:", err);
        setError("Unable to synchronize stream data. Please verify your database connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicStreams();
  }, [navigate]);

  // 🔥 EVENT HANDLERS
  const handleStreamSelection = (streamName) => {
    navigate(`/college/${streamName}`);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* 🔥 ACADEMIC HEADER SECTION */}
      <section className="bg-white border-b border-slate-100 px-6 md:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all mb-10"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 text-blue-600 font-black mb-4 uppercase tracking-[0.2em] text-[10px] bg-blue-50 w-fit px-4 py-1.5 rounded-full border border-blue-100">
                <Layers size={14} /> Professional Degree Track
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                Higher <span className="text-blue-600">Learning</span> Portal
              </h1>
              <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">
                Select your academic stream below. New programs created within the administrative panel are synchronized here in real-time.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:block"
            >
               <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex items-center gap-6 shadow-2xl shadow-slate-200">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                     <GraduationCap size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Authenticated Path</p>
                    <p className="text-lg font-black tracking-tight">University Education</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🎯 STREAM SELECTION INTERFACE */}
      <section className="px-6 md:px-20 py-20 flex-1">
        <div className="max-w-7xl mx-auto">
          
          <SectionTitle
            title="Available Academic Streams"
            subtitle="Choose your professional track to explore semester-wise curriculum and resources."
            align="left"
          />

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
                <p className="font-bold tracking-widest text-[10px] uppercase opacity-60">Fetching Stream Directory...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                className="max-w-lg mx-auto text-center py-16 bg-white rounded-[3rem] shadow-xl shadow-red-100 border border-red-50 p-10"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <School size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Synchronization Failed</h3>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                >
                  Retry Connection
                </button>
              </motion.div>
            ) : streams.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
              >
                {streams.map((stream) => (
                  <motion.div 
                    key={stream}
                    whileHover={{ y: -8 }}
                    onClick={() => handleStreamSelection(stream)}
                    className="group cursor-pointer"
                  >
                    <Card className="p-10 border-2 border-transparent hover:border-blue-500 hover:shadow-2xl transition-all duration-500 bg-white text-center relative overflow-hidden h-full flex flex-col items-center">
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronRight size={20} className="text-blue-600" />
                      </div>

                      <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                        <GraduationCap size={40} />
                      </div>

                      <h2 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                        {stream}
                      </h2>

                      <div className="mt-auto pt-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Curriculum</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-white rounded-[4rem] border border-slate-200 border-dashed"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <BookOpen size={48} className="text-slate-200" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">No Streams Detected</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                  The academic catalogue is currently empty. Programs published in the Administrative Panel will populate here automatically.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}