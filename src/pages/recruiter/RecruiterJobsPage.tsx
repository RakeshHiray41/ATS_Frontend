import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { PlusCircle, Pencil, Trash2, MapPin, Users } from "lucide-react";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import { deleteJob, getJobs, type Job } from "../../api/jobs";
import { getErrorMessage } from "../../api/axios";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load jobs"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!confirm("Delete this job? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success("Job deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete job"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your active and past job listings.</p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn-primary">
          <PlusCircle size={16} />
          Post a Job
        </Link>
      </div>

      {loading ? (
        <Loading label="Loading jobs..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs posted yet"
          description="Create your first job listing to start receiving applicants."
          action={
            <Link to="/recruiter/jobs/create" className="btn-primary">
              Post a Job
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <div key={job.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold text-slate-900">
                    {job.title}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} /> {job.location}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Link
                    to={`/recruiter/jobs/create?edit=${job.id}`}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                    title="Edit job"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Delete job"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-500">{job.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <Link
                  to={`/recruiter/applicants?job=${job.id}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <Users size={13} /> View applicants
                </Link>
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  Public view
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
