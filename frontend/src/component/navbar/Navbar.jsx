
import { useState, useEffect, useRef } from "react";
import {
    GraduationCap,
    LayoutDashboard,
    Sparkles,
    BookOpen,
    FileText,
    BarChart3,
    Bell,
    ChevronDown,
    Menu,
    X,
    LogOut,
    ShieldCheck,
} from "lucide-react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Generate Quiz", path: "/generate-quiz", icon: Sparkles },
    { label: "My Quizzes", path: "/my-quizzes", icon: BookOpen },
    { label: "Results", path: "/results", icon: FileText },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

export default function Navbar({ pageName = "QuizMaster", onLogout }) {
    const [user, setUser] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        const loadUser = () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        loadUser();

        window.addEventListener("storage", loadUser);
        window.addEventListener("authChanged", loadUser);

        return () => {
            window.removeEventListener("storage", loadUser);
            window.removeEventListener("authChanged", loadUser);
        };
    }, [location.pathname]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const isLoggedIn = Boolean(
        localStorage.getItem("token") && user
    );

    const userName = user?.name || "Student";
    const userEmail = user?.email || "";
    const initial = userName.charAt(0).toUpperCase();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setProfileOpen(false);
        setNotificationOpen(false);
        setMobileMenu(false);

        window.dispatchEvent(new Event("authChanged"));

        if (onLogout) {
            onLogout();
        }

        navigate("/login");
    };

    const closeMobileMenu = () => {
        setMobileMenu(false);
    };

    const navLinkClass = (path) =>
        `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
            isActive(path)
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        }`;

    return (
        <>
            <style>
                {`
                    @keyframes menuFade {
                        from {
                            opacity: 0;
                            transform: translateY(-8px) scale(0.98);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }

                    .navbar-popup {
                        animation: menuFade 0.18s ease-out;
                    }
                `}
            </style>

            <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
                <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">

                    {/* Logo */}
                    <Link
                        to={isLoggedIn ? "/dashboard" : "/"}
                        className="flex shrink-0 items-center gap-2.5"
                    >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-md shadow-blue-200">
                            <GraduationCap size={25} />
                        </div>

                        <div className="min-w-0">
                            <h1 className="whitespace-nowrap text-lg font-extrabold tracking-tight text-[#142b60] sm:text-xl">
                                {pageName === "QuizMaster" ? (
                                    <>
                                        Quiz<span className="text-blue-600">Master</span>
                                    </>
                                ) : (
                                    pageName
                                )}
                            </h1>

                            <p className="hidden whitespace-nowrap text-[10px] font-medium tracking-[1.5px] text-slate-400 sm:block">
                                LEARN · PRACTICE · GROW
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation: Always visible */}
                    <nav className="hidden items-center gap-1 xl:flex">
                        {navItems.map(({ label, path, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={navLinkClass(path)}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">

                        {/* Logged Out */}
                        {!isLoggedIn && (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50 sm:inline-flex"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}

                        {/* Logged In */}
                        {isLoggedIn && (
                            <>
                               
                                {/* User Profile */}
                                <div className="relative" ref={profileRef}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(!profileOpen);
                                            setNotificationOpen(false);
                                        }}
                                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-2 py-1.5 transition-all duration-200 sm:gap-3 sm:px-3 ${
                                            profileOpen
                                                ? "border-blue-100 bg-blue-50"
                                                : "border-transparent hover:border-slate-100 hover:bg-slate-50"
                                        }`}
                                        aria-label="User profile"
                                        aria-expanded={profileOpen}
                                    >
                                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 ring-2 ring-white">
                                            {initial}
                                        </div>

                                        <div className="hidden max-w-[130px] text-left md:block">
                                            <p className="truncate text-sm font-bold text-slate-800">
                                                {userName}
                                            </p>
                                            <p className="text-[11px] font-medium text-slate-400">
                                                Student
                                            </p>
                                        </div>

                                        <ChevronDown
                                            size={15}
                                            className={`hidden text-slate-400 transition-transform duration-200 sm:block ${
                                                profileOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {/* Professional Profile Popup */}
                                    {profileOpen && (
                                        <div className="navbar-popup absolute right-0 top-full z-50 mt-3 w-[290px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.14)] sm:w-[320px]">

                                            {/* Profile Header */}
                                            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-500 px-5 py-5 text-white">
                                                <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full border-[18px] border-white/10" />

                                                <div className="relative flex items-center gap-3">
                                                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-white/50 bg-white/20 text-lg font-bold text-white shadow-sm">
                                                        {initial}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-base font-bold">
                                                            {userName}
                                                        </p>
                                                        <p className="truncate text-xs text-blue-100">
                                                            {userEmail}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold text-white">
                                                    <ShieldCheck size={13} />
                                                    Student Account
                                                </div>
                                            </div>

                                            {/* Popup Menu */}
                                            <div className="p-2">
                                                <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[1.3px] text-slate-400">
                                                    Account
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfileOpen(false);
                                                        navigate("/dashboard");
                                                    }}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-blue-50"
                                                >
                                                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                                        <LayoutDashboard size={17} />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-700">
                                                            Dashboard
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            View your overview
                                                        </p>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfileOpen(false);
                                                        navigate("/analytics");
                                                    }}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-blue-50"
                                                >
                                                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                                                        <BarChart3 size={17} />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-700">
                                                            My Performance
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            Track your progress
                                                        </p>
                                                    </div>
                                                </button>

                                                <div className="my-2 border-t border-slate-100" />

                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50"
                                                >
                                                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-500">
                                                        <LogOut size={17} />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-red-600">
                                                            Logout
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            Sign out of your account
                                                        </p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 xl:hidden"
                            aria-label="Toggle navigation"
                            aria-expanded={mobileMenu}
                        >
                            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation: Always visible when opened */}
                {mobileMenu && (
                    <div className="navbar-popup border-t border-slate-100 bg-white px-4 py-3 shadow-lg xl:hidden">
                        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {navItems.map(({ label, path, icon: Icon }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    onClick={closeMobileMenu}
                                    className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                                        isActive(path)
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    <Icon size={17} />
                                    {label}
                                </Link>
                            ))}

                            {isLoggedIn ? (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={closeMobileMenu}
                                        className="rounded-xl px-3 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}
