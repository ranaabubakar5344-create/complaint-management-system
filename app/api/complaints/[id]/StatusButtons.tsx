"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  complaintId: number;
  currentStatus: string;
};

export default function StatusButtons({
  complaintId,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/complaints/${complaintId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update status.");
        return;
      }

      router.refresh();
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const statuses = [
    {
      label: "New",
      value: "NEW",
    },
    {
      label: "In Progress",
      value: "IN_PROGRESS",
    },
    {
      label: "Resolved",
      value: "RESOLVED",
    },
    {
      label: "Closed",
      value: "CLOSED",
    },
  ];

  return (
    <div className="mt-8 border-t border-gray-200 pt-7">
      <p className="mb-3 text-sm font-medium text-gray-500">
        Update Status
      </p>

      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status.value}
            type="button"
            disabled={
              loading || currentStatus === status.value
            }
            onClick={() => updateStatus(status.value)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              currentStatus === status.value
                ? "bg-gray-900 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {loading
              ? "Updating..."
              : status.label}
          </button>
        ))}
      </div>
    </div>
  );
}