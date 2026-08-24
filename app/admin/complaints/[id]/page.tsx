import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Mail,
  MessageSquareWarning,
  Phone,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import AdminSidebar from "../../AdminSidebar";
import { prisma } from "@/lib/prisma";
import StatusButtons from "@/app/api/complaints/[id]/StatusButtons";
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700",
    IN_PROGRESS: "bg-amber-50 text-amber-700",
    RESOLVED: "bg-emerald-50 text-emerald-700",
    CLOSED: "bg-slate-100 text-slate-700",
  };

  const labels: Record<string, string> = {
    NEW: "NEW",
    IN_PROGRESS: "IN PROGRESS",
    RESOLVED: "RESOLVED",
    CLOSED: "CLOSED",
  };

  return (
    <span
      className={`inline-flex rounded-xl px-5 py-3 text-sm font-bold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export default async function ComplaintDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const complaintId = Number(id);

  if (Number.isNaN(complaintId)) {
    notFound();
  }

  const complaint = await prisma.complaint.findUnique({
    where: {
      id: complaintId,
    },
  });

  if (!complaint) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
   <AdminSidebar />

        {/* MAIN */}
        <section className="min-w-0 flex-1">

          {/* TOP BAR */}
          <header className="flex min-h-20 items-center border-b border-slate-200 bg-white px-5 lg:px-9">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft size={20} />
              </Link>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link
                  href="/admin"
                  className="hover:text-blue-600"
                >
                  Complaints
                </Link>

                <span>/</span>

                <span className="font-medium text-slate-700">
                  {complaint.referenceNo}
                </span>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-9">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* REFERENCE */}
              <div className="flex flex-col gap-5 px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Complaint Reference
                  </p>

                  <h1 className="mt-2 break-all text-2xl font-bold tracking-tight sm:text-3xl">
                    {complaint.referenceNo}
                  </h1>
                </div>

                <StatusBadge status={complaint.status} />
              </div>

              <div className="mx-6 border-t border-slate-200 sm:mx-10" />

              {/* PERSONAL DETAILS */}
              <div className="grid gap-x-12 gap-y-8 px-6 py-8 sm:px-10 md:grid-cols-2">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Submitted By
                    </p>

                    <p className="mt-1 font-semibold">
                      {complaint.isAnonymous
                        ? "Anonymous"
                        : complaint.fullName || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Submitted Date
                    </p>

                    <p className="mt-1 font-semibold">
                      {new Date(
                        complaint.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!complaint.isAnonymous && (
                  <>
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Mail size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm text-slate-500">
                          Email
                        </p>

                        {complaint.email ? (
                          <a
                            href={`mailto:${complaint.email}`}
                            className="mt-1 block break-all font-semibold hover:text-blue-600"
                          >
                            {complaint.email}
                          </a>
                        ) : (
                          <p className="mt-1 font-semibold">
                            Not provided
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Phone size={20} />
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">
                          Phone Number
                        </p>

                        <p className="mt-1 font-semibold">
                          {complaint.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mx-6 border-t border-slate-200 sm:mx-10" />

              {/* COMPLAINT */}
              <div className="px-6 py-8 sm:px-10">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Subject
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      {complaint.subject}
                    </h2>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-3 flex items-center gap-2">
                    <MessageSquareWarning
                      size={18}
                      className="text-blue-600"
                    />

                    <p className="text-sm font-medium text-slate-500">
                      Complaint Details
                    </p>
                  </div>

                  <div className="min-h-28 whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm leading-7 text-slate-700">
                    {complaint.description}
                  </div>
                </div>
              </div>

              <div className="mx-6 border-t border-slate-200 sm:mx-10" />

              {/* STATUS */}
              <div className="px-6 py-8 sm:px-10">
                <StatusButtons
                  complaintId={complaint.id}
                  currentStatus={complaint.status}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}