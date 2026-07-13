import api from "./axios";

export interface Interview {
  id: string | number;
  application_id: string | number;
  candidate_name?: string;
  candidate_email?: string;
  job_title?: string;
  company_name?: string;
  interview_date: string;
  meeting_link: string;
  status: string;
  notes?: string | null;
  [key: string]: any;
}

export interface InterviewPayload {
  application_id: string | number;
  interview_date: string;
  meeting_link: string;
  notes?: string;
}

export interface InterviewUpdatePayload {
  interview_date?: string;
  meeting_link?: string;
  status?: string;
  notes?: string;
}

export const createInterview = (payload: InterviewPayload) =>
  api.post<Interview>("/interviews", payload).then((res) => res.data);

export const getInterviews = () =>
  api.get<Interview[]>("/interviews/recruiter").then((res) => res.data);

export const getJobInterviews = (jobId: string | number) =>
  api.get<Interview[]>(`/interviews/job/${jobId}`).then((res) => res.data);

export const getMyInterviews = () =>
  api.get<Interview[]>("/interviews/my").then((res) => res.data);

export const updateInterview = (id: string | number, payload: InterviewUpdatePayload) =>
  api.patch<Interview>(`/interviews/${id}`, payload).then((res) => res.data);

export const deleteInterview = (id: string | number) =>
  api.delete(`/interviews/${id}`).then((res) => res.data);