import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Globe, MapPin, Building2 } from "lucide-react";
import Loading from "../../components/Loading";
import CompanyLogoUpload from "../../components/CompanyLogoUpload";
import { createCompany, getMyCompany, updateCompany, deleteCompany, type Company } from "../../api/company";
import { getErrorMessage } from "../../api/axios";

const emptyForm: Partial<Company> = { name: "", description: "", website: "", location: "" };

export default function CompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<Partial<Company>>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const loadCompany = async () => {
    try {
      const data = await getMyCompany();
      setCompany(data);
      setForm(data);
      setIsEditing(false);
    } catch {
      setCompany(null);
      setForm(emptyForm);
      setIsEditing(true); // no company yet — go straight to the form
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (company?.id) {
        const updated = await updateCompany(company.id, form);
        setCompany(updated);
        toast.success("Company details updated");
      } else {
        const created = await createCompany({
          name: form.name ?? "",
          description: form.description,
          website: form.website,
          location: form.location,
        });
        setCompany(created);
        localStorage.setItem("company_id", String(created.id));
        toast.success("Company created successfully");
      }
      setIsEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save company"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!company?.id) return;
    setDeleting(true);
    try {
      await deleteCompany(company.id);
      toast.success("Company deleted");
      localStorage.removeItem("company_id");
      setCompany(null);
      setForm(emptyForm);
      setIsEditing(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete company"));
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  if (loading) return <Loading label="Loading company details..." />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">Company</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This is how candidates will see your company on job listings.
          </p>
        </div>
        {!isEditing && company?.id && (
          <button className="btn-primary" onClick={() => setIsEditing(true)}>
            Edit Company
          </button>
        )}
      </div>

      {company?.id && (
        <div className="card mb-6">
          <CompanyLogoUpload
            companyId={company.id}
            currentLogoUrl={company.logo_url}
            onUploaded={(url) => setCompany({ ...company, logo_url: url })}
          />
        </div>
      )}

      {!isEditing && company ? (
        <div className="card space-y-5">
          <div>
            <p className="label-field">Company name</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{company.name}</p>
          </div>

          <div>
            <p className="label-field">Description</p>
            <p className="whitespace-pre-wrap text-slate-900 dark:text-slate-200">
              {company.description || "—"}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="label-field">Website</p>
              {company.website ? (
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline"
                >
                  <Globe size={14} /> {company.website}
                </a>
              ) : (
                <p className="text-slate-900 dark:text-slate-200">—</p>
              )}
            </div>
            <div>
              <p className="label-field">Location</p>
              {company.location ? (
                <p className="flex items-center gap-1.5 text-slate-900 dark:text-slate-200">
                  <MapPin size={14} className="text-slate-400" /> {company.location}
                </p>
              ) : (
                <p className="text-slate-900 dark:text-slate-200">—</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
            {!confirmingDelete ? (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Delete Company
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Are you sure? This can't be undone.
                </p>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleting}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card space-y-5">
          {!company?.id && (
            <div className="mb-1 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300">
              <Building2 size={16} />
              Set up your company so candidates know who's hiring.
            </div>
          )}

          <div>
            <label className="label-field">Company name</label>
            <input
              required
              className="input-field"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label-field">Description</label>
            <textarea
              rows={4}
              className="input-field"
              placeholder="Tell candidates what makes your company great to work for..."
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label-field">Website</label>
              <input
                className="input-field"
                placeholder="https://yourcompany.com"
                value={form.website ?? ""}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Location</label>
              <input
                className="input-field"
                placeholder="City, Country"
                value={form.location ?? ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            {company?.id && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  loadCompany();
                }}
              >
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : company?.id ? "Update Company" : "Create Company"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}