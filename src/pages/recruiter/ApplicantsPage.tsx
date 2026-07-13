import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, ExternalLink, CheckCircle2, XCircle, CalendarPlus } from "lucide-react";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { getJobs, type Job } from "../../api/jobs";
import {
  getApplicationsByJob,
  updateApplicationStatus,
  type Application,
} from "../../api/applications";
import { createInterview } from "../../api/interviews";
import { getErrorMessage } from "../../api/axios";

export default function ApplicantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>(searchParams.get("job") ?? "");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [actioningId, setActioningId] = useState<string | number | null>(null);
  const [scheduleFor, setScheduleFor] = useState<Application | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getJobs();
        setJobs(Array.isArray(data) ? data : []);
        if (!selectedJob && data?.length) {
          setSelectedJob(String(data[0].id));
          setSearchParams({ job: String(data[0].id) });
        }
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load jobs"));
      } finally {
        setLoadingJobs(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedJob) return;
    (async () => {
      setLoadingApps(true);
      try {
        const data = await getApplicationsByJob(selectedJob);
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load applicants"));
      } finally {
        setLoadingApps(false);
      }
    })();
  }, [selectedJob]);

  const handleStatusChange = async (app: Application, status: string) => {
    setActioningId(app.id);
    try {
      await updateApplicationStatus(app.id, status);
      setApplications((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
      toast.success(`Candidate ${status === "shortlisted" ? "shortlisted" : "rejected"}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update status"));
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Applicants</h1>
        <p className="mt-1 text-sm text-slate-500">Review candidates and move them through your pipeline.</p>
      </div>

      {loadingJobs ? (
        <Loading label="Loading jobs..." />
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs yet" description="Post a job to start receiving applicants." />
      ) : (
        <>
          <div className="mb-5 max-w-sm">
            <label className="label-field">Select job</label>
            <select
              className="input-field"
              value={selectedJob}
              onChange={(e) => {
                setSelectedJob(e.target.value);
                setSearchParams({ job: e.target.value });
              }}
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          {loadingApps ? (
            <Loading label="Loading applicants..." />
          ) : applications.length === 0 ? (
            <EmptyState title="No applicants yet" description="Candidates who apply to this job will show up here." />
          ) : (
            <div className="card !p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Candidate Name</th>
                      <th className="px-5 py-3">Email</th>
                      <th className="px-5 py-3">Resume</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="transition hover:bg-slate-50/60">
                        <td className="px-5 py-4 font-medium text-slate-800">
                          {app.candidate_name ?? `Candidate #${app.candidate_id}`}
                        </td>
                        <td className="px-5 py-4 text-slate-500">{app.candidate_email ?? "—"}</td>
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
                        <td className="px-5 py-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1.5">
                            <button
                              title="Shortlist"
                              disabled={actioningId === app.id}
                              onClick={() => handleStatusChange(app, "shortlisted")}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              title="Reject"
                              disabled={actioningId === app.id}
                              onClick={() => handleStatusChange(app, "rejected")}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                            >
                              <XCircle size={16} />
                            </button>
                            <button
                              title="Schedule interview"
                              onClick={() => setScheduleFor(app)}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                            >
                              <CalendarPlus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
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