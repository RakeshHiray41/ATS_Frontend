import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  FileText,
  ExternalLink,
  MoreVertical,
  CalendarPlus,
  User as UserIcon,
} from "lucide-react";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import {
  getAllApplicationsForRecruiter,
  updateApplicationStatus,
  type Application,
  type ApplicationStatus,
} from "../../api/applications";
import { createInterview } from "../../api/interviews";
import { getErrorMessage } from "../../api/axios";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "applied",
  "shortlisted",
  "interview_scheduled",
  "hired",
  "rejected",
];

function formatStatusLabel(status: string) {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ApplicantsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vacancyFilter, setVacancyFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [scheduleFor, setScheduleFor] = useState<Application | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await getAllApplicationsForRecruiter();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load applicants"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Real vacancy list, built from the applications we actually have.
  const vacancies = useMemo(() => {
    const map = new Map<string, string>();
    applications.forEach((app) => {
      if (app.job_id != null) map.set(String(app.job_id), app.job_title ?? `Job #${app.job_id}`);
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [applications]);

  // Real stage counts, computed from the current data — not hardcoded.
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((app) => {
      const key = (app.status ?? "unknown").toLowerCase();
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return counts;
  }, [applications]);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (vacancyFilter !== "all" && String(app.job_id) !== vacancyFilter) return false;
      if (stageFilter !== "all" && (app.status ?? "").toLowerCase() !== stageFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = `${app.candidate_name ?? ""} ${app.candidate_email ?? ""} ${app.job_title ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [applications, vacancyFilter, stageFilter, search]);

  const handleStatusChange = async (app: Application, status: string) => {
    setUpdatingId(app.id);
    try {
      await updateApplicationStatus(app.id, status);
      setApplications((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
      toast.success("Stage updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update status"));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Applicants</h1>
        <p className="mt-1 text-sm text-slate-500">Review candidates and move them through your pipeline.</p>
      </div>

      {loading ? (
        <Loading label="Loading applicants..." />
      ) : applications.length === 0 ? (
        <EmptyState title="No applicants yet" description="Candidates who apply to your jobs will show up here." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          {/* Sidebar: vacancy + stage filters */}
          <div className="space-y-4">
            <div>
              <label className="label-field">Vacancy</label>
              <select
                className="input-field"
                value={vacancyFilter}
                onChange={(e) => setVacancyFilter(e.target.value)}
              >
                <option value="all">All Vacancies</option>
                {vacancies.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="card !p-2">
              <button
                onClick={() => setStageFilter("all")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                  stageFilter === "all" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All Candidates</span>
                <span className="text-xs font-semibold text-slate-400">{applications.length}</span>
              </button>
              {Object.entries(stageCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setStageFilter(status)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                    stageFilter === status ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{formatStatusLabel(status)}</span>
                  <span className="text-xs font-semibold text-slate-400">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main list */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-700">
                ({filtered.length}) Candidates Found
              </p>
              <div className="relative w-full max-w-xs">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-field !pl-9"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState title="No matching candidates" description="Try a different search or filter." />
            ) : (
              <div className="card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Candidate</th>
                        <th className="px-5 py-3">Email</th>
                        <th className="px-5 py-3">Contact Number</th>
                        <th className="px-5 py-3">Date Applied</th>
                        <th className="px-5 py-3">Stage</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((app) => (
                        <tr key={app.id} className="transition hover:bg-slate-50/60">
                          <td className="px-5 py-4">
                            <button
                              onClick={() =>
                                navigate(`/recruiter/applicants/${app.candidate_id}?job=${app.job_id}`, {
                                  state: { application: app, jobTitle: app.job_title },
                                })
                              }
                              className="flex items-center gap-3 text-left"
                            >
                              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-indigo-50">
                                {app.candidate_photo_url ? (
                                  <img
                                    src={app.candidate_photo_url}
                                    alt={app.candidate_name ?? "Candidate"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-indigo-400">
                                    {app.candidate_name ? (
                                      app.candidate_name.charAt(0).toUpperCase()
                                    ) : (
                                      <UserIcon size={16} />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800 hover:text-indigo-600 hover:underline">
                                  {app.candidate_name ?? `Candidate #${app.candidate_id}`}
                                </p>
                                <p className="text-xs text-slate-400">{app.job_title ?? "—"}</p>
                              </div>
                            </button>
                          </td>
                          <td className="px-5 py-4 text-slate-500">{app.candidate_email ?? "—"}</td>
                          <td className="px-5 py-4 text-slate-500">{app.candidate_phone ?? "—"}</td>
                          <td className="px-5 py-4 text-slate-500">
                            {app.applied_at
                              ? new Date(app.applied_at).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <select
                              className="input-field !w-auto !py-1.5 !text-xs"
                              value={app.status}
                              disabled={updatingId === app.id}
                              onChange={(e) => handleStatusChange(app, e.target.value)}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {formatStatusLabel(s)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-4">
                            <div className="relative flex justify-end">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                              >
                                <MoreVertical size={16} />
                              </button>
                              {openMenuId === app.id && (
                                <div
                                  className="absolute right-0 top-9 z-10 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg"
                                  onMouseLeave={() => setOpenMenuId(null)}
                                >
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      navigate(`/recruiter/applicants/${app.candidate_id}?job=${app.job_id}`, {
                                        state: { application: app, jobTitle: app.job_title },
                                      });
                                    }}
                                    className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                                  >
                                    <UserIcon size={14} /> View Profile
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setScheduleFor(app);
                                    }}
                                    className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                                  >
                                    <CalendarPlus size={14} /> Schedule Interview
                                  </button>
                                  {app.resume_url && (
                                    <a
                                      href={app.resume_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={() => setOpenMenuId(null)}
                                      className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                                    >
                                      <FileText size={14} /> View Resume <ExternalLink size={11} />
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {scheduleFor && (
        <ScheduleInterviewModal
          application={scheduleFor}
          onClose={() => setScheduleFor(null)}
          onScheduled={() =>
            setApplications((prev) =>
              prev.map((a) =>
                a.id === scheduleFor.id ? { ...a, status: "interview_scheduled" } : a
              )
            )
          }
        />
      )}
    </div>
  );
}

function ScheduleInterviewModal({
  application,
  onClose,
  onScheduled,
}: {
  application: Application;
  onClose: () => void;
  onScheduled: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      toast.error("Please select both date and time");
      return;
    }
    if (!link) {
      toast.error("Meeting link is required");
      return;
    }

    // Backend needs a single ISO datetime, not separate date/time fields.
    const interview_date = new Date(`${date}T${time}`).toISOString();

    setSubmitting(true);
    try {
      await createInterview({
        application_id: application.id,
        interview_date,
        meeting_link: link,
      });
      toast.success("Interview scheduled");
      onScheduled();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not schedule interview"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
        <h2 className="font-display text-lg font-bold text-slate-900">Schedule Interview</h2>
        <p className="mt-1 text-sm text-slate-500">
          With {application.candidate_name ?? `Candidate #${application.candidate_id}`}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Date</label>
              <input
                type="date"
                required
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Time</label>
              <input
                type="time"
                required
                className="input-field"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label-field">Meeting link</label>
            <input
              type="url"
              required
              placeholder="https://meet.google.com/..."
              className="input-field"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}