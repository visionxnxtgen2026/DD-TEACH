import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  List,
  FileText,
  GraduationCap,
  School,
  ArrowRight,
  RefreshCcw,
  PlusCircle
} from "lucide-react";

import { API } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    schoolSubjects: 0,
    collegeSubjects: 0,
    totalUnits: 0,
    totalTopics: 0,
    totalContent: 0,
  });

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // 🔥 FETCH STATS
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.getDashboardStats();

      // Backend returns: { success: true, data: { ... } }
      const data = res?.success ? res.data : (res?.data || res || {});
      
      setStats({
        schoolSubjects: data.schoolSubjects || 0,
        collegeSubjects: data.collegeSubjects || 0,
        totalUnits: data.totalUnits || 0,
        totalTopics: data.totalTopics || 0,
        totalContent: data.totalContent || 0,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("❌ Dashboard stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 🔥 NAVIGATION
  const handleDrillDown = (type) => {
    navigate(`/subjects?type=${type}`);
  };

  return (
    <div className="p-4 md:p-6 pb-10 max-w-7xl mx-auto">
      
      {/* 🔷 HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time platform insights • Last updated: {lastUpdated}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchStats} 
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Stats
        </Button>
      </div>

      {/* 🏛️ INSTITUTION BREAKDOWN */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
          Institution Insights
          <div className="h-px flex-1 bg-gray-200 ml-2"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 🏫 SCHOOL CARD */}
          <div
            onClick={() => handleDrillDown("school")}
            className="cursor-pointer group"
          >
            <Card className="border-l-8 border-blue-500 flex items-center justify-between p-8 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">School Subjects</p>
                <h3 className="text-4xl font-black text-gray-900">
                  {loading ? "..." : stats.schoolSubjects}
                </h3>
                <span className="text-xs font-semibold text-blue-600 flex items-center pt-2 group-hover:translate-x-1 transition-transform">
                  Manage School Data <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
              <div className="bg-blue-50 p-5 rounded-2xl group-hover:bg-blue-100 transition-colors">
                <School size={40} className="text-blue-600" />
              </div>
            </Card>
          </div>

          {/* 🎓 COLLEGE CARD */}
          <div
            onClick={() => handleDrillDown("college")}
            className="cursor-pointer group"
          >
            <Card className="border-l-8 border-purple-500 flex items-center justify-between p-8 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">College Subjects</p>
                <h3 className="text-4xl font-black text-gray-900">
                  {loading ? "..." : stats.collegeSubjects}
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center pt-2 group-hover:translate-x-1 transition-transform">
                  Manage College Data <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
              <div className="bg-purple-50 p-5 rounded-2xl group-hover:bg-purple-100 transition-colors">
                <GraduationCap size={40} className="text-purple-600" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 📊 GLOBAL STATS GRID */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
          Content Metrics
          <div className="h-px flex-1 bg-gray-200 ml-2"></div>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <Layers size={24} className="text-green-600" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Units</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">
              {loading ? "..." : stats.totalUnits}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1">(Only School Path)</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="bg-orange-50 p-3 rounded-lg mb-4">
              <List size={24} className="text-orange-600" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Topics</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">
              {loading ? "..." : stats.totalTopics}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="bg-red-50 p-3 rounded-lg mb-4">
              <FileText size={24} className="text-red-600" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Content Files</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">
              {loading ? "..." : stats.totalContent}
            </h3>
          </div>

        </div>
      </div>

      {/* ⚡ QUICK ACTIONS */}
      <Card className="bg-gray-900 text-white p-8 overflow-hidden relative shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">Create New Content</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            Instantly add data across any level of the platform hierarchy.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/subjects")} className="bg-white text-black hover:bg-gray-100 font-bold px-6 flex gap-2 items-center">
              <PlusCircle size={18} /> Subject
            </Button>
            <Button variant="outline" onClick={() => navigate("/units")} className="border-gray-600 text-white hover:bg-gray-800 flex gap-2 items-center">
              <PlusCircle size={18} /> Unit
            </Button>
            <Button variant="outline" onClick={() => navigate("/topics")} className="border-gray-600 text-white hover:bg-gray-800 flex gap-2 items-center">
              <PlusCircle size={18} /> Topic
            </Button>
            <Button variant="outline" onClick={() => navigate("/content")} className="border-gray-600 text-white hover:bg-gray-800 flex gap-2 items-center">
              <PlusCircle size={18} /> Content
            </Button>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute -right-20 -bottom-20 bg-blue-600/10 w-64 h-64 rounded-full blur-3xl"></div>
      </Card>
    </div>
  );
}