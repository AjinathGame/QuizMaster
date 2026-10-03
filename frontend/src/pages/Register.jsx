
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Lightbulb,
  ShieldCheck,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext.jsx";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const inputStyle =
    "w-full min-w-0 bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400";

  const wrapperStyle =
    "flex min-h-[56px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100";

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!name.trim()) {
      showToast("error", "Full name is required.");
      return;
    }

    if (!email.trim()) {
      showToast("error", "Email address is required.");
      return;
    }

    if (password.length < 6) {
      showToast("error", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      window.dispatchEvent(new Event("authChanged"));

      showToast("success", "Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f2f6ff] p-0 sm:p-5 lg:p-8">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-blue-100/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 h-[480px] w-[480px] rounded-full bg-blue-100/70 blur-2xl" />
  
      
      <section className="relative z-10 grid min-h-screen w-[130vh] overflow-hidden bg-white shadow-[0_25px_70px_rgba(27,57,105,0.12)] animate-[fadeIn_0.7s_ease-out] sm:min-h-[720px] sm:max-w-[1400px] sm:rounded-[28px] lg:grid-cols-[1fr_1.05fr]">
        {/* Left Panel */}
        <div className="relative flex min-h-[620px] flex-col overflow-hidden bg-gradient-to-br from-[#e9f3ff] via-[#e7f1ff] to-[#dceaff] px-6 py-8 text-[#10265b] sm:px-12 lg:min-h-[720px] lg:px-12 xl:px-16">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-700">
              <GraduationCap size={38} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#10265b] sm:text-3xl">
                Online <span className="text-blue-600">Quiz</span>
              </h1>
              <p className="mt-1 text-sm font-medium tracking-wide text-slate-600">
                Learn · Practice · Grow
              </p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 mt-12 max-w-[500px] animate-[slideUp_0.8s_ease-out] lg:mt-12">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#122550] sm:text-5xl">
              Create Your
              <br />
              Account
            </h2>

            <p className="mt-4 max-w-[420px] text-base leading-relaxed text-slate-600 sm:text-xl">
              Join our online quiz platform and start learning with fun!
            </p>
          </div>

          {/* Illustration */}
          <div className="relative mx-auto mt-12 flex h-[400px] w-full max-w-[500px] items-center justify-center">
            <div className="absolute h-[310px] w-[310px] rounded-full bg-blue-200/60 blur-3xl" />

            {/* Main Floating Card */}
            <div className="absolute left-1/2 top-1/2 z-20 w-[290px] -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] rounded-3xl border border-white/80 bg-white/95 p-5 shadow-[0_25px_60px_rgba(37,99,235,0.18)] transition-all duration-500 hover:rotate-0 hover:scale-105 sm:w-[340px]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700">
                    <GraduationCap size={24} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Quiz Progress
                    </p>
                    <p className="text-xs text-slate-400">
                      Your learning journey
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                  +12%
                </div>
              </div>

              {/* Progress */}
              <div className="mb-5 rounded-2xl bg-blue-50/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    Weekly Goal
                  </span>
                  <span className="text-sm font-extrabold text-blue-700">
                    75%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-blue-100">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500" />
                </div>
              </div>

              {/* Quiz Items */}
              <div className="space-y-3">
                {[
                  {
                    title: "Mathematics",
                    score: "92%",
                    color: "bg-blue-500",
                  },
                  {
                    title: "Science",
                    score: "85%",
                    color: "bg-violet-500",
                  },
                  {
                    title: "Technology",
                    score: "78%",
                    color: "bg-emerald-500",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
                  >
                    <div className={`h-9 w-1.5 rounded-full ${item.color}`} />
                    <p className="flex-1 text-sm font-semibold text-slate-700">
                      {item.title}
                    </p>
                    <span className="text-sm font-bold text-slate-700">
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Success Card */}
            <div className="absolute right-0 top-8 z-30 flex animate-bounce items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_12px_35px_rgba(15,23,42,0.12)] [animation-duration:3.5s] sm:right-2">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={21} strokeWidth={3} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Quiz Completed!
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Great work
                </p>
              </div>
            </div>

            {/* Floating Idea Icon */}
            <div className="absolute bottom-8 left-0 z-30 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-yellow-200 shadow-lg shadow-blue-200 sm:left-4 sm:h-16 sm:w-16">
              <Lightbulb size={30} />
            </div>

            {/* Decorative Dots */}
            <div className="absolute left-[8%] top-[15%] h-3 w-3 rounded-full bg-blue-400/70" />
            <div className="absolute bottom-[18%] right-[8%] h-5 w-5 rounded-full bg-indigo-300/70" />
            <div className="absolute right-[15%] top-[28%] h-2 w-2 rounded-full bg-blue-500/60" />
          </div>

          <div className="mt-auto hidden items-center justify-center gap-2 pt-5 text-sm font-semibold text-blue-900 lg:flex">
            <ShieldCheck size={19} className="text-blue-600" />
            <span>Learn smarter. Grow faster.</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="relative flex items-center justify-center bg-white px-6 py-10 sm:px-12 lg:px-14 xl:px-20">
          <div className="w-full max-w-[590px] animate-[slideUp_0.8s_ease-out]">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#142550] sm:text-4xl">
                Create Account
              </h2>
              <p className="mt-3 text-base text-slate-500 sm:text-lg">
                Fill in the details below to get started
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#18294f] sm:text-base"
                >
                  Full Name
                </label>

                <div className={wrapperStyle}>
                  <User size={22} className="shrink-0 text-slate-500" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={inputStyle}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#18294f] sm:text-base"
                >
                  Email Address
                </label>

                <div className={wrapperStyle}>
                  <Mail size={22} className="shrink-0 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={inputStyle}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#18294f] sm:text-base"
                >
                  Password
                </label>

                <div className={wrapperStyle}>
                  <Lock size={22} className="shrink-0 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputStyle}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 cursor-pointer text-slate-400 transition-colors hover:text-blue-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#18294f] sm:text-base"
                >
                  Confirm Password
                </label>

                <div className={wrapperStyle}>
                  <Lock size={22} className="shrink-0 text-slate-500" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={inputStyle}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="shrink-0 cursor-pointer text-slate-400 transition-colors hover:text-blue-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-[58px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}

                {!loading && (
                  <ArrowRight
                    size={21}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm font-medium text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Login Link */}
            <div className="text-center text-sm font-medium text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="ml-1 font-bold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
              >
                Login
              </Link>
            </div>

            {/* Footer Note */}
            <p className="mt-7 text-center text-xs text-slate-400">
              By creating an account, you agree to use the platform responsibly.
            </p>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}