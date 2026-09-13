import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Briefcase, Wallet, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import { getJobById, type Job } from "../../api/jobs";
import { applyToJob } from "../../api/applications";
import { getErrorMessage } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, role } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load job details"));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setApplying(true);
    try {
      await applyToJob(id);
      setApplied(true);
      toast.success("Application submitted!");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not submit application"));
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/jobs" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600">
          <ArrowLeft size={15} />
          Back to jobs
        </Link>

        {loading ? (
          <Loading label="Loading job details..." />
        ) : !job ? (
          <div className="card text-center text-sm text-slate-500">Job not found.</div>
        ) : (
          <div className="card">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Briefcase size={20} />
                </div>
                <h1 className="font-display text-2xl font-bold text-slate-900">{job.title}</h1>
                {job.company_name && <p className="mt-1 text-sm text-slate-500">{job.company_name}</p>}
                {job.company_id && (
                  <Link
                    to={`/companies/${job.company_id}`}
                    className="mt-1 inline-block text-sm font-medium text-indigo-600 hover:underline"
                  >
                    View Company Profile
                  </Link>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                    <MapPin size={12} /> {job.location}
                  </span>
                  {job.job_type && (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                      <Briefcase size={12} /> {job.job_type}
                    </span>
                  )}
                  {(job.salary_min || job.salary_max) && (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                      <Wallet size={12} />
                      {job.salary_min ?? "—"} - {job.salary_max ?? "—"}
                    </span>
                  )}
                </div>
              </div>

              {!isAuthenticated ? (
                <Link to="/login" className="btn-primary shrink-0">
                  Login to Apply
                </Link>
              ) : role === "candidate" ? (
                <button
                  onClick={handleApply}
                  disabled={applying || applied}
                  className="btn-primary shrink-0"
                >
                  {applied ? (
                    <>
                      <CheckCircle2 size={16} /> Applied
                    </>
                  ) : applying ? (
                    "Applying..."
                  ) : (
                    "Apply Now"
                  )}
                </button>
              ) : null}
            </div>

            <div className="pt-6">
              <h2 className="mb-2 font-display text-base font-semibold text-slate-900">Job Description</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{job.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}