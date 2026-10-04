
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Flame,
  Target,
  Trophy,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/navbar/Navbar.jsx";
import api from "../api/api";

const rangeOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

const difficultyColors = {
  Easy: "#10b981",
  Medium: "#6366f1",
  Hard: "#f59e0b",
};

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.attempts)) return data.attempts;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getScore = (item) => {
  if (typeof item.percentage === "number") return item.percentage;

  const score = Number(item.score ?? 0);
  const total = Number(item.totalQuestions ?? item.total ?? 0);

  if (total > 0) return (score / total) * 100;
  return 0;
};

const getDate = (item) =>
  item.submittedAt || item.completedAt || item.createdAt || item.date;

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getQuizTitle = (item) =>
  item.quizTitle ||
  item.title ||
  item.quiz?.title ||
  item.topic ||
  "Quiz";

const getSubject = (item) =>
  item.subject ||
  item.category ||
  item.topic ||
  item.quiz?.subject ||
  "Other";

const getDifficulty = (item) =>
  String(item.difficulty || item.quiz?.difficulty || "Unknown")
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());

function MetricCard({ title, value, change, icon: Icon, color, note }) {
  const positive = change >= 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold ${
            positive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {Math.abs(change)}%
        </span>
        <span className="text-xs text-slate-400">{note}</span>
      </div>
    </div>
  );
}

