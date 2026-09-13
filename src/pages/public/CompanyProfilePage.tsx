import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Globe, MapPin, Building2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import { getCompanyById, type Company } from "../../api/company";
import { getErrorMessage } from "../../api/axios";

export default function CompanyProfilePage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getCompanyById(id);
        setCompany(data);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error(getErrorMessage(err, "Could not load company profile"));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/jobs"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={15} /> Back to jobs
        </Link>

        {loading ? (
          <Loading label="Loading company profile..." />
        ) : notFound ? (
          <EmptyState title="Company not found" description="This company profile isn't available." />
        ) : company ? (
          <div className="card">
            <div className="flex flex-col items-start gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-indigo-50">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-indigo-400">
                    <Building2 size={26} />
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">{company.name}</h1>
                <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
                  {company.location && (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                      <MapPin size={12} /> {company.location}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Globe size={12} /> {company.website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h2 className="mb-2 font-display text-base font-semibold text-slate-900">About</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {company.description || "No description provided yet."}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}