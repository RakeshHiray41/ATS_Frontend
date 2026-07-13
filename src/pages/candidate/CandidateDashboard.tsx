import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, CalendarClock, Star, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { getCandidateDashboard, type CandidateDashboardStats } from "../../api/dashboard";
import { getErrorMessage } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const cardConfig = [
  { key: "applied_jobs", label: "Applied Jobs", icon: Briefcase, color: "bg-indigo-50 text-indigo-600" },
  { key: "interviews", label: "Interviews", icon: CalendarClock, color: "bg-amber-50 text-amber-600" },
  { key: "shortlisted", label: "Shortlisted", icon: Star, color: "bg-emerald-50 text-emerald-600" },
] as const;

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CandidateDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCandidateDashboard();
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
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here's what's happening with your job search.</p>
        </div>
        <Link to="/jobs" className="btn-primary">
          Browse Jobs
          <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <Loading label="Loading dashboard..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {cardConfig.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="card">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon size={20} />
              </div>
              <p className="font-display text-3xl font-bold text-slate-900">{stats?.[key] ?? 0}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/candidate/applications" className="card flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">My Applications</h3>
            <p className="mt-1 text-sm text-slate-500">Track the status of every job you've applied to.</p>
          </div>
          <ArrowRight className="text-indigo-600" size={18} />
        </Link>
        <Link to="/candidate/interviews" className="card flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">My Interviews</h3>
            <p className="mt-1 text-sm text-slate-500">See upcoming interviews and meeting links.</p>
          </div>
          <ArrowRight className="text-indigo-600" size={18} />
        </Link>
      </div>
    </div>
  );
}
