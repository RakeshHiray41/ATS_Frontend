import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarClock, Clock, Link2, Briefcase } from "lucide-react";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import { getMyInterviews, type Interview } from "../../api/interviews";
import { getErrorMessage } from "../../api/axios";

function formatInterviewDate(isoString: string) {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return { date: "—", time: "—" };

  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date, time };
}

export default function MyInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyInterviews();
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
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">My Interviews</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your upcoming interviews and meeting details.</p>
      </div>

      {loading ? (
        <Loading variant="cards" cardCount={3} />
      ) : interviews.length === 0 ? (
        <EmptyState
          title="No interviews scheduled"
          description="When a recruiter schedules an interview with you, it will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {interviews.map((iv) => {
            const { date, time } = formatInterviewDate(iv.interview_date);
            return (
              <div key={iv.id} className="card">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <CalendarClock size={18} />
                </div>
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-slate-400" />
                  {iv.job_title ?? `Job #${iv.application_id}`}
                </h3>
                {iv.company_name && (
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{iv.company_name}</p>
                )}
                <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-2">
                    <CalendarClock size={14} className="text-slate-400" /> {date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" /> {time}
                  </p>
                  {iv.meeting_link && (
                    <a
                      href={iv.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 font-medium text-indigo-600 hover:underline"
                    >
                      <Link2 size={14} /> Join meeting
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}