
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Lightbulb,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Email address is required", "error");
      return;
    }

    if (!password) {
      showToast("Password is required", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      if (!token) {
        throw new Error("Login token was not received.");
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      window.dispatchEvent(new Event("authChanged"));

      showToast("Login successful! Welcome back.", "success");

      navigate("/dashboard");
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f2f6ff] p-0 sm:p-6 lg:p-10">
      <div className="pointer-events-none absolute -right-36 -top-40 h-[420px] w-[420px] rounded-full bg-blue-100/80" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 h-[420px] w-[420px] rounded-full bg-blue-100/70" />

      <section className="relative z-10 grid min-h-screen w-[130vh] overflow-hidden bg-white shadow-[0_25px_70px_rgba(27,57,105,0.12)] animate-[fadeIn_0.7s_ease-out] sm:min-h-[720px] sm:max-w-[1240px] sm:rounded-[26px] lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left Panel */}
        <div className="relative flex min-h-[390px] flex-col items-center overflow-hidden bg-[#e2edff] px-6 py-7 text-[#10265b] sm:min-h-[450px] lg:min-h-[720px] lg:px-8">
          <div className="flex w-full items-center gap-2 self-start text-sm font-extrabold tracking-wide">
            <GraduationCap size={30} className="text-blue-700" />
            <span>QUIZMASTER</span>
          </div>

          <div className="relative z-10 mt-8 text-center sm:mt-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#122c6b] sm:text-5xl">
              Online <span className="text-blue-600">Quiz</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Test Your Knowledge
            </p>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              &amp; Build a Better Tomorrow
            </p>
          </div>

          {/* Illustration */}
          <div className="relative mt-7 h-[280px] w-full max-w-[490px] sm:mt-10 sm:h-[350px]">
            <div className="absolute bottom-3 left-1/2 h-[260px] w-[85%] -translate-x-1/2 rounded-[48%] bg-[#d4e5ff]" />

            {/* Quiz Sheet */}
            <div className="absolute right-[12%] top-10 z-10 h-[220px] w-[175px] rotate-3 rounded-2xl border-[7px] border-blue-400 bg-white p-4 shadow-xl transition-transform duration-500 hover:rotate-0 hover:shadow-2xl">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-300" />
                <span className="h-2 w-20 rounded-full bg-blue-100" />
              </div>

              {["A", "B", "C", "D"].map((option, index) => (
                <div key={option} className="mb-3 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-blue-300 text-xs font-bold text-blue-600">
                    {option}
                  </span>
                  <span className="h-2 w-14 rounded-full bg-blue-100" />
                  {index === 2 && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
                      <Check size={12} />
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Student Illustration */}
            <div className="absolute bottom-6 left-[12%] z-20 h-[225px] w-[175px]">
              <div className="absolute left-[47px] top-[30px] h-[85px] w-[80px] rounded-[45%] bg-[#f4b78c]">
                <div className="absolute -left-2 -top-4 h-12 w-[90px] rounded-[55%_50%_20%_25%] bg-[#17244b]" />
                <div className="absolute left-5 top-10 h-1.5 w-1.5 rounded-full bg-slate-800" />
                <div className="absolute left-12 top-10 h-1.5 w-1.5 rounded-full bg-slate-800" />
                <div className="absolute left-8 top-[62px] h-2 w-4 rounded-full border-b-2 border-[#9c4d47]" />
              </div>

              <div className="absolute left-[74px] top-[105px] h-7 w-8 bg-[#eaa77f]" />
              <div className="absolute left-[25px] top-[125px] h-[100px] w-[135px] rounded-t-[55px] rounded-b-xl bg-gradient-to-br from-blue-500 to-blue-800">
                <div className="absolute left-[57px] top-3 h-8 w-0.5 bg-blue-200" />
                <div className="absolute left-[76px] top-3 h-8 w-0.5 bg-blue-200" />
              </div>
              <div className="absolute left-[15px] top-[150px] h-[65px] w-8 rotate-[-25deg] rounded-full bg-blue-600" />
              <div className="absolute right-0 top-[150px] h-[65px] w-8 rotate-[25deg] rounded-full bg-blue-600" />
            </div>

            {/* Laptop */}
            <div className="absolute bottom-5 left-[25%] z-30 w-[180px] -rotate-6">
              <div className="relative h-[105px] rounded-t-lg border-[9px] border-b-[12px] border-[#1d3266] bg-[#263d74]">
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400" />
              </div>
              <div className="h-2.5 w-[200px] -translate-x-2 rounded-b-xl bg-[#6e8bc5]" />
            </div>

            {/* Floating Idea Icon */}
            <div className="absolute right-[10%] top-2 z-30 grid h-[68px] w-[68px] place-items-center rounded-full bg-blue-500 text-yellow-200 animate-[float_3s_ease-in-out_infinite]">
              <Lightbulb size={34} />
            </div>

            {/* Books */}
            <div className="absolute bottom-4 right-[2%] z-20 flex w-[100px] flex-col gap-1">
              <div className="h-4 rounded-r-lg bg-emerald-400 shadow-sm" />
              <div className="h-4 rounded-r-lg bg-violet-400 shadow-sm" />
              <div className="h-4 rounded-r-lg bg-blue-500 shadow-sm" />
            </div>

            {/* Plant */}
            <div className="absolute bottom-3 left-0 z-10 flex h-36 w-14 flex-col items-center">
              <div className="relative h-24 w-full">
                <div className="absolute bottom-0 left-1/2 h-24 w-1 -translate-x-1/2 rounded bg-emerald-700" />
                <div className="absolute left-1 top-6 h-12 w-7 -rotate-45 rounded-[90%_0_90%_0] bg-emerald-400" />
                <div className="absolute right-0 top-12 h-12 w-7 rotate-45 rounded-[90%_0_90%_0] bg-emerald-500" />
                <div className="absolute left-1 top-14 h-10 w-6 -rotate-45 rounded-[90%_0_90%_0] bg-emerald-600" />
              </div>
              <div className="h-8 w-10 rounded-b-xl rounded-t-md border-t-4 border-blue-200 bg-white" />
            </div>
          </div>

          <div className="mt-auto hidden w-full items-center justify-center gap-3 pt-4 text-center text-sm font-semibold text-blue-900 lg:flex">
            <ShieldCheck size={20} className="text-blue-600" />
            <span>Learn smarter. Grow faster.</span>
          </div>
          <p className="mt-3 hidden text-xs text-slate-500 lg:block">
            AI-powered learning for everyone.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12 lg:px-14 xl:px-20">
          <div className="w-full max-w-[500px]">
            {/* Heading */}
            <div className="mb-10">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Lock size={22} />
              </div>
              <p className="mb-2 text-xs font-extrabold tracking-[2px] text-blue-600">
                WELCOME BACK
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#142550] sm:text-4xl">
                Welcome Back!
              </h2>
              <p className="mt-3 text-base text-slate-500">
                Login to continue your quiz journey
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#18294f]">
                  Email Address
                </label>
                <div className="flex min-h-[60px] items-center gap-3 rounded-xl border border-slate-200 px-4 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <Mail size={21} className="shrink-0 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className="h-full min-w-0 flex-1 bg-transparent py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#18294f]">
                  Password
                </label>
                <div className="flex min-h-[60px] items-center gap-3 rounded-xl border border-slate-200 px-4 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <Lock size={21} className="shrink-0 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-full min-w-0 flex-1 bg-transparent py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
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

              {/* Forgot Password */}
              <div className="-mt-2 flex justify-end">
                <span className="text-sm font-medium text-slate-400">
                  Forgot Password?
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-[62px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && (
                  <ArrowRight
                    size={21}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Register */}
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="cursor-pointer font-extrabold text-blue-600 transition-colors hover:text-blue-800"
              >
                Register
              </Link>
            </p>

            {/* Security Note */}
            <div className="mt-9 flex items-center justify-center gap-2 text-xs text-slate-400">
              <BookOpen size={16} />
              <span>Start your learning journey today</span>
            </div>
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </main>
  );
}