export default function Analytics() {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [selectedRange, setSelectedRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/attempts/my-results");
        const data = getArray(response.data);

        if (active) {
          setAttempts(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load analytics. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      active = false;
    };
  }, []);

  const completedAttempts = useMemo(
    () =>
      attempts.filter(
        (item) =>
          item.status === undefined ||
          ["completed", "submitted", "success"].includes(
            String(item.status).toLowerCase()
          )
      ),
    [attempts]
  );

  const averageScore = useMemo(() => {
    if (!completedAttempts.length) return 0;

    return Math.round(
      completedAttempts.reduce((sum, item) => sum + getScore(item), 0) /
        completedAttempts.length
    );
  }, [completedAttempts]);

  const totalQuestions = useMemo(
    () =>
      completedAttempts.reduce(
        (sum, item) =>
          sum + Number(item.totalQuestions ?? item.total ?? 0),
        0
      ),
    [completedAttempts]
  );

  const totalCorrect = useMemo(
    () =>
      completedAttempts.reduce(
        (sum, item) =>
          sum +
          Number(
            item.correctAnswers ??
              item.correct ??
              (item.totalQuestions
                ? (getScore(item) / 100) * item.totalQuestions
                : 0)
          ),
        0
      ),
    [completedAttempts]
  );

  const accuracy = totalQuestions
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : averageScore;

  const filteredAttempts = useMemo(() => {
    const days = Number(selectedRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return completedAttempts
      .filter((item) => {
        const date = getDate(item);
        if (!date) return false;

        const parsed = new Date(date);
        return !Number.isNaN(parsed.getTime()) && parsed >= cutoff;
      })
      .sort(
        (a, b) => new Date(getDate(a)) - new Date(getDate(b))
      );
  }, [completedAttempts, selectedRange]);

  const scoreTrend = useMemo(
    () =>
      filteredAttempts.map((item) => ({
        date: getDate(item)
          ? new Date(getDate(item)).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })
          : "N/A",
        score: Math.round(getScore(item)),
      })),
    [filteredAttempts]
  );

  const subjectPerformance = useMemo(() => {
    const grouped = {};

    completedAttempts.forEach((item) => {
      const subject = getSubject(item);

      if (!grouped[subject]) {
        grouped[subject] = { total: 0, count: 0 };
      }

      grouped[subject].total += getScore(item);
      grouped[subject].count += 1;
    });

    return Object.entries(grouped).map(([subject, data]) => ({
      subject,
      score: Math.round(data.total / data.count),
    }));
  }, [completedAttempts]);

  const difficultyData = useMemo(() => {
    const grouped = {};

    completedAttempts.forEach((item) => {
      const difficulty = getDifficulty(item);

      if (!["Easy", "Medium", "Hard"].includes(difficulty)) return;

      if (!grouped[difficulty]) {
        grouped[difficulty] = { total: 0, count: 0 };
      }

      grouped[difficulty].total += getScore(item);
      grouped[difficulty].count += 1;
    });

    return ["Easy", "Medium", "Hard"]
      .filter((name) => grouped[name])
      .map((name) => ({
        name,
        value: Math.round(grouped[name].total / grouped[name].count),
        color: difficultyColors[name],
      }));
  }, [completedAttempts]);

  const recentActivity = useMemo(
    () =>
      [...completedAttempts]
        .sort(
          (a, b) => new Date(getDate(b) || 0) - new Date(getDate(a) || 0)
        )
        .slice(0, 5),
    [completedAttempts]
  );

  const previousAverage = useMemo(() => {
    const days = Number(selectedRange);
    const currentStart = new Date();
    currentStart.setDate(currentStart.getDate() - days);

    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - days);

    const previous = completedAttempts.filter((item) => {
      const date = getDate(item);
      if (!date) return false;

      const parsed = new Date(date);
      return parsed >= previousStart && parsed < currentStart;
    });

    if (!previous.length) return null;

    return previous.reduce((sum, item) => sum + getScore(item), 0) /
      previous.length;
  }, [completedAttempts, selectedRange]);

  const scoreChange =
    previousAverage === null
      ? 0
      : Math.round(averageScore - previousAverage);

  const accuracyChange = scoreChange;

  const totalStudyTime = completedAttempts.reduce(
    (sum, item) => sum + Number(item.durationSeconds ?? item.duration ?? 0),
    0
  );

  const studyHours = (totalStudyTime / 3600).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.45s ease-out both;
        }
      `}</style>

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="fade-up mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
                <BarChart3 size={22} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Performance Analytics
              </h1>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Track your progress, analyze your results, and identify areas to improve.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 shadow-sm sm:self-auto">
            <CalendarDays size={17} className="text-indigo-600" />
            <span>Performance overview</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading your analytics...
          </div>
        ) : (
          <>
            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Total Quizzes"
                value={completedAttempts.length}
                change={0}
                icon={FileText}
                color="bg-indigo-50 text-indigo-600"
                note="Completed attempts"
              />
              <MetricCard
                title="Average Score"
                value={`${averageScore}%`}
                change={scoreChange}
                icon={Trophy}
                color="bg-amber-50 text-amber-600"
                note="Compared with previous period"
              />
              <MetricCard
                title="Accuracy"
                value={`${accuracy}%`}
                change={accuracyChange}
                icon={Target}
                color="bg-emerald-50 text-emerald-600"
                note="Based on answered questions"
              />
              <MetricCard
                title="Study Time"
                value={`${studyHours}h`}
                change={0}
                icon={Clock3}
                color="bg-violet-50 text-violet-600"
                note="Recorded attempt duration"
              />
            </section>

            <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Score Progress
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Your quiz scores over time
                    </p>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedRange}
                      onChange={(event) => setSelectedRange(event.target.value)}
                      className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {rangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div className="h-72 w-full">
                  {scoreTrend.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={scoreTrend}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="scoreGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#6366f1"
                              stopOpacity={0.22}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366f1"
                              stopOpacity={0.01}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                          dy={10}
                        />
                        <YAxis
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Score"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#6366f1"
                          strokeWidth={3}
                          fill="url(#scoreGradient)"
                          activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No quiz attempts in this period.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Performance Summary
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your overall quiz performance
                </p>

                <div className="my-7 flex justify-center">
                  <div className="relative h-44 w-44">
                    <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
                      <circle
                        cx="90"
                        cy="90"
                        r="72"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="14"
                      />
                      <circle
                        cx="90"
                        cy="90"
                        r="72"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 72 * (accuracy / 100)} ${2 * Math.PI * 72}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-slate-900">
                        {accuracy}%
                      </span>
                      <span className="mt-1 text-xs font-medium text-slate-500">
                        Overall accuracy
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                      <span className="text-sm text-slate-600">
                        Correct answers
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {accuracy}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                      <span className="text-sm text-slate-600">
                        Incorrect answers
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {100 - accuracy}%
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-indigo-50 p-4">
                  <div className="flex items-start gap-3">
                    <Activity
                      size={18}
                      className="mt-0.5 shrink-0 text-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">
                        Keep building consistency
                      </p>
                      <p className="mt-1 text-xs leading-5 text-indigo-700">
                        Review your recent attempts to identify topics that need more practice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Subject-wise Performance
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Compare your average scores across subjects
                  </p>
                </div>

                <div className="h-72 w-full">
                  {subjectPerformance.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjectPerformance}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="subject"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          interval={0}
                        />
                        <YAxis
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Average score"]}
                        />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={42}>
                          {subjectPerformance.map((item) => (
                            <Cell
                              key={item.subject}
                              fill={
                                item.score >= 85
                                  ? "#10b981"
                                  : item.score >= 70
                                  ? "#6366f1"
                                  : "#f59e0b"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No subject data available.
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                    85% and above
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
                    70%–84%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                    Below 70%
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Difficulty Analysis
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your average score by question difficulty
                  </p>
                </div>

                {difficultyData.length ? (
                  <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_1fr]">
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={difficultyData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                            stroke="none"
                          >
                            {difficultyData.map((item) => (
                              <Cell key={item.name} fill={item.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Average score"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-5">
                      {difficultyData.map((item) => (
                        <div key={item.name}>
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-medium text-slate-600">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                              {item.value}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${item.value}%`,
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                    No difficulty data available.
                  </div>
                )}

                <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <Target
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Practice challenging questions
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        Use your difficulty analysis to decide which questions need more practice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Quiz Activity
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    A summary of your latest quiz attempts
                  </p>
                </div>
                <Link
                  to="/results"
                  className="inline-flex items-center gap-2 self-start text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                  View all results
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-4">Quiz</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Questions</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentActivity.length ? (
                      recentActivity.map((activity, index) => (
                        <tr
                          key={activity._id || activity.attemptId || index}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">
                              {getQuizTitle(activity)}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {getSubject(activity)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {formatDate(getDate(activity))}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {activity.totalQuestions ?? activity.total ?? "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-900">
                              {Math.round(getScore(activity))}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 size={13} />
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-10 text-center text-sm text-slate-400"
                        >
                          No quiz attempts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <section className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center gap-2 text-indigo-100">
                <Flame size={19} />
                <span className="text-sm font-semibold">
                  Your learning journey
                </span>
              </div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Every attempt is a step forward.
              </h2>
              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Use your analytics to find topics that need attention and create quizzes that match your learning goals.
              </p>
            </div>
            <button
              onClick={() => navigate("/generate-quiz")}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 md:self-auto"
            >
              Generate New Quiz
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <div className="mb-4 text-center text-xs text-slate-400">
          Analytics are based on your recorded quiz attempts.
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 QuizMaster. All rights reserved.</p>
          <p>Learn. Practice. Improve.</p>
        </div>
      </footer>
    </div>
  );
}

