import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import HomePage from "./pages/public/HomePage";
import JobsPage from "./pages/public/JobsPage";
import JobDetailsPage from "./pages/public/JobDetailsPage";
import CompanyProfilePage from "./pages/public/CompanyProfilePage";
import NotFoundPage from "./pages/public/NotFoundPage";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateProfilePage from "./pages/candidate/CandidateProfilePage";
import MyApplicationsPage from "./pages/candidate/MyApplicationsPage";
import ApplicationTrackerPage from "./pages/candidate/ApplicationTrackerPage";
import MyInterviewsPage from "./pages/candidate/MyInterviewsPage";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CompanyPage from "./pages/recruiter/CompanyPage";
import RecruiterJobsPage from "./pages/recruiter/RecruiterJobsPage";
import CreateJobPage from "./pages/recruiter/CreateJobPage";
import ApplicantsPage from "./pages/recruiter/ApplicantsPage";
import CandidateProfileViewPage from "./pages/recruiter/CandidateProfileViewPage";
import InterviewsPage from "./pages/recruiter/InterviewsPage";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "10px",
              fontSize: "13.5px",
              fontWeight: 500,
              padding: "10px 14px",
            },
            success: {
              iconTheme: { primary: "#059669", secondary: "#fff" },
              style: { borderLeft: "3px solid #059669" },
            },
            error: {
              iconTheme: { primary: "#e11d48", secondary: "#fff" },
              style: { borderLeft: "3px solid #e11d48" },
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
           <Route path="/home" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/companies/:id" element={<CompanyProfilePage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Candidate */}
          <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
              <Route path="/candidate/profile" element={<CandidateProfilePage />} />
              <Route path="/candidate/applications" element={<MyApplicationsPage />} />
              <Route path="/candidate/applications/:applicationId/track" element={<ApplicationTrackerPage />} />
              <Route path="/candidate/interviews" element={<MyInterviewsPage />} />
            </Route>
          </Route>

          {/* Recruiter */}
          <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/company" element={<CompanyPage />} />
              <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
              <Route path="/recruiter/jobs/create" element={<CreateJobPage />} />
              <Route path="/recruiter/applicants" element={<ApplicantsPage />} />
              <Route path="/recruiter/applicants/:candidateId" element={<CandidateProfileViewPage />} />
              <Route path="/recruiter/interviews" element={<InterviewsPage />} />
            </Route>
          </Route>

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}