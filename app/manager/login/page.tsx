"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function ManagerLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/manager/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to login."
        );
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] px-4 py-10">
      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:grid-cols-2">

    {/* LEFT SIDE */}
<div className="hidden bg-[#eeeeee] p-12 text-slate-900 lg:flex lg:flex-col lg:justify-between">

  <div>
    {/* FTSC LOGO */}
    <div className="mb-8">
      <img
        src="/logo.png"
        alt="Future Training and Services Center - Abu Dhabi"
        className="h-auto w-[220px] object-contain"
      />
    </div>

    {/* HEADING */}
    <h1 className="text-4xl font-bold uppercase leading-tight text-black">
  Future Training &
  <br />

  <span className="text-[#e5110a]">
    Services Center -
    <br />
    Abu Dhabi
  </span>
</h1>

    {/* GOLD LINE */}

    {/* SYSTEM TITLE */}
    <div className="mt-8 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b2f67] text-white">
        <ShieldCheck size={22} />
      </div>

      <div>
        <p className="text-lg font-bold text-[#0b2f67]">
          Complaints & Suggestions
        </p>

        <p className="mt-1 text-sm font-medium text-slate-600">
          Management System
        </p>
      </div>
    </div>

    {/* DESCRIPTION */}
    <p className="mt-7 max-w-sm text-sm leading-7 text-slate-600">
      Secure manager access for authorized FTSC staff to
      review, track and manage complaints and suggestions
      efficiently.
    </p>
  </div>

  {/* BOTTOM */}
  <div className="flex items-center gap-2 border-t border-slate-300 pt-6 text-xs font-medium text-slate-500">
    <ShieldCheck
      size={16}
      className="text-[#0b2f67]"
    />

    Authorized FTSC personnel only
  </div>
</div>

        {/* LOGIN */}
        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck size={25} />
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access the manager dashboard.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
              noValidate
            >
              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(
                        e.target.value
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    autoComplete="email"
                    placeholder="manager@company.com"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(
                        e.target.value
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            <div className="mt-7 border-t border-slate-100 pt-6">
              <p className="text-center text-xs leading-5 text-slate-400">
                This area is restricted to authorized
                managers. Login activity may be monitored
                for security purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}