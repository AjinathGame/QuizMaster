
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  Trophy,
  BarChart3,
  UserRound,
  Bell,
  Search,
  ChevronDown,
  Clock3,
  BookOpen,
  Play,
  CheckCircle2,
  CircleHelp,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  MoreVertical,
  Brain,
  Code2,
  Database,
  Atom,
  Menu,
  X,
} from "lucide-react";
import Navbar from "../component/navbar/Navbar";
const quizData = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    topic: "JavaScript",
    difficulty: "Medium",
    questions: 10,
    duration: 15,
    status: "Available",
    icon: Code2,
    color: "blue",
    date: "Today",
  },
  {
    id: 2,
    title: "Python Programming",
    topic: "Python",
    difficulty: "Easy",
    questions: 15,
    duration: 20,
    status: "Completed",
    icon: Brain,
    color: "emerald",
    date: "Yesterday",
  },
  {
    id: 3,
    title: "Database Management",
    topic: "DBMS",
    difficulty: "Hard",
    questions: 20,
    duration: 30,
    status: "Available",
    icon: Database,
    color: "violet",
    date: "2 days ago",
  },
  {
    id: 4,
    title: "React Fundamentals",
    topic: "React",
    difficulty: "Medium",
    questions: 10,
    duration: 15,
    status: "Completed",
    icon: Code2,
    color: "cyan",
    date: "3 days ago",
  },
  {
    id: 5,
    title: "Artificial Intelligence Basics",
    topic: "Artificial Intelligence",
    difficulty: "Easy",
    questions: 5,
    duration: 10,
    status: "Available",
    icon: Atom,
    color: "amber",
    date: "4 days ago",
  },
  {
    id: 6,
    title: "Advanced JavaScript",
    topic: "JavaScript",
    difficulty: "Hard",
    questions: 20,
    duration: 30,
    status: "Available",
    icon: Code2,
    color: "rose",
    date: "5 days ago",
  },
];

const colorStyles = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  cyan: "bg-cyan-50 text-cyan-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function MyQuizzes() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);

  const completedCount = quizData.filter(
    (quiz) => quiz.status === "Completed"
  ).length;

  const filteredQuizzes = useMemo(() => {
    return quizData.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(search.toLowerCase()) ||
        quiz.topic.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" || quiz.difficulty === difficulty;

      const matchesTab =
        activeTab === "All" || quiz.status === activeTab;

      return matchesSearch && matchesDifficulty && matchesTab;
    });
  }, [search, difficulty, activeTab]);

  return (
    <main className="min-h-screen bg-[#f4f7fc] text-slate-800">
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up {
          animation: fadeUp .55s ease-out both;
        }
      `}</style>

      <Navbar />

      {/* Main */}
      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center animate-fade-up">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold tracking-wide text-blue-600">
              <ClipboardList size={16} />
              YOUR LEARNING LIBRARY
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#142a59] sm:text-3xl">
              My Quizzes
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage your quizzes, continue practicing, and track your learning journey.
            </p>
          </div>

          <Link
            to="/generate-quiz"
            className="group inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
          >
            <Sparkles size={17} />
            Create New Quiz
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Quizzes",
              value: quizData.length,
              icon: ClipboardList,
              color: "blue",
              description: "Quizzes in your library",
            },
            {
              label: "Completed",
              value: completedCount,
              icon: CheckCircle2,
              color: "emerald",
              description: "Quizzes already attempted",
            },
            {
              label: "Available",
              value: quizData.length - completedCount,
              icon: Play,
              color: "violet",
              description: "Ready to start",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-fade-up rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-[#142a59]">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-xl ${
                      colorStyles[stat.color]
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quiz library */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-extrabold text-[#142a59]">
                Your Quiz Library
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Browse and manage your generated quizzes.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 sm:w-64">
                <Search size={17} className="shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search quizzes..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Difficulty filter */}
              <div className="relative flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400">
                <SlidersHorizontal size={16} className="text-slate-400" />
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-slate-600 outline-none"
                >
                  <option value="All">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-100 pb-3">
            {["All", "Available", "Completed"].map((tab) => {
              const active = activeTab === tab;
              const count =
                tab === "All"
                  ? quizData.length
                  : quizData.filter((quiz) => quiz.status === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {tab}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cards */}
          {filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredQuizzes.map((quiz, index) => {
                const Icon = quiz.icon;
                const completed = quiz.status === "Completed";

                return (
                  <article
                    key={quiz.id}
                    style={{ animationDelay: `${index * 80}ms` }}
                    className="group animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_15px_35px_rgba(37,99,235,0.09)]"
                  >
                    <div className="p-5">
                      <div className="mb-5 flex items-start justify-between">
                        <div
                          className={`grid h-12 w-12 place-items-center rounded-xl transition duration-300 group-hover:scale-110 ${
                            colorStyles[quiz.color]
                          }`}
                        >
                          <Icon size={23} />
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                              completed
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {quiz.status}
                          </span>
                          <button
                            aria-label={`More options for ${quiz.title}`}
                            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          >
                            <MoreVertical size={17} />
                          </button>
                        </div>
                      </div>

                      <h3 className="min-h-[48px] text-base font-extrabold leading-6 text-[#142a59] transition-colors group-hover:text-blue-700">
                        {quiz.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Topic: {quiz.topic}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <span
                          className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${
                            quiz.difficulty === "Easy"
                              ? "bg-emerald-50 text-emerald-700"
                              : quiz.difficulty === "Medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {quiz.difficulty}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Created {quiz.date}
                        </span>
                      </div>

                      <div className="my-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                        <div className="flex items-center gap-2">
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                            <CircleHelp size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400">
                              Questions
                            </p>
                            <p className="text-sm font-bold text-slate-700">
                              {quiz.questions}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">
                            <Clock3 size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400">
                              Duration
                            </p>
                            <p className="text-sm font-bold text-slate-700">
                              {quiz.duration} min
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        to="/quiz-attempt"
                        state={{ quizId: quiz.id }}
                        className={`group/button flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                          completed
                            ? "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            : "bg-blue-600 text-white shadow-md shadow-blue-100 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                        }`}
                      >
                        {completed ? "Practice Again" : "Start Quiz"}
                        {completed ? (
                          <RotateIcon />
                        ) : (
                          <ArrowRight
                            size={17}
                            className="transition-transform group-hover/button:translate-x-1"
                          />
                        )}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Filter size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No quizzes found
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Try changing your search or filters to find quizzes.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setDifficulty("All");
                  setActiveTab("All");
                }}
                className="mt-5 cursor-pointer text-sm font-bold text-blue-600 transition hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Bottom callout */}
        <section className="mt-7 flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-lg shadow-blue-100 sm:flex-row sm:items-center sm:p-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-100">
              <Sparkles size={16} />
              <span className="text-xs font-bold tracking-wider">
                KEEP LEARNING
              </span>
            </div>
            <h2 className="text-xl font-extrabold sm:text-2xl">
              Ready for your next challenge?
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-blue-100">
              Generate a new AI-powered quiz and continue improving your knowledge.
            </p>
          </div>
          <Link
            to="/generate-quiz"
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
          >
            Create Quiz
            <ArrowRight size={17} />
          </Link>
        </section>
      </section>
    </main>
  );
}

function RotateIcon() {
  return <Clock3 size={16} />;
}