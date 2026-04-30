import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  School, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe 
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home() {
  const navigate = useNavigate();

  // 🔥 Path Selection Logic
  const handlePathSelection = (type) => {
    localStorage.setItem("pathType", type);
    if (type === "school") {
      navigate("/standards");
    } else {
      navigate("/college");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      {/* 🔷 HERO SECTION */}
      <section className="relative pt-20 pb-32 px-6 md:px-20 overflow-hidden bg-white">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* LEFT CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-[0.2em] rounded-full border border-blue-100 mb-8">
              <Zap size={14} className="fill-current" /> Empowering Learners
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
              Learn Smart. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Achieve More.
              </span>
            </h1>
            
            <p className="mt-8 text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Access premium study materials, expert notes, and curated resources for School and Higher Education.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button
                onClick={() => handlePathSelection("school")}
                className="group px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Get Started <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('paths').scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95"
              >
                Explore Paths
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE/LOGOTYPE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 p-4 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/60 shadow-2xl">
              <img
                src="/logo.png" 
                alt="DD Teach"
                className="w-full max-w-[550px] rounded-[2.5rem] object-cover"
              />
            </div>
            
            {/* Floating Achievement Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 z-20">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={28} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Verified Content</p>
                <p className="font-bold text-slate-800">Academic Excellence</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🎯 PATH SELECTION SECTION */}
      <section id="paths" className="px-6 md:px-20 py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Choose Your Level</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Select your current academic track to access specialized materials and resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">

            {/* 🏫 SCHOOL PATH */}
            <motion.div 
              whileHover={{ y: -10 }}
              onClick={() => handlePathSelection("school")}
              className="group cursor-pointer bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center transition-all hover:shadow-2xl"
            >
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <School size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4">K-12 Education</h3>
              <p className="text-slate-500 leading-relaxed font-medium mb-10">
                Grade 6 to Grade 12 study resources strictly aligned with the latest State Board syllabus.
              </p>
              <div className="px-8 py-4 bg-slate-50 text-blue-600 font-black rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center gap-2">
                Open Portal <ArrowRight size={20} />
              </div>
            </motion.div>

            {/* 🎓 COLLEGE PATH */}
            <motion.div 
              whileHover={{ y: -10 }}
              onClick={() => handlePathSelection("college")}
              className="group cursor-pointer bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center transition-all hover:shadow-2xl"
            >
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <GraduationCap size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4">Higher Learning</h3>
              <p className="text-slate-500 leading-relaxed font-medium mb-10">
                Extensive curriculum materials for Professional degrees including Engineering and Arts.
              </p>
              <div className="px-8 py-4 bg-slate-50 text-indigo-600 font-black rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center gap-2">
                Open Portal <ArrowRight size={20} />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 🚀 VALUE PROPOSITIONS */}
      <section className="bg-slate-900 text-white py-24 px-6 md:px-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3">Structured Syllabus</h4>
            <p className="text-slate-400 font-medium text-center">Organized topic-wise content for efficient study sessions.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3">Instant Access</h4>
            <p className="text-slate-400 font-medium text-center">Seamless content delivery without registration barriers.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Globe size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3">Expert Guidance</h4>
            <p className="text-slate-400 font-medium text-center">Simplified concepts designed for academic mastery.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}