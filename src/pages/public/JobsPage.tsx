import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import { getJobs, searchJobs, type Job } from "../../api/jobs";
import { getErrorMessage } from "../../api/axios";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const hasFilters = title.trim() || location.trim();
      const data = hasFilters
        ? await searchJobs({ title: title.trim() || undefined, location: location.trim() || undefined })
        : await getJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load jobs"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl font-bold text-slate-900">Browse Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">Discover roles from companies actively hiring.</p>

          <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                placeholder="Job title or keyword"
                className="input-field !pl-10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                placeholder="Location"
                className="input-field !pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary !px-6">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <Loading label="Fetching jobs..." />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No jobs found"
            description="Try adjusting your search filters or check back later for new openings."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="card group flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Briefcase size={18} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-slate-900 group-hover:text-indigo-600">
                    {job.title}
                  </h3>
                  {job.company_name && (
                    <p className="mt-0.5 text-sm text-slate-500">{job.company_name}</p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{job.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <MapPin size={13} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                    View <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
