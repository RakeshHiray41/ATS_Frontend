import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  GitFork,
  Link as LinkIcon,
} from "lucide-react";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import Avatar from "../../components/Avatar";
import {
  getCandidateProfileForRecruiter,
  type CandidateProfileWithUser,
} from "../../api/profile";
import type { Application } from "../../api/applications";
import { getErrorMessage } from "../../api/axios";

type TabKey = "details" | "resume" | "social" | "additional";

const TABS: { key: TabKey; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "resume", label: "Resume" },
  { key: "social", label: "Social Media Links" },
  { key: "additional", label: "Additional Information" },
];

export default function CandidateProfileViewPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Passed from the Applicants table when the recruiter clicked a row —
  // gives us job title / applied date / status without an extra fetch.
  const navState = (location.state ?? {}) as {
    application?: Application;
    jobTitle?: string;
  };

  const [profile, setProfile] = useState<CandidateProfileWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("details");

  const jobId = searchParams.get("job");

  useEffect(() => {
    if (!candidateId) return;
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getCandidateProfileForRecruiter(candidateId);
        setProfile(data);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error(getErrorMessage(err, "Could not load candidate profile"));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [candidateId]);

  const backHref = jobId ? `/recruiter/applicants?job=${jobId}` : "/recruiter/applicants";

  const skillsList = Array.isArray(profile?.skills)
    ? profile!.skills
    : typeof profile?.skills === "string"
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const appliedAtLabel = navState.application?.applied_at
    ? new Date(navState.application.applied_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto max-w-5xl">
      <button
        onClick={() => navigate(backHref)}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800"
      >
        <ArrowLeft size={16} /> Back to applicants
      </button>

      {loading ? (
        <Loading label="Loading candidate profile..." />
      ) : notFound ? (
        <EmptyState
          title="Profile not available"
          description="This candidate hasn't completed their profile yet."
        />
      ) : profile ? (
        <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
          {/* Left sidebar */}
          <div className="card flex flex-col items-center text-center">
            <Avatar name={profile.full_name} photoUrl={profile.photo_url} size="xl" className="ring-4 ring-white shadow-sm dark:ring-slate-800" />

            <h1 className="font-display mt-4 text-lg font-bold uppercase tracking-wide text-slate-900 dark:text-slate-50">
              {profile.full_name}
            </h1>
          </div>

          {/* Right: tabs + content */}
          <div className="card !p-0 min-w-0 overflow-hidden">
            <div className="flex gap-1 overflow-x-auto border-b border-slate-100 dark:border-slate-800 px-4 pt-3">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap rounded-t-lg px-3.5 py-2 text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "details" && (
                <div className="space-y-6">
                  {(navState.jobTitle || navState.application) && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Vacancy and Job Details
                      </p>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <p className="label-field">Job Title</p>
                          <p className="text-slate-900 dark:text-slate-50">{navState.jobTitle || "—"}</p>
                        </div>
                        <div>
                          <p className="label-field">Date of Application</p>
                          <p className="text-slate-900 dark:text-slate-50">{appliedAtLabel}</p>
                        </div>
                        <div>
                          <p className="label-field">Status</p>
                          {navState.application?.status ? (
                            <StatusBadge status={navState.application.status} />
                          ) : (
                            <p className="text-slate-900 dark:text-slate-50">—</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Personal Details
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="label-field">Full Name</p>
                        <p className="text-slate-900 dark:text-slate-50">{profile.full_name}</p>
                      </div>
                      <div>
                        <p className="label-field">Experience</p>
                        <p className="text-slate-900 dark:text-slate-50">{profile.experience || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Contact Details
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="label-field">Email</p>
                        <p className="text-slate-900 dark:text-slate-50">{profile.email}</p>
                      </div>
                      <div>
                        <p className="label-field">Contact Number</p>
                        <p className="text-slate-900 dark:text-slate-50">{profile.phone || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "resume" && (
                <div>
                  {profile.resume_url ? (
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                      <iframe
                        src={profile.resume_url}
                        title={`${profile.full_name}'s resume`}
                        className="h-[75vh] w-full"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No resume uploaded.</p>
                  )}
                </div>
              )}

              {activeTab === "social" && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Social Media Links
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="label-field">LinkedIn</p>
                      {profile.linkedin_url ? (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline"
                        >
                          <LinkIcon size={14} /> {profile.linkedin_url}
                        </a>
                      ) : (
                        <p className="text-slate-900 dark:text-slate-50">—</p>
                      )}
                    </div>
                    <div>
                      <p className="label-field">GitHub</p>
                      {profile.github_url ? (
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline"
                        >
                          <GitFork size={14} /> {profile.github_url}
                        </a>
                      ) : (
                        <p className="text-slate-900 dark:text-slate-50">—</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "additional" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="label-field">Bio</p>
                    <p className="whitespace-pre-wrap text-slate-900 dark:text-slate-50">{profile.bio || "—"}</p>
                  </div>
                  <div>
                    <p className="label-field">Skills</p>
                    {skillsList.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skillsList.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-900 dark:text-slate-50">—</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}