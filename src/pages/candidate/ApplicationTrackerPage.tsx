import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  UserCheck,
  CalendarClock,
  Mail,
  Check,
  X,
  Circle,
  MapPin,
} from "lucide-react";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import { getMyApplications, type Application } from "../../api/applications";
import { getErrorMessage } from "../../api/axios";

const STAGES = [
  { key: "applied", label: "Applied", icon: FileText },
  { key: "shortlisted", label: "Shortlisted", icon: UserCheck },
  { key: "interview_scheduled", label: "Interview", icon: CalendarClock },
  { key: "hired", label: "Decision / Offer", icon: Mail },
] as const;

export default function ApplicationTrackerPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const all = await getMyApplications();
        const found = all.find((a) => String(a.id) === String(applicationId)) ?? null;
        setApplication(found);
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load application"));
      } finally {
        setLoading(false);
      }
    })();
  }, [applicationId]);

  const status = (application?.status ?? "").toLowerCase();
  const isRejected = status === "rejected";
  const currentIndex = STAGES.findIndex((s) => s.key === status);

  return (
    <div className="mx-auto max-w-xl">
      <button
        onClick={() => navigate("/candidate/applications")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} /> Back to my applications
      </button>

      {loading ? (
        <Loading label="Loading application..." />
      ) : !application ? (
        <EmptyState
          title="Application not found"
          description="This application doesn't exist or has been removed."
          action={
            <Link to="/candidate/applications" className="btn-primary">
              Back to applications
            </Link>
          }
        />
      ) : (
        <div className="card">
          <div className="mb-6 border-b border-slate-100 pb-5">
            <h1 className="font-display text-xl font-bold text-slate-900">
              {application.job_title ?? `Job #${application.job_id}`}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              {application.job_location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} /> {application.job_location}
                </span>
              )}
              <span>
                Applied on{" "}
                {application.applied_at
                  ? new Date(application.applied_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>

          {isRejected ? (
            <>
              {/* Show the trail up to "applied" only — we don't track which
                  stage a candidate was in before being rejected. */}
              <div className="relative pl-10">
                <div className="absolute left-[15px] top-2 h-full w-0.5 bg-slate-200" />
                <TimelineStep index={1} icon={FileText} label="Applied" state="done" isLast={false} />
                <TimelineStep index={2} icon={X} label="Not selected" state="rejected" isLast />
              </div>
            </>
          ) : (
            <div className="relative pl-10">
              <div
                className="absolute left-[15px] top-2 w-0.5 bg-slate-200"
                style={{ height: `calc(100% - 2.5rem)` }}
              />
              {STAGES.map((stage, i) => {
                const state =
                  i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
                return (
                  <TimelineStep
                    key={stage.key}
                    index={i + 1}
                    icon={stage.icon}
                    label={stage.label}
                    state={state}
                    isLast={i === STAGES.length - 1}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TimelineStep({
  index,
  icon: Icon,
  label,
  state,
  isLast,
}: {
  index: number;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  state: "done" | "current" | "upcoming" | "rejected";
  isLast: boolean;
}) {
  const circleStyles =
    state === "done"
      ? "bg-indigo-600 border-indigo-600 text-white"
      : state === "current"
      ? "bg-white border-indigo-600 text-indigo-600"
      : state === "rejected"
      ? "bg-rose-600 border-rose-600 text-white"
      : "bg-white border-slate-200 text-slate-300";

  const cardStyles =
    state === "current"
      ? "border-indigo-200 bg-indigo-50/60"
      : state === "rejected"
      ? "border-rose-200 bg-rose-50/60"
      : "border-slate-100 bg-white";

  return (
    <div className={`relative ${isLast ? "" : "pb-6"}`}>
      <div
        className={`absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${circleStyles}`}
      >
        {state === "done" ? <Check size={14} /> : state === "rejected" ? <X size={14} /> : index}
      </div>

      <div className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${cardStyles}`}>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              state === "rejected" ? "bg-rose-100 text-rose-600" : "bg-white text-indigo-600 shadow-sm"
            }`}
          >
            <Icon size={16} />
          </div>
          <p className="font-semibold text-slate-800">{label}</p>
        </div>
        {state === "current" && (
          <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
            <Circle size={8} className="fill-indigo-600" /> Current stage
          </span>
        )}
      </div>
    </div>
  );
}