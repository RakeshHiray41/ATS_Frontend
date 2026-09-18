import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Briefcase, Wallet, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import { getJobById, getJobs, type Job } from "../../api/jobs";
import { applyToJob } from "../../api/applications";
import { getMyCandidateProfile } from "../../api/profile";
import { getErrorMessage } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, role } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getJobById(id);
        setJob(data);

        // Similar jobs: same company first, then same location — excluding this job.
        try {
          const all = await getJobs();
          const others = (Array.isArray(all) ? all : []).filter((j) => String(j.id) !== String(id));
          const sameCompany = others.filter((j) => String(j.company_id) === String(data.company_id));
          const sameLocation = others.filter(
            (j) => String(j.company_id) !== String(data.company_id) && j.location === data.location
          );
          setSimilarJobs([...sameCompany, ...sameLocation].slice(0, 3));
        } catch {
          // Similar jobs are a nice-to-have — fail silently if this lookup errors.
        }
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load job details"));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Match score, candidate-only: how many of the candidate's own listed
  // skills actually appear in this job's title/description. This is a
  // simple keyword overlap, not an AI-scored match — kept honest as such.
  useEffect(() => {
    if (!isAuthenticated || role !== "candidate") return;
    (async () => {
      try {
        const profile = await getMyCandidateProfile();
        const skills = Array.isArray(profile.skills)
          ? profile.skills
          : typeof profile.skills === "string"
          ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
        setCandidateSkills(skills);
      } catch {
        // No profile yet, or fetch failed — match score just won't show.
      }
    })();
  }, [isAuthenticated, role]);

  const matchScore = useMemo(() => {
    if (!job || candidateSkills.length === 0) return null;
    const haystack = `${job.title} ${job.description}`.toLowerCase();
    const matched = candidateSkills.filter((skill) => haystack.includes(skill.toLowerCase()));
    return {
      pct: Math.round((matched.length / candidateSkills.length) * 100),
      matched,
    };
  }, [job, candidateSkills]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800/60">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/jobs" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600">
          <ArrowLeft size={15} />
          Back to jobs
        </Link>

        {loading ? (
          <Loading label="Loading job details..." />
        ) : !job ? (
          <div className="card text-center text-sm text-slate-500 dark:text-slate-400">Job not found.</div>
        ) : (
          <div className="card">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 sm:flex-row sm:items-start">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Briefcase size={20} />
                </div>
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">{job.title}</h1>
                {job.company_name && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{job.company_name}</p>}
                {job.company_id && (
                  <Link
                    to={`/companies/${job.company_id}`}
                    className="mt-1 inline-block text-sm font-medium text-indigo-600 hover:underline"
                  >
                    View Company Profile
                  </Link>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">
                    <MapPin size={12} /> {job.location}
                  </span>
                  {job.job_type && (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">
                      <Briefcase size={12} /> {job.job_type}
                    </span>
                  )}
                  {(job.salary_min || job.salary_max) && (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">
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
              <h2 className="mb-2 font-display text-base font-semibold text-slate-900 dark:text-slate-50">Job Description</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">{job.description}</p>
            </div>

            {matchScore && (
              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    <Sparkles size={15} /> Skills match
                  </p>
                  <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{matchScore.pct}%</p>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${matchScore.pct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-indigo-600/80 dark:text-indigo-400/80">
                  {matchScore.matched.length > 0
                    ? `Based on your skills: ${matchScore.matched.join(", ")}`
                    : "None of your listed skills appear in this job's description."}
                </p>
              </div>
            )}
          </div>
        )}

        {similarJobs.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 font-display text-base font-semibold text-slate-900 dark:text-slate-50">Similar Jobs</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {similarJobs.map((sj) => (
                <Link
                  key={sj.id}
                  to={`/jobs/${sj.id}`}
                  className="card block transition hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Briefcase size={16} />
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{sj.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin size={11} /> {sj.location}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}