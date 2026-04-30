import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Atom,
  Calculator,
  Globe,
  Languages,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Dna,
  Cpu,
} from "lucide-react";

import Card from "../../components/ui/Card";

export default function SubjectCard({
  subjectData, 
  standard,
  activeSubject,
}) {
  const navigate = useNavigate();
  const { subject: urlSubject } = useParams();

  // 🛡️ Guard: Prevent rendering if data is unavailable
  if (!subjectData) return null;

  const subjectName = subjectData.name;
  const subjectId = subjectData._id;

  // 🎯 Active State Logic
  const currentSubject = activeSubject ?? urlSubject;
  const isActive = currentSubject === subjectName || currentSubject === subjectId;

  // 🎨 Comprehensive Academic Icon Mapping
  const icons = {
    Tamil: Languages,
    English: BookOpen,
    Maths: Calculator,
    Mathematics: Calculator,
    Science: Atom,
    Physics: Atom,
    Chemistry: FlaskConical,
    Biology: Dna,
    Social: Globe,
    History: Globe,
    Geography: Globe,
    ICT: Cpu,
    Computer: Cpu,
  };

  // Case-insensitive lookup for dynamic icons
  const lookupKey = subjectName?.trim().charAt(0).toUpperCase() + subjectName?.trim().slice(1).toLowerCase();
  const Icon = icons[lookupKey] || BookOpen;

  // 🚀 Standardized Navigation Path
  const handleClick = () => {
    navigate(`/standard/${standard}/subject/${subjectId}`);
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="h-full"
    >
      <Card
        onClick={handleClick}
        className={`relative overflow-hidden flex flex-col items-center justify-center text-center p-10 h-full transition-all duration-500 border-2 ${
          isActive
            ? "bg-blue-50/50 border-blue-500 shadow-2xl shadow-blue-200"
            : "bg-white border-slate-100 shadow-xl shadow-slate-200/40 hover:border-blue-200"
        }`}
      >
        {/* 🔷 Verified Badge */}
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-5 right-5 text-blue-600"
          >
            <ShieldCheck size={24} strokeWidth={2.5} />
          </motion.div>
        )}

        {/* 🔷 Icon Module */}
        <div
          className={`w-20 h-20 flex items-center justify-center rounded-[2.2rem] mb-8 transition-all duration-500 shadow-inner ${
            isActive
              ? "bg-blue-600 text-white rotate-6"
              : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
          }`}
        >
          <Icon size={38} strokeWidth={isActive ? 2.5 : 2} />
        </div>

        {/* 📘 Curriculum Metadata */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
            Curriculum Module
          </p>
          <h3
            className={`text-2xl font-black transition-colors duration-300 leading-tight tracking-tight ${
              isActive ? "text-blue-700" : "text-slate-800"
            }`}
          >
            {subjectName}
          </h3>
          <div className="flex items-center justify-center gap-1.5">
             <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-400 animate-pulse' : 'bg-slate-200'}`}></div>
             <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
               Certified Course
             </p>
          </div>
        </div>

        {/* ➡️ Action Indicator */}
        <div className="mt-10">
          <div
            className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 shadow-lg ${
              isActive
                ? "bg-blue-700 text-white"
                : "bg-slate-900 text-white hover:bg-blue-600"
            }`}
          >
            <ArrowRight
              size={22}
              className={`${isActive ? "translate-x-1" : "group-hover:translate-x-1"} transition-transform`}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}