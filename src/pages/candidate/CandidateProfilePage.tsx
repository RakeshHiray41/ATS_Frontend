import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import ResumeUpload from "../../components/ResumeUpload";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";
import {
  createCandidateProfile,
  getMyCandidateProfile,
  getMyUser,
  updateCandidateProfile,
  updateMyUser,
  deleteMyAccount,
  type CandidateProfile,
} from "../../api/profile";
import { getErrorMessage } from "../../api/axios";

const emptyForm: CandidateProfile = {
  full_name: "",
  phone: "",
  bio: "",
  skills: "",
  experience: "",
  github_url: "",
  linkedin_url: "",
};

export default function CandidateProfilePage() {
  const [form, setForm] = useState<CandidateProfile>(emptyForm);
  const [initialFullName, setInitialFullName] = useState("");
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const loadProfile = async () => {
    try {
      const user = await getMyUser();

      let profileData: CandidateProfile = {};
      let profileExists = true;
      try {
        profileData = await getMyCandidateProfile();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          profileExists = false;
        } else {
          throw err;
        }
      }

      setForm({
        ...emptyForm,
        ...profileData,
        full_name: user.full_name,
        skills: Array.isArray(profileData.skills)
          ? profileData.skills.join(", ")
          : profileData.skills ?? "",
      });
      setInitialFullName(user.full_name);
      setExists(profileExists);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load profile"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const profilePayload: Partial<CandidateProfile> = {
      phone: form.phone || null,
      bio: form.bio || null,
      skills:
        typeof form.skills === "string"
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : form.skills,
      experience: form.experience || null,
      github_url: form.github_url?.trim() || null,
      linkedin_url: form.linkedin_url?.trim() || null,
    };

    try {
      if (form.full_name && form.full_name !== initialFullName) {
        await updateMyUser({ full_name: form.full_name });
      }

      if (exists) {
        await updateCandidateProfile(profilePayload);
      } else {
        await createCandidateProfile(profilePayload);
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      await loadProfile();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save profile"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteMyAccount();
      toast.success("Account deleted");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete account"));
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  if (loading) return <Loading label="Loading your profile..." />;

  const skillsList =
    typeof form.skills === "string"
      ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : form.skills ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Keep your profile up to date so recruiters can find the real you.
          </p>
        </div>
        {!isEditing && (
          <button className="btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="card mb-6">
        <ProfilePhotoUpload
          currentPhotoUrl={form.photo_url}
          onUploaded={(url) => setForm({ ...form, photo_url: url })}
        />
      </div>

      {!isEditing ? (
        <div className="card space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="label-field">Full name</p>
              <p className="text-slate-900">{form.full_name || "—"}</p>
            </div>
            <div>
              <p className="label-field">Phone number</p>
              <p className="text-slate-900">{form.phone || "—"}</p>
            </div>
          </div>

          <div>
            <p className="label-field">Bio</p>
            <p className="whitespace-pre-wrap text-slate-900">{form.bio || "—"}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
                <p className="text-slate-900">—</p>
              )}
            </div>
            <div>
              <p className="label-field">Experience</p>
              <p className="text-slate-900">{form.experience || "—"}</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="label-field">GitHub link</p>
              <p className="text-slate-900">{form.github_url || "—"}</p>
            </div>
            <div>
              <p className="label-field">LinkedIn link</p>
              <p className="text-slate-900">{form.linkedin_url || "—"}</p>
            </div>
          </div>

          <ResumeUpload
            currentResumeUrl={form.resume_url}
            onUploaded={(url) => setForm({ ...form, resume_url: url })}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label-field">Full name</label>
              <input
                className="input-field"
                required
                value={form.full_name ?? ""}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Phone number</label>
              <input
                className="input-field"
                value={form.phone ?? ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label-field">Bio</label>
            <textarea
              rows={4}
              className="input-field"
              placeholder="Tell recruiters a bit about yourself..."
              value={form.bio ?? ""}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label-field">Skills (comma separated)</label>
              <input
                className="input-field"
                placeholder="React, TypeScript, Node.js"
                value={form.skills as string}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Experience</label>
              <input
                className="input-field"
                placeholder="e.g. 2 years"
                value={form.experience ?? ""}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label-field">GitHub link</label>
              <input
                className="input-field"
                type="text"
                placeholder="github.com/yourusername"
                value={form.github_url ?? ""}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">LinkedIn link</label>
              <input
                className="input-field"
                type="text"
                placeholder="linkedin.com/in/yourusername"
                value={form.linkedin_url ?? ""}
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              />
            </div>
          </div>

          <ResumeUpload
            currentResumeUrl={form.resume_url}
            onUploaded={(url) => setForm({ ...form, resume_url: url })}
          />

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsEditing(false);
                loadProfile();
              }}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : exists ? "Update Profile" : "Create Profile"}
            </button>
          </div>
        </form>
      )}

      <div className="card mt-6 border border-red-100">
        <h2 className="font-display text-lg font-semibold text-red-700">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-500">
          Deleting your account is permanent. All your profile data will be removed and cannot be recovered.
        </p>

        {!confirmingDelete ? (
          <button
            className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            onClick={() => setConfirmingDelete(true)}
          >
            Delete Account
          </button>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <p className="text-sm font-medium text-red-700">Are you sure? This cannot be undone.</p>
            <button
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete my account"}
            </button>
            <button
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}