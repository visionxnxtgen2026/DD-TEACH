import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  PlayCircle,
  ExternalLink,
  Download,
  Loader2,
  Video,
  BookOpen,
  Info,
  AlertCircle,
  FileSearch
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { API } from "../../utils/api";

// 🔥 File server base URL
const FILE_BASE = import.meta.env.VITE_API_BASE_URL || "http://${import.meta.env.VITE_API_URL}";

export default function CollegeContent() {
  const { stream, sem, subject, topic } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 1. DATA SYNCHRONIZATION
  useEffect(() => {
    if (!topic) return;

    const fetchContentData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await API.getContent({ topic: topic });

        if (Array.isArray(data)) {
          setContent(data[0] || null);
        } else {
          setContent(data || null);
        }

      } catch (err) {
        console.error("❌ Content Sync Error:", err);
        setError("We are unable to retrieve the study materials for this topic at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [topic]);

  /**
   * 🎥 OPTIMIZED YOUTUBE EMBED HANDLER
   */
  const getEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    try {
      if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("shorts/")) {
        videoId = url.split("shorts/")[1]?.split("?")[0];
      } else if (url.includes("embed/")) {
        return url;
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (err) {
      return url;
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* 🔷 BREADCRUMB NAVIGATION */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-all text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Topics
          </button>
          
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>{stream}</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span>Semester {sem}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 px-6 md:px-20 py-12">
        <div className="max-w-6xl mx-auto">

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
                <p className="font-bold tracking-widest text-[10px] uppercase opacity-60">Synchronizing Study Assets...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-[3rem] border border-red-100 shadow-xl max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4">Sync Failed</h3>
                <p className="text-slate-500 font-medium px-10 mb-8 leading-relaxed">
                  {error}
                </p>
                <Button onClick={() => window.location.reload()} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold">
                  Retry Connection
                </Button>
              </motion.div>
            ) : content ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                
                {/* 🏷️ ACADEMIC HEADER */}
                <div className="mb-12">
                  <div className="flex items-center gap-2 text-blue-600 font-black mb-4 uppercase tracking-[0.2em] text-[10px] bg-blue-50 w-fit px-4 py-1.5 rounded-full border border-blue-100">
                    <BookOpen size={14} /> Academic Resource Portal
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                    {content.topic?.title || "Educational Module"}
                  </h1>
                  <p className="text-slate-500 mt-6 text-lg font-medium max-w-2xl leading-relaxed">
                    Access high-fidelity presentations and multimedia lectures curated for this specific module.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* 📄 PRESENTATION & RESOURCES SECTION */}
                  <div className="lg:col-span-4">
                    <Card className="sticky top-24 p-8 border-0 bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem]">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] shadow-inner">
                           <FileText size={28} />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-slate-800">Reading Assets</h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digital Notes</p>
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
                        Download or preview the official course presentation (PPT) designed for this lecture.
                      </p>

                      {content.pptUrl ? (
                        <div className="flex flex-col gap-4">
                          <Button
                            className="w-full bg-blue-600 text-white rounded-2xl py-5 flex items-center justify-center gap-3 shadow-xl shadow-blue-200 font-bold hover:bg-blue-700 transition-all"
                            onClick={() => window.open(`${FILE_BASE}${content.pptUrl}`, "_blank")}
                          >
                            <Download size={20} /> Download Presentation
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-slate-200 text-slate-600 rounded-2xl py-5 flex items-center justify-center gap-3 hover:bg-slate-50 font-bold transition-all"
                            onClick={() => window.open(`${FILE_BASE}${content.pptUrl}`, "_blank")}
                          >
                            View in Browser <ExternalLink size={20} />
                          </Button>
                        </div>
                      ) : (
                        <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] text-center text-slate-400 text-sm font-bold flex flex-col items-center gap-4">
                          <FileSearch size={32} strokeWidth={1} />
                          No presentation assets available.
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* 🎥 MULTIMEDIA LECTURE SECTION */}
                  <div className="lg:col-span-8">
                    <Card className="p-2 overflow-hidden bg-slate-900 rounded-[3rem] border-0 shadow-2xl">
                      <div className="p-8 bg-slate-800/50 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-white">
                          <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl border border-red-500/20">
                            <Video size={24} />
                          </div>
                          <div>
                            <span className="block font-black text-lg">Interactive Lecture</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Multimedia Stream</span>
                          </div>
                        </div>
                        
                        {content.youtubeUrl && (
                          <a 
                            href={content.youtubeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10 backdrop-blur-lg"
                          >
                            Watch on YouTube <ExternalLink size={16} />
                          </a>
                        )}
                      </div>

                      <div className="bg-black">
                        {content.youtubeUrl ? (
                          <div className="w-full aspect-video">
                            <iframe
                              className="w-full h-full"
                              src={getEmbedUrl(content.youtubeUrl)}
                              title="Curriculum Video Lecture"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="aspect-video flex flex-col items-center justify-center text-slate-600 gap-6">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                               <PlayCircle size={64} className="opacity-20" />
                            </div>
                            <p className="font-bold tracking-widest uppercase text-[10px]">Video tutorial pending upload</p>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* 📝 LECTURE SUMMARY */}
                    {content.notes && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <Card className="mt-10 p-10 bg-white border-0 rounded-[3rem] shadow-xl shadow-slate-200/30">
                          <div className="flex items-center gap-4 mb-6">
                             <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                               <Info size={24} />
                             </div>
                             <h3 className="font-black text-2xl text-slate-800">Topic Executive Summary</h3>
                          </div>
                          <div className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap pl-2 border-l-2 border-slate-100">
                            {content.notes}
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ⚠️ CATALOGUE EMPTY STATE */
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-white rounded-[4rem] border border-slate-200 border-dashed"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <FileSearch size={48} className="text-slate-200" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Resources Pending</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                  The curriculum board has not yet published digital assets for this specific educational module.
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