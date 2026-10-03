
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/navbar/Navbar.jsx";
import {
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Trophy,
  ChartNoAxesCombined,
  UserRound,
  LogOut,
  Bell,
  Search,
  ArrowRight,
  FileQuestion,
  Target,
  Clock3,
  TrendingUp,
  ChevronDown,
  Zap,
  Menu,
  X,
} from "lucide-react";

const stats = [
  {
    title: "Total Quizzes",
    value: "12",
    icon: FileQuestion,
    color: "bg-blue-50 text-blue-600",
    trend: "+2 this week",
  },
  {
    title: "Average Score",
    value: "86%",
    icon: Target,
    color: "bg-emerald-50 text-emerald-600",
    trend: "+5% this month",
  },
  {
    title: "Total Attempts",
    value: "28",
    icon: BookOpen,
    color: "bg-violet-50 text-violet-600",
    trend: "Keep practicing",
  },
  {
    title: "Best Score",
    value: "100%",
    icon: Trophy,
    color: "bg-orange-50 text-orange-600",
    trend: "Personal best",
  },
];

const recentResults = [
  { topic: "JavaScript", score: "5/5", percentage: 100, date: "Oct 03, 2026" },
  { topic: "React", score: "4/5", percentage: 80, date: "Oct 02, 2026" },
  { topic: "Python", score: "3/5", percentage: 60, date: "Oct 01, 2026" },
  { topic: "HTML & CSS", score: "4/5", percentage: 80, date: "Sep 29, 2026" },
  { topic: "JavaScript", score: "5/5", percentage: 100, date: "Sep 27, 2026" },
];

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Generate Quiz", path: "/generate-quiz", icon: Sparkles },
  { label: "My Quizzes", path: "/my-quizzes", icon: BookOpen },
  { label: "Results", path: "/results", icon: Trophy },
  { label: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { label: "Profile", path: "/profile", icon: UserRound },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const filteredResults = recentResults.filter((result) =>
    result.topic.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f5f8ff] text-slate-800">
        <Navbar/>
      {/* Main Content */}
      <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
        {/* Search and Profile */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-[360px]">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your results..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={16} />
            <span>Saturday, October 3, 2026</span>
          </div>
        </div>

        {/* Welcome Banner */}
        <section className="relative mb-7 flex min-h-[190px] items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#10285d] via-[#16489b] to-[#2874e9] p-6 text-white shadow-lg shadow-blue-200/50 sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-32 h-72 w-72 rounded-full border-[35px] border-white/5" />
          <div className="pointer-events-none absolute right-44 top-20 h-48 w-48 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative z-10 max-w-[650px] animate-[slideUp_0.6s_ease-out]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <Sparkles size={14} />
              YOUR LEARNING JOURNEY
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Welcome back, Ajinath!
            </h2>
            <p className="mt-3 max-w-[500px] text-sm leading-relaxed text-blue-100 sm:text-base">
              Keep learning, keep growing. Challenge yourself with AI-powered
              quizzes and track your progress.
            </p>
            <button
              type="button"
              onClick={() => navigate("/generate-quiz")}
              className="group mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
            >
              Generate New Quiz
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          <div className="relative z-10 mr-5 hidden h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white/10 text-blue-100 shadow-inner lg:flex">
            <div className="absolute h-28 w-28 rounded-full border border-dashed border-cyan-200/40 animate-[spin_18s_linear_infinite]" />
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/15 text-cyan-200 shadow-lg">
              <GraduationCap size={54} strokeWidth={1.5} />
            </div>
            <Sparkles className="absolute -right-1 top-2 text-cyan-200" size={24} />
            <Trophy className="absolute -bottom-1 left-0 text-yellow-300" size={23} />
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ title, value, icon: Icon, color, trend }, index) => (
            <div
              key={title}
              style={{ animationDelay: `${index * 100}ms` }}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 animate-[slideUp_0.6s_ease-out_both]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{title}</p>
                  <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142b60]">
                    {value}
                  </h3>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={23} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <TrendingUp size={14} />
                {trend}
              </div>
            </div>
          ))}
        </section>

        {/* Results and Quick Action */}
        <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.7fr_0.85fr]">
          {/* Recent Results */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h3 className="text-lg font-extrabold text-[#142b60]">
                  Recent Results
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Your latest quiz performance
                </p>
              </div>
              <Link
                to="/results"
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-blue-600 transition hover:text-blue-800 sm:text-sm"
              >
                View All
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4 sm:px-6">Topic</th>
                    <th className="px-5 py-4">Score</th>
                    <th className="px-5 py-4">Percentage</th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, index) => (
                    <tr
                      key={`${result.topic}-${result.date}`}
                      style={{ animationDelay: `${index * 80}ms` }}
                      className="border-t border-slate-100 text-sm transition-colors duration-200 hover:bg-blue-50/50 animate-[fadeIn_0.5s_ease-out_both]"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-700 sm:px-6">
                        {result.topic}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-600">
                        {result.score}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                result.percentage >= 80
                                  ? "bg-emerald-500"
                                  : result.percentage >= 60
                                  ? "bg-blue-500"
                                  : "bg-orange-400"
                              }`}
                              style={{ width: `${result.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-600">
                            {result.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {result.date}
                      </td>
                    </tr>
                  ))}
                  {filteredResults.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-5 py-10 text-center text-sm text-slate-400">
                        No matching results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
              <Link
                to="/results"
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-blue-600 transition hover:gap-3"
              >
                Explore all results
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-50" />
            <div className="relative z-10">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-[#142b60]">
                Generate New Quiz
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Create a personalized quiz with AI. Choose any topic, difficulty
                level and number of questions.
              </p>

              <div className="my-6 space-y-3">
                {[
                  "Choose your favorite topic",
                  "Select difficulty level",
                  "Get instant results",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                      <ArrowRight size={12} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate("/generate-quiz")}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg active:translate-y-0"
              >
                <Sparkles size={17} />
                Generate Quiz
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        {/* Bottom Learning Tip */}
        <section className="mt-7 flex flex-col justify-between gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Sparkles size={21} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#142b60]">
                Learning Tip
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                Consistent practice helps you improve your quiz performance.
              </p>
            </div>
          </div>
          <Link
            to="/analytics"
            className="inline-flex cursor-pointer items-center gap-2 self-start text-sm font-bold text-blue-600 transition hover:text-blue-800 sm:self-center"
          >
            View Analytics
            <ArrowRight size={16} />
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© 2026 QuizMaster. Learn · Practice · Grow.</p>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex cursor-pointer items-center gap-2 font-semibold text-slate-500 transition hover:text-red-500"
          >
            <LogOut size={15} />
            Logout
          </button>
        </footer>
      </div>
    </main>
  );
}