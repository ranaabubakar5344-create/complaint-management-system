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
import SettingsForm from "./SettingsForm";
import QRCodeCard from "./QRCodeCard";
export default async function SettingsPage() {
  const settings = await prisma.systemSetting.upsert({
    where: { id: 1 },

    update: {},

    create: {
      id: 1,
    },
  });

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="flex min-h-screen">
   <AdminSidebar />

        <section className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white px-6 py-6 lg:px-9">
            <h1 className="text-3xl font-bold">Settings</h1>

            <p className="mt-1 text-sm text-slate-500">
              Configure your complaint management system.
            </p>
          </header>

          <div className="mx-auto max-w-5xl p-5 lg:p-9">
            <SettingsForm
              initialSettings={{
                organizationName: settings.organizationName,
                systemTitle: settings.systemTitle,
                notificationEmail: settings.notificationEmail,
                emailSenderName: settings.emailSenderName,
                complaintFormUrl: settings.complaintFormUrl,
                allowAnonymous: settings.allowAnonymous,
                requirePhone: settings.requirePhone,
              }}
            />

          </div>
          <div className="mt-6">
  <QRCodeCard
    complaintFormUrl={settings.complaintFormUrl || ""}
  />
</div>
        </section>
      </div>
    </main>
  );
}