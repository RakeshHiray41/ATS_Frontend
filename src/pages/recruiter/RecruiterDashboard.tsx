import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Users, CalendarClock, Building2, PlusCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { getRecruiterDashboard, type RecruiterDashboardStats } from "../../api/dashboard";
import { getErrorMessage } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const cardConfig = [
  { key: "total_jobs", label: "Total Jobs", icon: ListChecks, color: "bg-indigo-50 text-indigo-600" },
  { key: "applicants", label: "Applicants", icon: Users, color: "bg-emerald-50 text-emerald-600" },
  { key: "interviews", label: "Interviews", icon: CalendarClock, color: "bg-amber-50 text-amber-600" },
] as const;

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<RecruiterDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecruiterDashboard();
        setStats(data);
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load dashboard"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here's how your hiring pipeline is doing.</p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn-primary">
          <PlusCircle size={16} />
          Post a Job
        </Link>
      </div>

      {loading ? (
        <Loading variant="cards" cardCount={3} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cardConfig.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="card">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon size={20} />
              </div>
              <p className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50">{stats?.[key] ?? 0}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
          {stats?.company ? (
            <div className="card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <Building2 size={20} />
              </div>
              <p className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 truncate">
                {stats.company}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Company</p>
            </div>
          ) : (
            <Link
              to="/recruiter/company"
              className="card flex flex-col justify-between border-dashed border-amber-200 bg-amber-50/40 transition hover:border-amber-300 hover:bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/10 dark:hover:bg-amber-950/20"
            >
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <Building2 size={20} />
                </div>
                <p className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                  Company not set up
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Candidates can't see who's hiring yet.
                </p>
              </div>
              <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                Set up now <ArrowRight size={14} />
              </p>
            </Link>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link to="/recruiter/jobs" className="card flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50">Manage Jobs</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Edit or remove your active listings.</p>
          </div>
          <ArrowRight className="text-indigo-600" size={18} />
        </Link>
        <Link to="/recruiter/applicants" className="card flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50">Applicants</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review and shortlist candidates.</p>
          </div>
          <ArrowRight className="text-indigo-600" size={18} />
        </Link>
        <Link to="/recruiter/interviews" className="card flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50">Interviews</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Schedule and track interviews.</p>
          </div>
          <ArrowRight className="text-indigo-600" size={18} />
        </Link>
      </div>
    </div>
  );
}