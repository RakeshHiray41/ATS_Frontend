import api from "./axios";

export interface Job {
  id: string | number;
  title: string;
  description: string;
  location: string;
  experience: string;
  salary: string;
  status: string;
  company_id: string | number;
  [key: string]: any;
}

export interface JobPayload {
  title: string;
  description: string;
  location: string;
  experience: string;
  salary: string;
  company_id: string | number;
  [key: string]: any;
}

export const getJobs = (params?: Record<string, any>) =>
  api.get<Job[]>("/jobs", { params }).then((res) => res.data);

export const getJobById = (id: string | number) =>
  api.get<Job>(`/jobs/${id}`).then((res) => res.data);

export const searchJobs = (params: { search?: string; location?: string }) =>
  api.get<Job[]>("/jobs/search", { params }).then((res) => res.data);

export const createJob = (payload: JobPayload) =>
  api.post<Job>("/jobs", payload).then((res) => res.data);

export const updateJob = (id: string | number, payload: Partial<JobPayload>) =>
  api.patch<Job>(`/jobs/${id}`, payload).then((res) => res.data);

export const deleteJob = (id: string | number) =>
  api.delete(`/jobs/${id}`).then((res) => res.data);