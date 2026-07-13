import api from "./axios";

export interface CandidateProfile {
  id?: number;
  full_name?: string; // comes from /users/me, not from /profile
  phone?: string | null;
  bio?: string | null;
  skills?: string[] | string;
  experience?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  resume_url?: string | null;
  photo_url?: string | null;
  [key: string]: any;
}

export interface CurrentUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

// ---- User account (name/email) ----
export const getMyUser = () => api.get<CurrentUser>("/users/me").then((res) => res.data);

export const updateMyUser = (payload: Partial<CurrentUser>) =>
  api.patch<CurrentUser>("/users/me", payload).then((res) => res.data);

export const deleteMyAccount = () => api.delete("/users/me").then((res) => res.data);

// ---- Candidate profile (phone/bio/skills/etc.) ----
export const getMyCandidateProfile = () =>
  api.get<CandidateProfile>("/profile/me").then((res) => res.data);

export const createCandidateProfile = (payload: Partial<CandidateProfile>) =>
  api.post<CandidateProfile>("/profile/", payload).then((res) => res.data);

export const updateCandidateProfile = (payload: Partial<CandidateProfile>) =>
  api.patch<CandidateProfile>("/profile/", payload).then((res) => res.data);

export const deleteCandidateProfile = () =>
  api.delete("/profile/").then((res) => res.data);

export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post("/profile/upload-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.resume_url as string);
};

export const uploadProfilePhoto = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post("/profile/upload-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.photo_url as string);
};