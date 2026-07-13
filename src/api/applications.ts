import api from "./axios";

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "rejected"
  | "interview_scheduled"
  | "hired"
  | string;

export interface Application {
  id: string | number;
  job_id: string | number;
  job_title?: string;
  candidate_id?: string | number;
  candidate_name?: string;
  candidate_email?: string;
  resume_url?: string;
  status: ApplicationStatus;
  applied_at?: string;
  [key: string]: any;
}

export const applyToJob = (jobId: string | number) =>
  api.post<Application>(`/applications/apply/${jobId}`).then((res) => res.data);

export const getMyApplications = () =>
  api.get<Application[]>("/applications/my").then((res) => res.data);

export const getApplicationsByJob = (jobId: string | number) =>
  api.get<Application[]>(`/applications/job/${jobId}`).then((res) => res.data);

export const updateApplicationStatus = (id: string | number, status: ApplicationStatus) =>
  api.patch<Application>(`/applications/${id}/status`, { status }).then((res) => res.data);
