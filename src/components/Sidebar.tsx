import { NavLink, useNavigate } from "react-router-dom";
import {
  Briefcase,
  LayoutDashboard,
  User,
  FileText,
  CalendarClock,
  Building2,
  ListChecks,
  PlusCircle,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const candidateLinks = [
  { to: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/jobs", label: "Browse Jobs", icon: Briefcase },
  { to: "/candidate/profile", label: "My Profile", icon: User },
  { to: "/candidate/applications", label: "My Applications", icon: FileText },
  { to: "/candidate/interviews", label: "My Interviews", icon: CalendarClock },
];

const recruiterLinks = [
  { to: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/recruiter/company", label: "Company", icon: Building2 },
  { to: "/recruiter/jobs", label: "Jobs", icon: ListChecks },
  { to: "/recruiter/jobs/create", label: "Post a Job", icon: PlusCircle },
  { to: "/recruiter/applicants", label: "Applicants", icon: Users },
  { to: "/recruiter/interviews", label: "Interviews", icon: CalendarClock },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const links = role === "recruiter" ? recruiterLinks : candidateLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Briefcase size={18} />
            </span>
            Hire<span className="text-indigo-400">Track</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="mx-4 mb-2 mt-1 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          {role === "recruiter" ? "Recruiter Workspace" : "Candidate Workspace"}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.9} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-xs font-medium text-slate-400">Theme</span>
            <ThemeToggle variant="onDark" />
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} strokeWidth={1.9} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}