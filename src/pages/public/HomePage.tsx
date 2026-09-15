import { Link } from "react-router-dom";
import { Search, Building2, Users, Briefcase, ArrowRight, CheckCircle2, Quote, ShieldCheck, Zap } from "lucide-react";
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

const highlights = [
  {
    icon: Zap,
    title: "Fast pipeline",
    description: "Move candidates from applied to hired without switching tools.",
  },
  {
    icon: ShieldCheck,
    title: "Built for both sides",
    description: "One workspace for candidates and recruiters, tailored to each role.",
  },
  {
    icon: CheckCircle2,
    title: "Nothing falls through",
    description: "Every application, interview, and status change stays in one timeline.",
  },
];

const testimonials = [
  {
    quote:
      "I stopped juggling spreadsheets. Every applicant, every stage, in one place — hiring finally feels organized.",
    name: "Recruiter",
    role: "Hiring Manager",
  },
  {
    quote:
      "I could actually see where my application stood instead of guessing. That alone made the process less stressful.",
    name: "Candidate",
    role: "Software Engineer",
  },
];

export default function HomePage() {
  const { isAuthenticated, role } = useAuth();
  const dashboardPath = role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
              Hiring, simplified
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              Where great teams find great people.
            </h1>
            <p className="mt-4 max-w-lg text-base text-slate-600 dark:text-slate-400">
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
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <Icon className="mb-2 text-indigo-600" size={18} />
                  <p className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card !rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
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

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For candidates / recruiters */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">Built for both sides of hiring</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            One platform, tailored dashboards for candidates and recruiters.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
              <Users size={20} />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">For Candidates</h3>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Build your profile, upload your resume, apply in one click, and track every
              application and interview from a single dashboard.
            </p>
          </div>
          <div className="card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
              <Building2 size={20} />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">For Recruiters</h3>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Post jobs, manage applicants, shortlist candidates, and schedule interviews without
              leaving the platform.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">What people say</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.name} className="card">
              <Quote className="mb-3 text-indigo-200 dark:text-indigo-900" size={28} />
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{t.quote}</p>
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
                {t.name} <span className="font-normal text-slate-400">· {t.role}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="card !rounded-3xl flex flex-col items-center gap-4 bg-gradient-to-br from-indigo-600 to-indigo-700 p-10 text-center text-white shadow-xl shadow-indigo-200 dark:shadow-none">
          <h2 className="font-display text-2xl font-bold">Ready to get started?</h2>
          <p className="max-w-md text-sm text-indigo-100">
            Whether you're hiring or job hunting, HireTrack keeps everything in one place.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link to="/jobs" className="btn-secondary !bg-white !px-5 !py-3 text-sm !text-indigo-700">
              Browse Jobs
            </Link>
            <Link to="/register" className="btn-secondary !border-white/30 !bg-white/10 !px-5 !py-3 text-sm !text-white hover:!bg-white/20">
              Create an Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}