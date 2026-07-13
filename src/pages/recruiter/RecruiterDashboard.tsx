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
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here's how your hiring pipeline is doing.</p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn-primary">
          <PlusCircle size={16} />
          Post a Job
        </Link>
      </div>

      {loading ? (
        <Loading label="Loading dashboard..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cardConfig.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="card">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon size={20} />
              </div>
              <p className="font-display text-3xl font-bold text-slate-900">{stats?.[key] ?? 0}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
          <div className="card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Building2 size={20} />
            </div>
            <p className="font-display text-lg font-bold text-slate-900 truncate">
              {stats?.company ?? "Not set up"}
            </p>
            <p className="mt-1 text-sm text-slate-500">Company</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link to="/recruiter/jobs" className="card flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">Manage Jobs</h3>
            <p className="mt-1 text-sm text-slate-500">Edit or remove your active listings.</p>
          </div>
          <ArrowRight className="text-indigo-600" size={18} />
        </Link>
        <Link to="/recruiter/applicants" className="card flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">Applicants</h3>
            <p className="mt-1 text-sm text-slate-500">Review and shortlist candidates.</p>
          </div>
          <ArrowRight className="text-indigo-600" size={18} />
        </Link>
        <Link to="/recruiter/interviews" className="card flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">Interviews</h3>
            <p className="mt-1 text-sm text-slate-500">Schedule and track interviews.</p>
          </div>
          <ArrowRight className="text-indigo-600" size={18} />
        </Link>
      </div>
    </div>
  );
}
