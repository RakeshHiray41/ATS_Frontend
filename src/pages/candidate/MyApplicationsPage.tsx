import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, ExternalLink, Route as RouteIcon } from "lucide-react";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { getMyApplications, type Application } from "../../api/applications";
import { getErrorMessage } from "../../api/axios";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load applications"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="mt-1 text-sm text-slate-500">Track the status of every job you've applied to.</p>
      </div>

      {loading ? (
        <Loading label="Loading applications..." />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Once you apply to a job, it will show up here."
          action={
            <Link to="/jobs" className="btn-primary">
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Job Title</th>
                  <th className="px-5 py-3">Applied On</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Track</th>
                  <th className="px-5 py-3 text-right">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {app.job_title ?? `Job #${app.job_id}`}
                      {app.job_location && (
                        <span className="block text-xs font-normal text-slate-400">{app.job_location}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/candidate/applications/${app.id}/track`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        <RouteIcon size={13} /> Track
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {app.resume_url ? (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                        >
                          <FileText size={13} /> View <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}