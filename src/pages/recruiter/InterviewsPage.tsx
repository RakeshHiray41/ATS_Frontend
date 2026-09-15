import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalendarClock, Link2, User, Briefcase, List, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
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

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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

  // Build the calendar grid for the current month (Sun-start).
  const calendarDays = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [monthCursor]);

  const interviewsByDay = useMemo(() => {
    const map = new Map<string, Interview[]>();
    interviews.forEach((iv) => {
      const d = new Date(iv.interview_date);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map.set(key, [...(map.get(key) ?? []), iv]);
    });
    return map;
  }, [interviews]);

  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const selectedDayInterviews = selectedDay ? interviewsByDay.get(dayKey(selectedDay)) ?? [] : [];
  const today = new Date();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Interviews</h1>
          <p className="mt-1 text-sm text-slate-500">All interviews scheduled across your job openings.</p>
        </div>
        <div className="flex overflow-hidden rounded-lg border border-slate-200">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${
              view === "list" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <List size={14} /> List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${
              view === "calendar" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <CalendarDays size={14} /> Calendar
          </button>
        </div>
      </div>

      {loading ? (
        <Loading label="Loading interviews..." />
      ) : interviews.length === 0 ? (
        <EmptyState
          title="No interviews scheduled"
          description="Schedule an interview from the Applicants page to see it here."
        />
      ) : view === "list" ? (
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
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <ChevronLeft size={18} />
              </button>
              <p className="font-display text-base font-semibold text-slate-900">
                {monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </p>
              <button
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (!day) return <div key={i} className="aspect-square" />;
                const dayInterviews = interviewsByDay.get(dayKey(day)) ?? [];
                const isToday = isSameDay(day, today);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(day)}
                    className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border text-xs transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50"
                        : isToday
                        ? "border-indigo-200 bg-white"
                        : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <span className={`font-medium ${isToday ? "text-indigo-600" : "text-slate-700"}`}>
                      {day.getDate()}
                    </span>
                    {dayInterviews.length > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              {selectedDay
                ? selectedDay.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })
                : "Select a day"}
            </p>
            {!selectedDay ? (
              <p className="text-sm text-slate-400">Click a date to see its interviews.</p>
            ) : selectedDayInterviews.length === 0 ? (
              <p className="text-sm text-slate-400">No interviews this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedDayInterviews.map((iv) => {
                  const { time } = formatDateTime(iv.interview_date);
                  return (
                    <div key={iv.id} className="rounded-xl border border-slate-100 p-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {iv.candidate_name ?? `Application #${iv.application_id}`}
                      </p>
                      <p className="text-xs text-slate-500">{iv.job_title ?? "—"}</p>
                      <p className="mt-1 text-xs font-medium text-indigo-600">{time}</p>
                      {iv.meeting_link && (
                        <a
                          href={iv.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                        >
                          <Link2 size={12} /> Join
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}