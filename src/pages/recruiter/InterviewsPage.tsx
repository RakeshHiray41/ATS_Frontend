import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarClock, Link2, User, Briefcase } from "lucide-react";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import { getInterviews, type Interview } from "../../api/interviews";
import { getErrorMessage } from "../../api/axios";

function formatDateTime(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return { date: value, time: "" };
  return {
    date: d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getInterviews();
        setInterviews(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load interviews"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Interviews</h1>
        <p className="mt-1 text-sm text-slate-500">All interviews scheduled across your job openings.</p>
      </div>

      {loading ? (
        <Loading label="Loading interviews..." />
      ) : interviews.length === 0 ? (
        <EmptyState
          title="No interviews scheduled"
          description="Schedule an interview from the Applicants page to see it here."
        />
      ) : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-5 py-3">Job</th>
                  <th className="px-5 py-3">Date &amp; Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Meeting Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interviews.map((iv) => {
                  const { date, time } = formatDateTime(iv.interview_date);
                  return (
                    <tr key={iv.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-4 font-medium text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <User size={14} className="text-slate-400" />
                          {iv.candidate_name ?? `Application #${iv.application_id}`}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-slate-400" />
                          {iv.job_title ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <CalendarClock size={14} className="text-slate-400" />
                          {date} {time && `· ${time}`}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          {iv.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {iv.meeting_link ? (
                          <a
                            href={iv.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                          >
                            <Link2 size={13} /> Join
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}