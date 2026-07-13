import { Link } from "react-router-dom";
import { Search, Building2, Users, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

const stats = [
  { label: "Live job openings", value: "1,200+", icon: Briefcase },
  { label: "Companies hiring", value: "340+", icon: Building2 },
  { label: "Candidates placed", value: "8,600+", icon: Users },
];

const steps = [
  "Create your profile and upload your resume",
  "Browse and apply to roles that fit you",
  "Track applications and interviews in one place",
];

export default function HomePage() {
  const { isAuthenticated, role } = useAuth();
  const dashboardPath = role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Hiring, simplified
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Where great teams find great people.
            </h1>
            <p className="mt-4 max-w-lg text-base text-slate-600">
              HireTrack connects candidates with the right roles and gives recruiters everything
              they need to run a hiring pipeline — from job posting to offer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/jobs" className="btn-primary !px-5 !py-3 text-sm">
                <Search size={16} />
                Browse Jobs
              </Link>
              {!isAuthenticated ? (
                <Link to="/register" className="btn-secondary !px-5 !py-3 text-sm">
                  Post a Job
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link to={dashboardPath} className="btn-secondary !px-5 !py-3 text-sm">
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
                  <Icon className="mb-2 text-indigo-600" size={18} />
                  <p className="font-display text-xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card !rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 text-white shadow-xl shadow-indigo-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">
              Your hiring journey
            </p>
            <div className="mt-5 space-y-4">
              {steps.map((step, i) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-indigo-50">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm">
              <CheckCircle2 size={16} />
              Real-time interview scheduling &amp; status tracking
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900">Built for both sides of hiring</h2>
          <p className="mt-2 text-sm text-slate-500">
            One platform, tailored dashboards for candidates and recruiters.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Users size={20} />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">For Candidates</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Build your profile, upload your resume, apply in one click, and track every
              application and interview from a single dashboard.
            </p>
          </div>
          <div className="card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Building2 size={20} />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">For Recruiters</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Post jobs, manage applicants, shortlist candidates, and schedule interviews without
              leaving the platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
