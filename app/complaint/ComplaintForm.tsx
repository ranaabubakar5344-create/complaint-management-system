"use client";

import { FormEvent, useState } from "react";

type ComplaintFormProps = {
  organizationName: string;
  systemTitle: string;
  allowAnonymous: boolean;
  requirePhone: boolean;
};

export default function ComplaintForm({
  organizationName,
  systemTitle,
  allowAnonymous,
  requirePhone,
}: ComplaintFormProps) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setReferenceNo("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: isAnonymous ? null : formData.get("fullName"),
      email: isAnonymous ? null : formData.get("email"),
      phone: isAnonymous ? null : formData.get("phone"),
      subject: formData.get("subject"),
      description: formData.get("description"),
      isAnonymous,
    };

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to submit complaint.");
        return;
      }

      setReferenceNo(data.referenceNo);
      form.reset();
      setIsAnonymous(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (referenceNo) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">✅</div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Submitted Successfully
          </h1>

          <p className="mt-3 text-gray-600">
            Your complaint or suggestion has been received successfully.
          </p>

          <div className="mt-6 rounded-xl bg-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Reference Number
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {referenceNo}
            </p>
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Please keep this reference number for future tracking.
          </p>

          <button
            onClick={() => setReferenceNo("")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Submit Another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {organizationName}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {systemTitle}
          </h1>

          <p className="mt-2 text-gray-600">
            Please provide the details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {allowAnonymous && (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-5 w-5"
              />

              <div>
                <p className="font-semibold text-gray-900">
                  Submit anonymously
                </p>

                <p className="text-sm text-gray-500">
                  Your name and contact details will not be required.
                </p>
              </div>
            </label>
          )}

          {!isAnonymous && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Phone Number
                  {requirePhone && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>

                <input
                  type="tel"
                  name="phone"
                  required={requirePhone}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Subject
            </label>

            <input
              type="text"
              name="subject"
              required
              placeholder="Enter subject"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Details
            </label>

            <textarea
              name="description"
              required
              rows={6}
              placeholder="Please describe your complaint or suggestion..."
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}