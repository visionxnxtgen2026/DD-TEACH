import React from "react";
import { Search, Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">

      {/* 🔷 LEFT - TITLE */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Admin Panel
        </h1>
        <p className="text-xs text-gray-400">
          Manage your content
        </p>
      </div>

      {/* 🔍 SEARCH (OPTIONAL) */}
      <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-72">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 text-sm w-full"
        />
      </div>

      {/* 🔔 RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* 🔔 NOTIFICATION */}
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Bell size={18} className="text-gray-600" />
        </button>

        {/* 👤 USER */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            A
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">
            Admin
          </span>
        </div>

      </div>

    </header>
  );
}