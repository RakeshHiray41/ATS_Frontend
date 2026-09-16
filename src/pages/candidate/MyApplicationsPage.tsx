import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, ExternalLink, Route as RouteIcon, Trash2 } from "lucide-react";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { getMyApplications, withdrawApplication, type Application } from "../../api/applications";
import { getErrorMessage } from "../../api/axios";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await withdrawApplication(toDelete.id);
      setApplications((prev) => prev.filter((a) => a.id !== toDelete.id));
      toast.success("Application withdrawn");
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not withdraw application"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">My Applications</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track the status of every job you've applied to.</p>
      </div>

      {loading ? (
        <Loading variant="table" rows={5} columns={5} />
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
              <thead className="sticky top-16 z-10 lg:top-0 bg-slate-50 dark:bg-slate-800/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Job Title</th>
                  <th className="px-5 py-3">Applied On</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Track</th>
                  <th className="px-5 py-3">Resume</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {app.job_title ?? `Job #${app.job_id}`}
                      {app.job_location && (
                        <span className="block text-xs font-normal text-slate-400">{app.job_location}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
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
                    <td className="px-5 py-4">
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
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setToDelete(app)}
                        title="Withdraw application"
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 size={13} /> 
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-fade-in dark:bg-slate-900">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              Withdraw this application?
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              You're about to withdraw your application for{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {toDelete.job_title ?? `Job #${toDelete.job_id}`}
              </span>
              . This can't be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setToDelete(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleConfirmDelete} disabled={deleting}>
                {deleting ? "Withdrawing..." : "Yes, withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}