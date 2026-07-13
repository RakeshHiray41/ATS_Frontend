import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { createJob, getJobById, updateJob, type JobPayload } from "../../api/jobs";
import { getMyCompany } from "../../api/company";
import { getErrorMessage } from "../../api/axios";

const emptyForm: JobPayload = {
  title: "",
  description: "",
  location: "",
  experience: "",
  salary: "",
  company_id: "",
};

export default function CreateJobPage() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();

  const [form, setForm] = useState<JobPayload>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Recruiter's own company_id is required by the backend to create/update a job.
        const company = await getMyCompany();

        if (editId) {
          const job = await getJobById(editId);
          setForm({
            title: job.title,
            description: job.description,
            location: job.location,
            experience: job.experience,
            salary: job.salary,
            company_id: job.company_id,
          });
        } else {
          setForm({ ...emptyForm, company_id: company.id });
        }
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load job details"));
      } finally {
        setLoading(false);
      }
    })();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.company_id) {
      toast.error("You need to create a company profile before posting a job.");
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        await updateJob(editId, form);
        toast.success("Job updated successfully");
      } else {
        await createJob(form);
        toast.success("Job posted successfully");
      }
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save job"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Loading job..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          {editId ? "Edit Job" : "Post a Job"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {editId ? "Update the details of this listing." : "Fill in the details to publish a new listing."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label-field">Job title</label>
          <input
            required
            className="input-field"
            placeholder="e.g. Senior Frontend Engineer"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="label-field">Description</label>
          <textarea
            required
            rows={6}
            className="input-field"
            placeholder="Responsibilities, requirements, and benefits..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field">Location</label>
            <input
              required
              className="input-field"
              placeholder="City, Country or Remote"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Experience required</label>
            <input
              required
              className="input-field"
              placeholder="e.g. 2-4 years"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label-field">Salary</label>
          <input
            required
            className="input-field"
            placeholder="e.g. 50,000 - 80,000"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => navigate("/recruiter/jobs")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : editId ? "Update Job" : "Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
}