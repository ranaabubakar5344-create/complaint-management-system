"use client";

import Link from "next/link";
import { Search, MessageSquareWarning } from "lucide-react";
import { useMemo, useState } from "react";

type Complaint = {
  id: number;
  referenceNo: string;
  fullName: string | null;
  subject: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
};

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

export default function ComplaintsTable({
  complaints,
}: {
  complaints: Complaint[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const name = complaint.isAnonymous
        ? "anonymous"
        : complaint.fullName || "";

      const matchesSearch =
        !query ||
        complaint.referenceNo.toLowerCase().includes(query) ||
        name.toLowerCase().includes(query) ||
        complaint.subject.toLowerCase().includes(query);

      const matchesStatus =
        status === "ALL" || complaint.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, status]);

  return (
    <>
      {/* SEARCH + FILTER */}
      <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by reference, name or subject..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500 md:w-52"
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold">Complaints</h2>

            <p className="mt-1 text-sm text-slate-500">
              Search, review and manage submitted complaints.
            </p>
          </div>

          <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {filteredComplaints.length} Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/complaints/${complaint.id}`}
                      className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {complaint.referenceNo}
                    </Link>
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-slate-700">
                    {complaint.isAnonymous
                      ? "Anonymous"
                      : complaint.fullName || "Not provided"}
                  </td>

                  <td className="max-w-xs truncate px-6 py-5 text-sm text-slate-600">
                    {complaint.subject}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={complaint.status} />
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-500">
                    {new Date(complaint.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/admin/complaints/${complaint.id}`}
                      className="inline-flex rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredComplaints.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <MessageSquareWarning
                      size={38}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-4 font-semibold text-slate-700">
                      No complaints found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-500">
          Showing{" "}
          <strong className="text-slate-700">
            {filteredComplaints.length}
          </strong>{" "}
          of{" "}
          <strong className="text-slate-700">
            {complaints.length}
          </strong>{" "}
          complaints
        </div>
      </div>
    </>
  );
}