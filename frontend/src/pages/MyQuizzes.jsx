
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Search,
  ChevronDown,
  Clock3,
  ArrowRight,
  MoreVertical,
  Brain,
  Code2,
  Database,
  Atom,
  CircleHelp,
  Filter,
  SlidersHorizontal,
  LoaderCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import Navbar from "../component/navbar/Navbar";
import api from "../api/api";

const colorStyles = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  cyan: "bg-cyan-50 text-cyan-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

const getQuizIcon = (topic = "") => {
  const value = topic.toLowerCase();

  if (
    value.includes("python") ||
    value.includes("ai") ||
    value.includes("artificial intelligence")
  ) {
    return Brain;
  }

  if (
    value.includes("javascript") ||
    value.includes("react") ||
    value.includes("programming")
  ) {
    return Code2;
  }

  if (
    value.includes("database") ||
    value.includes("dbms") ||
    value.includes("sql")
  ) {
    return Database;
  }

  if (
    value.includes("science") ||
    value.includes("physics") ||
    value.includes("chemistry")
  ) {
    return Atom;
  }

  return Brain;
};

const getQuizColor = (difficulty = "") => {
  const colors = {
    Easy: "emerald",
    Medium: "blue",
    Hard: "rose",
  };

  return colors[difficulty] || "violet";
};

const getQuizStatus = (quiz) => {
  if (quiz.status) {
    return quiz.status.toLowerCase() === "completed"
      ? "Completed"
      : "Available";
  }

  if (quiz.completed === true || quiz.isCompleted === true) {
    return "Completed";
  }

  return "Available";
};

const getQuestionCount = (quiz) => {
  if (typeof quiz.questions === "number") {
    return quiz.questions;
  }

  if (Array.isArray(quiz.questions)) {
    return quiz.questions.length;
  }

  if (typeof quiz.totalQuestions === "number") {
    return quiz.totalQuestions;
  }

  return 0;
};

const getDuration = (quiz) => {
  return quiz.duration ?? quiz.timeLimit ?? 0;
};

const formatDate = (date) => {
  if (!date) return "Recently";

  const created = new Date(date);

  if (Number.isNaN(created.getTime())) return "Recently";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (created.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (created.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return created.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const normalizeQuiz = (quiz) => {
  const topic = quiz.topic || quiz.title || quiz.name || "General";
  const title = quiz.title || quiz.name || `${topic} Quiz`;

  return {
    ...quiz,
    id: quiz._id || quiz.id,
    title,
    topic,
    difficulty: quiz.difficulty || "Medium",
    questions: getQuestionCount(quiz),
    duration: getDuration(quiz),
    status: getQuizStatus(quiz),
    icon: getQuizIcon(topic),
    color: getQuizColor(quiz.difficulty),
    date: formatDate(quiz.createdAt || quiz.created_at),
  };
};

export default function MyQuizzes() {
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/quizzes");

        const data = response.data;
        const quizzes = Array.isArray(data)
          ? data
          : data.quizzes || data.data || [];

        setQuizData(quizzes.map(normalizeQuiz));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load quizzes. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const completedCount = quizData.filter(
    (quiz) => quiz.status === "Completed"
  ).length;

  const availableCount = quizData.length - completedCount;

  const filteredQuizzes = useMemo(() => {
    return quizData.filter((quiz) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        quiz.title.toLowerCase().includes(searchValue) ||
        quiz.topic.toLowerCase().includes(searchValue);

      const matchesDifficulty =
        difficulty === "All" || quiz.difficulty === difficulty;

      const matchesTab =
        activeTab === "All" || quiz.status === activeTab;

      return matchesSearch && matchesDifficulty && matchesTab;
    });
  }, [quizData, search, difficulty, activeTab]);

  const handleStartQuiz = (quiz) => {
    if (!quiz.id) {
      setError("This quiz does not have a valid ID.");
      return;
    }

    navigate("/quiz-attempt", {
      state: {
        quizId: quiz.id,
        quiz,
      },
    });
  };

  const clearFilters = () => {
    setSearch("");
    setDifficulty("All");
    setActiveTab("All");
  };

  const stats = [
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
      value: availableCount,
      icon: ArrowRight,
      color: "violet",
      description: "Ready to start",
    },
  ];

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

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 animate-fade-up sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold tracking-wide text-blue-600">
              <ClipboardList size={16} />
              YOUR LEARNING LIBRARY
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#142a59] sm:text-3xl">
              My Quizzes
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage your quizzes, continue practicing, and track your
              learning journey.
            </p>
          </div>

          <Link
            to="/generate-quiz"
            className="group inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
          >
            <Sparkles size={17} />
            Create New Quiz
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => {
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
                    className={`grid h-12 w-12 place-items-center rounded-xl ${colorStyles[stat.color]}`}
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
              <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 sm:w-64">
                <Search size={17} className="shrink-0 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search quizzes..."
                  aria-label="Search quizzes"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="relative flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400">
                <SlidersHorizontal size={16} className="text-slate-400" />

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  aria-label="Filter by difficulty"
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
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={active}
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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <LoaderCircle
                size={35}
                className="animate-spin text-blue-600"
              />
              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading your quizzes...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
                <AlertCircle size={28} />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                Unable to load quizzes
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredQuizzes.map((quiz, index) => {
                const Icon = quiz.icon;
                const completed = quiz.status === "Completed";

                return (
                  <article
                    key={quiz.id || index}
                    style={{ animationDelay: `${index * 80}ms` }}
                    className="group animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_15px_35px_rgba(37,99,235,0.09)]"
                  >
                    <div className="p-5">
                      <div className="mb-5 flex items-start justify-between">
                        <div
                          className={`grid h-12 w-12 place-items-center rounded-xl transition duration-300 group-hover:scale-110 ${colorStyles[quiz.color]}`}
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
                            type="button"
                            aria-label={`More options for ${quiz.title}`}
                            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            onClick={() => {
                              if (quiz.id) {
                                navigate(`/quiz-attempt`, {
                                  state: { quizId: quiz.id, quiz },
                                });
                              }
                            }}
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

                      <button
                        type="button"
                        onClick={() => handleStartQuiz(quiz)}
                        className={`group/button flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                          completed
                            ? "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            : "bg-blue-600 text-white shadow-md shadow-blue-100 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                        }`}
                      >
                        {completed ? "Practice Again" : "Start Quiz"}

                        {completed ? (
                          <RotateCcw size={16} />
                        ) : (
                          <ArrowRight
                            size={17}
                            className="transition-transform group-hover/button:translate-x-1"
                          />
                        )}
                      </button>
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
                type="button"
                onClick={clearFilters}
                className="mt-5 cursor-pointer text-sm font-bold text-blue-600 transition hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

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
              Generate a new AI-powered quiz and continue improving your
              knowledge.
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
