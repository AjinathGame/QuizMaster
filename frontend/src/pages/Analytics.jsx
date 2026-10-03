
import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Flame,
  LayoutDashboard,
  Menu,
  Target,
  Trophy,
  X,
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

const scoreTrend = [
  { date: "Sep 1", score: 62 },
  { date: "Sep 3", score: 70 },
  { date: "Sep 5", score: 66 },
  { date: "Sep 7", score: 78 },
  { date: "Sep 9", score: 73 },
  { date: "Sep 11", score: 85 },
  { date: "Sep 13", score: 81 },
  { date: "Sep 15", score: 92 },
  { date: "Sep 17", score: 88 },
  { date: "Sep 19", score: 95 },
];

const subjectPerformance = [
  { subject: "JavaScript", score: 88 },
  { subject: "HTML & CSS", score: 95 },
  { subject: "Python", score: 72 },
  { subject: "Database", score: 81 },
  { subject: "DSA", score: 64 },
];

const difficultyData = [
  { name: "Easy", value: 92, color: "#10b981" },
  { name: "Medium", value: 78, color: "#6366f1" },
  { name: "Hard", value: 58, color: "#f59e0b" },
];

const recentActivity = [
  {
    title: "JavaScript Fundamentals",
    subject: "JavaScript",
    date: "Sep 19, 2026",
    score: 95,
    questions: 20,
  },
  {
    title: "Database Management",
    subject: "Database",
    date: "Sep 17, 2026",
    score: 80,
    questions: 15,
  },
  {
    title: "Python Programming",
    subject: "Python",
    date: "Sep 15, 2026",
    score: 72,
    questions: 20,
  },
  {
    title: "HTML & CSS Basics",
    subject: "HTML & CSS",
    date: "Sep 13, 2026",
    score: 90,
    questions: 10,
  },
];

const rangeOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("30");

  const filteredTrend =
    selectedRange === "7"
      ? scoreTrend.slice(-4)
      : selectedRange === "90"
      ? scoreTrend
      : scoreTrend.slice(-7);

  const averageScore = Math.round(
    scoreTrend.reduce((sum, item) => sum + item.score, 0) /
      scoreTrend.length
  );

  const totalQuestions = recentActivity.reduce(
    (sum, item) => sum + item.questions,
    0
  );

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

     <Navbar/>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Metric cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Quizzes"
            value="24"
            change={12}
            icon={FileText}
            color="bg-indigo-50 text-indigo-600"
            note="vs. previous period"
          />
          <MetricCard
            title="Average Score"
            value={`${averageScore}%`}
            change={8}
            icon={Trophy}
            color="bg-amber-50 text-amber-600"
            note="vs. previous period"
          />
          <MetricCard
            title="Accuracy"
            value="82%"
            change={5}
            icon={Target}
            color="bg-emerald-50 text-emerald-600"
            note="vs. previous period"
          />
          <MetricCard
            title="Study Time"
            value="18.5h"
            change={-3}
            icon={Clock3}
            color="bg-violet-50 text-violet-600"
            note="vs. previous period"
          />
        </section>

        {/* Score trend and performance summary */}
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
                  className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={filteredTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
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
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                    }}
                    formatter={(value) => [`${value}%`, "Score"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#scoreGradient)"
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance summary */}
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
                    strokeDasharray={`${2 * Math.PI * 72 * 0.82} ${
                      2 * Math.PI * 72
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-900">82%</span>
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
                  <span className="text-sm text-slate-600">Correct answers</span>
                </div>
                <span className="text-sm font-bold text-slate-900">82%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="text-sm text-slate-600">Incorrect answers</span>
                </div>
                <span className="text-sm font-bold text-slate-900">18%</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <Activity size={18} className="mt-0.5 shrink-0 text-indigo-600" />
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

        {/* Subject and difficulty charts */}
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
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                    }}
                    formatter={(value) => [`${value}%`, "Average score"]}
                  />
                  <Bar
                    dataKey="score"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                  >
                    {subjectPerformance.map((item, index) => (
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

            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <Target size={18} className="mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Practice challenging questions
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    Your sample data shows a lower score on hard questions. Try focused practice in this area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent activity */}
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
                {recentActivity.map((activity) => (
                  <tr
                    key={activity.title}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {activity.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {activity.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {activity.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {activity.questions}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">
                        {activity.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={13} />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom insight card */}
        <section className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center gap-2 text-indigo-100">
                <Flame size={19} />
                <span className="text-sm font-semibold">Your learning journey</span>
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
          Analytics are currently based on demonstration data.
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