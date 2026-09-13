import api from "./axios";

export interface Company {
  id: string | number;
  name: string;
  description?: string;
  website?: string;
  location?: string;
  logo_url?: string;
  [key: string]: any;
}

export interface CompanyPayload {
  name: string;
  description?: string;
  website?: string;
  location?: string;
  [key: string]: any;
}

export const createCompany = (payload: CompanyPayload) =>
  api.post<Company>("/companies", payload).then((res) => res.data);

export const getMyCompany = () =>
  api.get<Company>("/companies/me").then((res) => res.data);

// Public — used by candidates viewing a company from a job listing.
export const getCompanyById = (id: string | number) =>
  api.get<Company>(`/companies/${id}`).then((res) => res.data);

export const updateCompany = (id: string | number, payload: Partial<CompanyPayload>) =>
  api.patch<Company>(`/companies/${id}`, payload).then((res) => res.data);

export const deleteCompany = (id: string | number) =>
  api.delete(`/companies/${id}`).then((res) => res.data);

export const uploadCompanyLogo = (id: string | number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post(`/companies/${id}/upload-logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};