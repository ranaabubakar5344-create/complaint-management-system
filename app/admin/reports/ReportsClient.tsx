"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  MessageSquareWarning,
  UserRound,
  UsersRound,
} from "lucide-react";

type Complaint = {
  id: number;
  referenceNo: string;
  fullName: string | null;
  subject: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
};

type FilterType =
  | "ALL"
  | "TODAY"
  | "7_DAYS"
  | "30_DAYS"
  | "THIS_MONTH"
  | "CUSTOM";

export default function ReportsClient({
  complaints,
}: {
  complaints: Complaint[];
}) {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = useMemo(() => {
    const now = new Date();

    return complaints.filter((complaint) => {
      const date = new Date(complaint.createdAt);

      if (filter === "ALL") {
        return true;
      }

      if (filter === "TODAY") {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        );
      }

      if (filter === "7_DAYS") {
        const start = new Date();
        start.setDate(now.getDate() - 7);
        return date >= start && date <= now;
      }

      if (filter === "30_DAYS") {
        const start = new Date();
        start.setDate(now.getDate() - 30);
        return date >= start && date <= now;
      }

      if (filter === "THIS_MONTH") {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        );
      }

      if (filter === "CUSTOM") {
        if (!fromDate && !toDate) {
          return true;
        }

        if (fromDate) {
          const start = new Date(`${fromDate}T00:00:00`);

          if (date < start) {
            return false;
          }
        }

        if (toDate) {
          const end = new Date(`${toDate}T23:59:59.999`);

          if (date > end) {
            return false;
          }
        }

        return true;
      }

      return true;
    });
  }, [complaints, filter, fromDate, toDate]);

  const total = filtered.length;

  const newCount = filtered.filter(
    (item) => item.status === "NEW"
  ).length;

  const inProgress = filtered.filter(
    (item) => item.status === "IN_PROGRESS"
  ).length;

  const resolved = filtered.filter(
    (item) => item.status === "RESOLVED"
  ).length;

  const closed = filtered.filter(
    (item) => item.status === "CLOSED"
  ).length;

  const anonymous = filtered.filter(
    (item) => item.isAnonymous
  ).length;

  const identified = total - anonymous;

  const resolutionRate =
    total === 0
      ? 0
      : Math.round(((resolved + closed) / total) * 100);
function downloadCSV() {
  if (filtered.length === 0) {
    alert("No report data available to download.");
    return;
  }

  const headers = [
    "Reference No",
    "Submitted By",
    "Subject",
    "Status",
    "Anonymous",
    "Submitted Date",
  ];

  const rows = filtered.map((complaint) => [
    complaint.referenceNo,
    complaint.isAnonymous
      ? "Anonymous"
      : complaint.fullName || "Not provided",
    complaint.subject,
    complaint.status.replace("_", " "),
    complaint.isAnonymous ? "Yes" : "No",
    new Date(complaint.createdAt).toLocaleString(),
  ]);

  const escapeCSV = (value: string) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) =>
      row.map((value) => escapeCSV(String(value))).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `complaints-report-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
  return (
    <>
      {/* FILTER */}
      <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays
                size={20}
                className="text-blue-600"
              />

              <h2 className="font-bold">
                Report Period
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Select the period you want to analyse.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ["ALL", "All Time"],
              ["TODAY", "Today"],
              ["7_DAYS", "Last 7 Days"],
              ["30_DAYS", "Last 30 Days"],
              ["THIS_MONTH", "This Month"],
              ["CUSTOM", "Custom"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setFilter(value as FilterType)
                }
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  filter === value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
                
              </button>
              

            ))}
            <button
  type="button"
  onClick={downloadCSV}
  disabled={filtered.length === 0}
  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  <Download size={17} />
  Download CSV
</button>
          </div>
        </div>

        {filter === "CUSTOM" && (
          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* CARDS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Total Complaints"
          value={total}
          icon={<FileText size={25} />}
        />

        <Card
          title="New"
          value={newCount}
          icon={<MessageSquareWarning size={25} />}
        />

        <Card
          title="In Progress"
          value={inProgress}
          icon={<Clock3 size={25} />}
        />

        <Card
          title="Resolved / Closed"
          value={resolved + closed}
          icon={<CheckCircle2 size={25} />}
        />
      </div>

      {/* ANALYTICS */}
      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Resolution Rate
          </p>

          <p className="mt-3 text-4xl font-bold">
            {resolutionRate}%
          </p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${resolutionRate}%`,
              }}
            />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            {resolved + closed} of {total} resolved or closed.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <UsersRound className="text-blue-600" />

          <p className="mt-5 text-sm text-slate-500">
            Identified Complaints
          </p>

          <p className="mt-2 text-4xl font-bold">
            {identified}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <UserRound className="text-violet-600" />

          <p className="mt-5 text-sm text-slate-500">
            Anonymous Complaints
          </p>

          <p className="mt-2 text-4xl font-bold">
            {anonymous}
          </p>
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">
          Status Breakdown
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusBox label="New" value={newCount} />
          <StatusBox
            label="In Progress"
            value={inProgress}
          />
          <StatusBox
            label="Resolved"
            value={resolved}
          />
          <StatusBox
            label="Closed"
            value={closed}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold">
              Detailed Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Data for the selected report period.
            </p>
          </div>

          <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">
            {total} Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Submitted By</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/complaints/${complaint.id}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {complaint.referenceNo}
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {complaint.isAnonymous
                      ? "Anonymous"
                      : complaint.fullName || "Not provided"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {complaint.subject}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold">
                    {complaint.status.replace(
                      "_",
                      " "
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(
                      complaint.createdAt
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-14 text-center text-slate-500"
                  >
                    No complaints found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold">
            {value}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBox({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}