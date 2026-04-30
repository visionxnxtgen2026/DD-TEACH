import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  List,
  FileText,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 🔥 MENU ITEMS
  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Subjects",
      path: "/subjects",
      icon: BookOpen,
    },
    {
      name: "Units",
      path: "/units",
      icon: Layers,
    },
    {
      name: "Topics",
      path: "/topics",
      icon: List,
    },
    {
      name: "Content",
      path: "/content",
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col">

      {/* 🔷 LOGO */}
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-lg font-bold text-blue-600">
          DD Admin
        </h1>
      </div>

      {/* 🔥 MENU */}
      <nav className="flex-1 p-4 space-y-2">

        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}

      </nav>

      {/* 🔻 FOOTER */}
      <div className="p-4 text-xs text-gray-400 border-t">
        © {new Date().getFullYear()} DD Admin
      </div>

    </aside>
  );
}