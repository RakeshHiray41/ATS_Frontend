import { Link, useNavigate } from "react-router-dom";
import { Briefcase, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-slate-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Briefcase className="h-4.5 w-4.5" size={18} />
          </span>
          Hire<span className="text-indigo-600">Track</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-300 sm:flex">
          <Link to="/jobs" className="transition hover:text-indigo-600">
            Browse Jobs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-2">
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-4 !py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}