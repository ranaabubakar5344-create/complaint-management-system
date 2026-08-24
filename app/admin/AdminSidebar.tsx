
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Lightbulb,
  MessageSquareWarning,
  Settings,
  ShieldCheck,
} from "lucide-react";

import LogoutButton from "./LogoutButton";

export default function AdminSidebar() {
  const pathname = usePathname();

  const isDashboard = pathname === "/admin";

  const isReports =
    pathname === "/admin/reports";

  const isSettings =
    pathname === "/admin/settings";

  const isComplaints =
    pathname.startsWith("/admin/complaints");

  function linkClass(active: boolean) {
    return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
      active
        ? "bg-blue-600 font-semibold text-white shadow-lg shadow-blue-900/20"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;
  }

  return (
    <aside className="hidden min-h-screen w-[270px] shrink-0 flex-col bg-[#0b1d3a] text-white lg:flex">
      {/* LOGO */}
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <ShieldCheck size={23} />
        </div>

        <div>
          <p className="font-bold">
            Complaint
          </p>

          <p className="text-xs text-slate-400">
            Management System
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2 px-4 py-7">
        <Link
          href="/admin"
          className={linkClass(isDashboard)}
        >
          <LayoutDashboard size={19} />
          Dashboard
        </Link>

        <Link
          href="/admin"
          className={linkClass(isComplaints)}
        >
          <MessageSquareWarning size={19} />
          Complaints
        </Link>

        <Link
          href="/admin/reports"
          className={linkClass(isReports)}
        >
          <BarChart3 size={19} />
          Reports
        </Link>

        <Link
          href="/admin/settings"
          className={linkClass(isSettings)}
        >
          <Settings size={19} />
          Settings
        </Link>
 
         <LogoutButton />
      </nav>


    </aside>
  );
}