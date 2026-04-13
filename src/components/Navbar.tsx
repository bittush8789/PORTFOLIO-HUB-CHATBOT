import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Menu, X, Sun, Moon, Search, Shield, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "../lib/AuthContext";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || 
             (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const navLinks = [
    { name: "Topics", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-900 dark:bg-[#0a0a0a]/80">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black">
                D
              </div>
              <span>DevOps Hub</span>
            </Link>
            
            <div className="hidden lg:block">
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      location.pathname === link.path
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="hidden items-center space-x-4 md:flex">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 text-sm font-medium text-orange-600 dark:text-orange-400"
                    >
                      <Shield size={16} />
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400"
                >
                  <User size={16} />
                  Login
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden border-b border-gray-100 bg-white dark:border-gray-900 dark:bg-[#0a0a0a]"
        >
          <div className="space-y-1 px-4 pb-6 pt-2">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none dark:bg-gray-900 dark:text-white"
              />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-2 text-base font-medium",
                  location.pathname === link.path
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-base font-medium text-orange-600"
                    >
                      <Shield size={18} />
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={() => { handleSignOut(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-base font-medium text-gray-500"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-blue-600"
                >
                  <User size={18} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
