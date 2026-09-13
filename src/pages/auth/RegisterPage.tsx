import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, User as UserIcon, Users2, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Role } from "../../api/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "candidate" as Role,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const role = await register(form);
      navigate(role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");
    } catch {
      // toast handled in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Briefcase size={22} />
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Find your next hire or your next role</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "candidate" })}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-sm font-medium transition ${
                    form.role === "candidate"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Users2 size={18} />
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "recruiter" })}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-sm font-medium transition ${
                    form.role === "recruiter"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Building2 size={18} />
                  Recruiter
                </button>
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="name">
                Full name
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  id="name"
                  required
                  placeholder="Jordan Smith"
                  className="input-field !pl-10"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="input-field !pl-10"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="input-field !pl-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full !py-2.5">
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
