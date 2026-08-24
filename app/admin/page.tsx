import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileText,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  MessageSquareWarning,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import ComplaintsTable from "./ComplaintsTable";
import AdminSidebar from "./AdminSidebar";
import LogoutButton from "./LogoutButton";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700 ring-blue-100",
    IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-100",
    RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    CLOSED: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  const labels: Record<string, string> = {
    NEW: "New",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[status] || "bg-gray-100 text-gray-700 ring-gray-200"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const complaints = await prisma.complaint.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = complaints.length;

  const newCount = complaints.filter(
    (complaint) => complaint.status === "NEW"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) => complaint.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "RESOLVED"
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
<AdminSidebar />

        {/* CONTENT */}
        <section className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-9">
            <div>
              <h1 className="text-2xl font-bold lg:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage and review submitted complaints and suggestions.
              </p>
            </div>

            <div className="flex items-center gap-5">
              <button className="relative hidden rounded-xl border border-slate-200 p-2.5 sm:block">
                <Bell size={20} />

                {newCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {newCount}
                  </span>
                )}
              </button>

              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  M
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Manager
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Online
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-5 lg:p-9">

            {/* STAT CARDS */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Complaints
                    </p>

                    <p className="mt-3 text-3xl font-bold">
                      {total}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <FileText size={26} />
                  </div>
                </div>

                <p className="mt-5 text-xs text-slate-400">
                  All submitted complaints
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      New
                    </p>

                    <p className="mt-3 text-3xl font-bold text-blue-600">
                      {newCount}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <CircleDot size={26} />
                  </div>
                </div>

                <p className="mt-5 text-xs text-slate-400">
                  Awaiting review
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      In Progress
                    </p>

                    <p className="mt-3 text-3xl font-bold text-amber-600">
                      {inProgressCount}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Clock3 size={27} />
                  </div>
                </div>

                <p className="mt-5 text-xs text-slate-400">
                  Currently being handled
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Resolved
                    </p>

                    <p className="mt-3 text-3xl font-bold text-emerald-600">
                      {resolvedCount}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={27} />
                  </div>
                </div>

                <p className="mt-5 text-xs text-slate-400">
                  Successfully resolved
                </p>
              </div>
            </div>
<ComplaintsTable
  complaints={complaints.map((complaint) => ({
    id: complaint.id,
    referenceNo: complaint.referenceNo,
    fullName: complaint.fullName,
    subject: complaint.subject,
    status: complaint.status,
    isAnonymous: complaint.isAnonymous,
    createdAt: complaint.createdAt.toISOString(),
  }))}
/>
          </div>
        </section>
      </div>
    </main>
  );
}