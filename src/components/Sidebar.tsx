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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
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

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
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
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-20" : "w-64 lg:w-64"}`}
      >
        <div className={`flex h-16 items-center px-5 ${collapsed ? "lg:justify-center lg:px-0" : "justify-between"}`}>
          <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
              <Briefcase size={18} />
            </span>
            <span className={collapsed ? "lg:hidden" : ""}>
              Hire<span className="text-indigo-400">Track</span>
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Collapse/expand toggle — desktop only, mobile uses the hamburger + overlay instead */}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`mx-3 mb-1 mt-1 hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white lg:flex ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? <PanelLeftOpen size={18} strokeWidth={1.9} /> : <PanelLeftClose size={18} strokeWidth={1.9} />}
          {!collapsed && "Collapse"}
        </button>

        {!collapsed && (
          <div className="mx-4 mb-2 mt-1 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            {role === "recruiter" ? "Recruiter Workspace" : "Candidate Workspace"}
          </div>
        )}

        <nav className="flex-1 space-y-1 px-3 py-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  collapsed ? "lg:justify-center" : ""
                } ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.9} className="shrink-0" />
              <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className={`mb-1 flex items-center px-1 ${collapsed ? "lg:justify-center" : "justify-between"}`}>
            <span className={`text-xs font-medium text-slate-400 ${collapsed ? "lg:hidden" : ""}`}>Theme</span>
            <ThemeToggle variant="onDark" />
          </div>
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <LogOut size={18} strokeWidth={1.9} className="shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}