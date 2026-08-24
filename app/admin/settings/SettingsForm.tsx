"use client";

import { FormEvent, useState } from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  Link2,
  Mail,
  Save,
  Shield,
} from "lucide-react";

type Settings = {
  organizationName: string;
  systemTitle: string;
  notificationEmail: string | null;
  emailSenderName: string;
  complaintFormUrl: string | null;
  allowAnonymous: boolean;
  requirePhone: boolean;
};

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: Settings;
}) {
  const [form, setForm] = useState({
    organizationName: initialSettings.organizationName,
    systemTitle: initialSettings.systemTitle,
    notificationEmail: initialSettings.notificationEmail || "",
    emailSenderName: initialSettings.emailSenderName,
    complaintFormUrl: initialSettings.complaintFormUrl || "",
    allowAnonymous: initialSettings.allowAnonymous,
    requirePhone: initialSettings.requirePhone,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to save settings.");
        return;
      }

      setMessage("Settings saved successfully.");
    } catch {
      setError("Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={19} />
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ORGANIZATION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Building2 size={21} />
          </div>

          <div>
            <h2 className="font-bold">Organization</h2>
            <p className="text-sm text-slate-500">
              Configure your complaint management system identity.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Organization Name">
            <input
              required
              value={form.organizationName}
              onChange={(e) =>
                setForm({
                  ...form,
                  organizationName: e.target.value,
                })
              }
              className="input-style"
            />
          </Field>

          <Field label="System Title">
            <input
              required
              value={form.systemTitle}
              onChange={(e) =>
                setForm({
                  ...form,
                  systemTitle: e.target.value,
                })
              }
              className="input-style"
            />
          </Field>
        </div>
      </section>

      {/* EMAIL */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
            <Mail size={21} />
          </div>

          <div>
            <h2 className="font-bold">Email & Notifications</h2>
            <p className="text-sm text-slate-500">
              Configure complaint notification details.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Manager Notification Email">
            <input
              type="email"
              value={form.notificationEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  notificationEmail: e.target.value,
                })
              }
              placeholder="manager@company.com"
              className="input-style"
            />
          </Field>

          <Field label="Email Sender Name">
            <input
              value={form.emailSenderName}
              onChange={(e) =>
                setForm({
                  ...form,
                  emailSenderName: e.target.value,
                })
              }
              className="input-style"
            />
          </Field>
        </div>
      </section>

      {/* FORM SETTINGS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <Shield size={21} />
          </div>

          <div>
            <h2 className="font-bold">Complaint Form</h2>
            <p className="text-sm text-slate-500">
              Control how users can submit complaints.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Toggle
            title="Allow Anonymous Complaints"
            description="Users can submit without providing their identity."
            checked={form.allowAnonymous}
            onChange={(checked) =>
              setForm({
                ...form,
                allowAnonymous: checked,
              })
            }
          />

          <Toggle
            title="Require Phone Number"
            description="Phone number becomes mandatory for identified complaints."
            checked={form.requirePhone}
            onChange={(checked) =>
              setForm({
                ...form,
                requirePhone: checked,
              })
            }
          />
        </div>
      </section>

      {/* QR / URL */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Link2 size={21} />
          </div>

          <div>
            <h2 className="font-bold">Complaint Form URL</h2>
            <p className="text-sm text-slate-500">
              This URL can later be used to generate the QR code.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <input
            type="url"
            value={form.complaintFormUrl}
            onChange={(e) =>
              setForm({
                ...form,
                complaintFormUrl: e.target.value,
              })
            }
            placeholder="https://yourdomain.com/complaint"
            className="input-style"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <style jsx>{`
        .input-style {
          width: 100%;
          height: 48px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0 16px;
          outline: none;
        }

        .input-style:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px #eff6ff;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

function Toggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
      <div className="pr-4">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}