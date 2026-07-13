import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import CompanyLogoUpload from "../../components/CompanyLogoUpload";
import { createCompany, getMyCompany, updateCompany, deleteCompany, type Company } from "../../api/company";
import { getErrorMessage } from "../../api/axios";

const emptyForm: Partial<Company> = { name: "", description: "", website: "", location: "" };

export default function CompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<Partial<Company>>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyCompany();
        setCompany(data);
        setForm(data);
      } catch {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    })();
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save company"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!company?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your company? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteCompany(company.id);
      toast.success("Company deleted successfully");
      localStorage.removeItem("company_id");
      setCompany(null);
      setForm(emptyForm);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete company"));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading label="Loading company details..." />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Company</h1>
        <p className="mt-1 text-sm text-slate-500">
          This is how candidates will see your company on job listings.
        </p>
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

      <form onSubmit={handleSubmit} className="card space-y-5">
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

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          {company?.id ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Company"}
            </button>
          ) : (
            <span />
          )}

          <button type="submit" disabled={saving || deleting} className="btn-primary">
            {saving ? "Saving..." : company?.id ? "Update Company" : "Create Company"}
          </button>
        </div>
      </form>
    </div>
  );
}