# 🚀 HireTrack - Applicant Tracking System (ATS) Frontend

A modern, production-ready **Applicant Tracking System (ATS)** frontend built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. The application provides role-based dashboards for **Candidates**, **Recruiters**, and **Admins**, enabling complete recruitment workflow management.

---

## 📌 Features

### 👨‍💼 Candidate
- User Registration & Login
- JWT Authentication
- Candidate Profile Management
- Resume Upload
- Browse Available Jobs
- Apply for Jobs
- Track Job Applications
- View Scheduled Interviews
- Dashboard Overview
- **Withdraw a submitted application**
- **Application status timeline** (visual tracker per application)
- **Profile completeness meter**
- **View a company's public profile** from any job listing
- **Skills-match score** on a job listing, based on the candidate's own profile
- **In-app + email notifications** when an application's status changes

### 🏢 Recruiter
- Recruiter Authentication
- Company Profile Management
- Create, Update & Delete Jobs
- View Applicants
- Schedule Interviews
- Recruiter Dashboard
- **View a candidate's full profile** (details, resume, social links) from the applicants list
- **Bulk shortlist / reject** selected applicants
- **Duplicate-applicant detection** (flags a candidate who applied to more than one of your vacancies)
- **Interview calendar view** (month view, in addition to the list view)
- **CSV export** of the current applicant list

### 🎨 UI / UX
- **Dark mode**, toggleable, persisted per browser
- **Collapsible sidebar** (desktop)
- Skeleton loading states for tables and dashboard cards
- Deterministic, per-candidate avatar colors
- Similar-jobs recommendations on a job listing

### 🔐 Authentication
- JWT Token Authentication
- Role-Based Authorization
- Protected Routes
- Automatic Logout on Unauthorized Access

---

## 🛠 Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- React Hot Toast

---

## 📂 Project Structure

```text
src/
├── api/
│   ├── auth.ts
│   ├── jobs.ts
│   ├── profile.ts
│   ├── company.ts
│   ├── applications.ts
│   ├── interviews.ts
│   └── dashboard.ts
│
├── components/
│   ├── Navbar
│   ├── Sidebar
│   ├── Loading
│   ├── EmptyState
│   ├── StatusBadge
│   └── Upload Components
│
├── context/
│   └── AuthContext
│
├── layouts/
│   └── DashboardLayout
│
├── routes/
│   └── ProtectedRoute
│
└── pages/
    ├── auth/
    ├── public/
    ├── candidate/
    └── recruiter/
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Go to project directory

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

The application will run on:

```
http://localhost:5173
```

---

## 🌍 Environment Variables

Create a **.env** file in the project root.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This URL should point to your FastAPI backend.

---

## 🔑 Authentication

After successful login, the application stores the following information in **localStorage**:

- access_token
- role (candidate | recruiter | admin)
- company_id

The Axios instance automatically:

- Attaches JWT token to every request
- Redirects to Login page if token expires
- Clears stored session on Unauthorized (401)

---

## 🛣 Routes

| Route | Access |
|--------|--------|
| / | Public |
| /jobs | Public |
| /jobs/:id | Public |
| /login | Public |
| /register | Public |
| /candidate/* | Candidate Only |
| /recruiter/* | Recruiter Only |

---

## 🔗 API Integration

The frontend communicates with the FastAPI backend using Axios.

Main API modules include:

- Authentication
- Jobs
- Candidate Profile
- Applications
- Company
- Dashboard
- Interviews

---

## 📦 Build

Create production build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```





---

## 👨‍💻 Developed By

**Rakesh Hiray**

Master of Computer Science

Backend Developer | FastAPI | React | TypeScript | PostgreSQL | Supabase

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.