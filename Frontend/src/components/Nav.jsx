import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { pathname } = useLocation();

  const linkClass = (p) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      pathname === p
        ? "bg-green-600 text-white"
        : ""
    }`;

  return (
    <header className="border-b border-green-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="AILORA" className="w-10 h-10" />
            <div className="leading-tight">
              <h1 className="text-xl font-bold text-green-700 tracking-tight">
                AILORA
              </h1>
              <p className="text-xs text-slate-500 -mt-1">
                 Health Assistant
              </p>
            </div>
          </Link>

          {/* Links */}
          <nav className="flex items-center ">
            <Link to="/about-us" className={linkClass("/about-us")}>
              About
            </Link>
            <Link to="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
