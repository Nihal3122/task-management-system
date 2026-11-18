import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 min-w-0">
        {/* <Navbar /> */}

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
