import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* 🔷 SIDEBAR */}
      <Sidebar />

      {/* 🔷 RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* 🔷 HEADER */}
        <Header />

        {/* 🔷 MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}