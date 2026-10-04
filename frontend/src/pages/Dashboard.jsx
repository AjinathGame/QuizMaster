
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/navbar/Navbar.jsx";
import api from "../api/api";
import {
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Trophy,
  ChartNoAxesCombined,
  UserRound,
  LogOut,
  Search,
  ArrowRight,
  FileQuestion,
  Target,
  Clock3,
  TrendingUp,
} from "lucide-react";

const initialStats = [
  {
    label: "Total Quizzes",
    value: 0,
    icon: BookOpen,
  },
  {
    label: "Average Score",
    value: "0%",
    icon: Target,
  },
  {
    label: "Total Attempts",
    value: 0,
    icon: FileQuestion,
  },
  {
    label: "Best Score",
    value: "0%",
    icon: Trophy,
  },
];

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    totalAttempts: 0,
    bestScore: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      const [statsResponse, resultsResponse, userResponse] =
        await Promise.allSettled([
          api.get("/dashboard/stats"),
          api.get("/dashboard/recent-results"),
          api.get("/users/me"),
        ]);

      if (!isMounted) return;

      let failedRequests = 0;

      if (statsResponse.status === "fulfilled") {
        const statsData = statsResponse.value.data;

        setDashboardStats(
          statsData?.stats || statsData?.data || statsData
        );
      } else {
        failedRequests++;
        console.error(
          "Dashboard stats error:",
          statsResponse.reason
        );
      }

      if (resultsResponse.status === "fulfilled") {
        const resultsData = resultsResponse.value.data;
        setResults(getArray(resultsData));
      } else {
        failedRequests++;
        console.error(
          "Recent results error:",
          resultsResponse.reason
        );
      }

      if (userResponse.status === "fulfilled") {
        const userData = userResponse.value.data;
        setUser(userData?.user || userData?.data || userData);
      } else {
        failedRequests++;
        console.error(
          "User profile error:",
          userResponse.reason
        );
      }

      if (failedRequests === 3) {
        setError(
          "Unable to load dashboard data. Please try again."
        );
      } else if (failedRequests > 0) {
        setError(
          "Some dashboard information could not be loaded."
        );
      }

      setLoading(false);
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    return initialStats.map((stat) => {
      switch (stat.label) {
        case "Total Quizzes":
          return {
            ...stat,
            value: dashboardStats.totalQuizzes ?? 0,
          };

        case "Average Score":
          return {
            ...stat,
            value: `${Math.round(
              Number(dashboardStats.averageScore) || 0
            )}%`,
          };

        case "Total Attempts":
          return {
            ...stat,
            value: dashboardStats.totalAttempts ?? 0,
          };

        case "Best Score":
          return {
            ...stat,
            value: `${Math.round(
              Number(dashboardStats.bestScore) || 0
            )}%`,
          };

        default:
          return stat;
      }
    });
  }, [dashboardStats]);

  const recentResults = useMemo(() => {
    return results
      .map((result) => {
        const score = result.score ?? 0;
        const percentage =
          result.percentage ??
          (result.totalQuestions
            ? (Number(score) / result.totalQuestions) * 100
            : 0);

        return {
          id: result.attemptId || result._id,
          topic:
            result.topic ||
            result.quizId?.topic ||
            "Untitled Quiz",
          score:
            typeof score === "string" && score.includes("/")
              ? score
              : `${score}/${result.totalQuestions ?? 0}`,
          percentage: Math.round(Number(percentage) || 0),
          date:
            result.date ||
            result.submittedAt ||
            result.createdAt,
        };
      })
      .filter((result) =>
        result.topic
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [results, search]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-600">
              Welcome back
            </p>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Hello, {user?.name || user?.username || "Student"}!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Track your learning progress and improve your
              performance.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-slate-900">
                      {loading ? "..." : stat.value}
                    </h2>
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm lg:col-span-2">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles size={19} />
                  <span className="text-sm font-medium text-indigo-100">
                    Keep learning
                  </span>
                </div>

                <h2 className="text-2xl font-bold">
                  Ready for your next quiz?
                </h2>

                <p className="mt-2 max-w-lg text-sm text-indigo-100">
                  Practice regularly, test your knowledge, and
                  improve your scores.
                </p>
              </div>

              <Link
                to="/quizzes"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                Explore Quizzes
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <TrendingUp size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Your progress
                </h3>
                <p className="text-xs text-slate-500">
                  Average performance
                </p>
              </div>
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {loading
                ? "..."
                : `${Math.round(
                    Number(dashboardStats.averageScore) || 0
                  )}%`}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      Number(dashboardStats.averageScore) || 0
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Quiz Results
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review your latest quiz attempts.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search results..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading results...
            </div>
          ) : recentResults.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <BookOpen size={22} />
              </div>

              <h3 className="font-semibold text-slate-800">
                No quiz results found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Take a quiz to see your results here.
              </p>

              <Link
                to="/quizzes"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Start a quiz
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Quiz
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Score
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Percentage
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentResults.map((result) => (
                    <tr
                      key={result.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {result.topic}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {result.score}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            result.percentage >= 75
                              ? "bg-emerald-50 text-emerald-700"
                              : result.percentage >= 40
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {result.percentage}%
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(result.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}