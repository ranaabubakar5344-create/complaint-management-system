import Link from "next/link";
import {
  BarChart3,
  LayoutDashboard,
  MessageSquareWarning,
  Settings,
  ShieldCheck,
} from "lucide-react";
import AdminSidebar from "../AdminSidebar";
import { prisma } from "@/lib/prisma";
import LogoutButton from "../LogoutButton";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const complaints = await prisma.complaint.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
     <AdminSidebar />

        {/* CONTENT */}
        <section className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white px-6 py-6 lg:px-9">
            <h1 className="text-3xl font-bold">
              Reports
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Complaint performance, statistics and reporting.
            </p>
          </header>

          <div className="p-5 lg:p-9">
            <ReportsClient
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