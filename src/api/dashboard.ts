import api from "./axios";

export interface CandidateDashboardStats {
  applied_jobs: number;
  interviews: number;
  shortlisted: number;
  [key: string]: any;
}

export interface RecruiterDashboardStats {
  total_jobs: number;
  applicants: number;
  interviews: number;
  company?: string;
  [key: string]: any;
}

export const getCandidateDashboard = () =>
  api.get<CandidateDashboardStats>("/dashboard/candidate").then((res) => res.data);

export const getRecruiterDashboard = () =>
  api.get<RecruiterDashboardStats>("/dashboard/recruiter").then((res) => res.data);
