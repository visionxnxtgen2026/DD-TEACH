import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ArrowLeft, 
  Loader2, 
  GraduationCap, 
  ChevronRight, 
  Layout, 
  SearchX,
  ShieldCheck
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SectionTitle from "../../components/common/SectionTitle";
import Card from "../../components/ui/Card";

import { API } from "../../utils/api";

export default function Semester() {
  const { stream } = useParams();
  const navigate = useNavigate();

  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 1. PATH PROTECTION & DATA SYNCHRONIZATION
  useEffect(() => {
    // Security Check: Ensure user is authorized for the Higher Learning track
    const pathType = localStorage.getItem("pathType");
    if (pathType !== "college") {
      navigate("/");
      return;
    }

    if (!stream) return;

    const fetchDynamicSemesters = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all academic subjects mapped to this specific stream
        const data = await API.getSubjects({ 
          type: "college", 
          stream: stream 
        });

        if (data && Array.isArray(data)) {
          // Extract unique semester numbers documented in the database
          const uniqueSem = [
            ...new Set(
              data.map((item) => item.semester).filter(Boolean)
            ),
          ];

          // Standardize numerical sorting (1, 2, 3...)
          const sortedSem = uniqueSem.sort((a, b) => Number(a) - Number(b));
          setSemesters(sortedSem);
        }

      } catch (err) {
        console.error("❌ Semester Synchronization Error:", err);
        setError("Unable to synchronize semester data. Please verify your database connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicSemesters();
  }, [stream, navigate]);

  // 🔥 NAVIGATION HANDLER
  const handleSemesterSelection = (semNumber) => {
    navigate(`/college/${stream}/${semNumber}`);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* 🔥 ACADEMIC HEADER SECTION */}
      <section className="bg-white border-b border-slate-200 px-6 md:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          
          <button
            onClick={() => navigate("/college")}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all mb-10"
          >
            <div className="p-2 bg-slate-50 group-hover:bg-blue-50 rounded-xl transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Stream Selection
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 text-blue-600 font-black mb-4 uppercase tracking-[0.2em] text-[10px] bg-blue-50 w-fit px-4 py-1.5 rounded-full border border-blue-100">
                <GraduationCap size={14} /> {stream} Engineering Track
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                Academic <span className="text-blue-600">Curriculum</span>
              </h1>
              <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">
                The semesters currently holding published study materials and module resources are cataloged below.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:block"
            >
               <div className="p-6 bg-slate-900 text-white rounded-[2.5rem] flex items-center gap-6 shadow-2xl shadow-slate-200">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                     <Layout size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Academic Registry</p>
                    <p className="text-lg font-black tracking-tight">Course Repository</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🎯 SEMESTER SELECTION INTERFACE */}
      <main className="px-6 md:px-20 py-20 flex-1">
        <div className="max-w-7xl mx-auto">

          <SectionTitle
            title="Program Structure"
            subtitle="Select a specific semester to access the module directory and lecture assets."
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
                <p className="font-bold tracking-widest text-[10px] uppercase opacity-60">Synchronizing Semester Directory...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                className="max-w-lg mx-auto text-center py-16 bg-white rounded-[3rem] shadow-xl shadow-red-100 border border-red-50 p-10"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <SearchX size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Sync Failed</h3>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                >
                  Retry Connection
                </button>
              </motion.div>
            ) : semesters.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12"
              >
                {semesters.map((sem) => (
                  <motion.div 
                    key={sem} 
                    whileHover={{ y: -10 }}
                    onClick={() => handleSemesterSelection(sem)}
                    className="group cursor-pointer"
                  >
                    <Card className="relative overflow-hidden p-10 border-2 border-transparent hover:border-blue-500 hover:shadow-2xl transition-all duration-500 bg-white h-full flex flex-col justify-between rounded-[2.5rem]">
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                          <BookOpen size={32} />
                        </div>
                        <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
                           <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <ShieldCheck size={14} className="text-green-500" />
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Curriculum</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                          Semester {sem}
                        </h2>
                        <p className="text-slate-400 text-sm font-medium mt-2">
                          View subjects & academic resources
                        </p>
                      </div>

                      {/* Subtle Background Badge */}
                      <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <span className="text-[12rem] font-black select-none leading-none">{sem}</span>
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
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <SearchX size={48} className="text-slate-200" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Catalogue Pending</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                  No semesters have been published for the {stream} track yet. Please verify subject enrollment in the administrative panel.
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