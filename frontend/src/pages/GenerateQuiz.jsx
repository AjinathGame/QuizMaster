
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Clock3,
  Hash,
  Zap,
  CheckCircle2,
  WandSparkles,
  Bot,
  ArrowRight,
  ChevronDown,
  Brain,
  BarChart3,
  Lightbulb,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import Navbar from "../component/navbar/Navbar";
import api from "../api/api";

export default function GenerateQuiz() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState(10);
  const [duration, setDuration] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const difficulties = [
    {
      name: "Easy",
      description: "Start with the basics",
      color: "emerald",
    },
    {
      name: "Medium",
      description: "Test your understanding",
      color: "blue",
    },
    {
      name: "Hard",
      description: "Challenge yourself",
      color: "rose",
    },
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a quiz topic.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/quizzes/generate", {
        topic: topic.trim(),
        difficulty,
        questions,
        duration,
      });

      const quiz = response.data?.quiz || response.data;

      if (!quiz?._id && !quiz?.id) {
        setError("Quiz generated, but the quiz ID was not returned by the server.");
        return;
      }

      navigate(`/quiz/${quiz._id || quiz.id}`, {
        state: { quiz },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to generate quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const colorClasses = {
    Easy: {
      selected: "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100",
      hover: "hover:border-emerald-300",
      icon: "bg-emerald-100 text-emerald-600",
    },
    Medium: {
      selected: "border-blue-500 bg-blue-50 ring-2 ring-blue-100",
      hover: "hover:border-blue-300",
      icon: "bg-blue-100 text-blue-600",
    },
    Hard: {
      selected: "border-rose-400 bg-rose-50 ring-2 ring-rose-100",
      hover: "hover:border-rose-300",
      icon: "bg-rose-100 text-rose-600",
    },
  };

  return (
    <main className="min-h-screen bg-[#f4f7fc] text-slate-800">
      <style>{`
        @keyframes fadeUp {
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

        .animate-fade-up {
          animation: fadeUp .7s ease-out both;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center animate-fade-up">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Sparkles size={16} />
              AI POWERED LEARNING
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#142a59] sm:text-3xl">
              AI Quiz Generator
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Create personalized quizzes with AI. Choose your topic,
              difficulty level, and quiz settings to get started.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <Zap size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Powered by</p>
              <p className="text-sm font-bold text-slate-800">Gemini AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.65fr_1fr]">
          <div className="animate-fade-up rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_35px_rgba(30,64,120,0.05)] sm:p-8">
            <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <WandSparkles size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#142a59]">
                  Customize your quiz
                </h2>
                <p className="text-sm text-slate-500">
                  Set your preferences below
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-7">
              <div>
                <label
                  htmlFor="topic"
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
                >
                  <BookOpen size={16} className="text-blue-600" />
                  Quiz Topic
                </label>

                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. JavaScript, React, Python, DBMS..."
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Enter any subject or topic you want to practice.
                </p>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-700">
                  Difficulty Level
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {difficulties.map((item) => {
                    const selected = difficulty === item.name;
                    const colors = colorClasses[item.name];

                    return (
                      <button
                        key={item.name}
                        type="button"
                        disabled={loading}
                        onClick={() => setDifficulty(item.name)}
                        aria-pressed={selected}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                          selected
                            ? colors.selected
                            : `border-slate-200 ${colors.hover}`
                        }`}
                      >
                        <div
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${colors.icon}`}
                        >
                          {item.name === "Easy" ? (
                            <CheckCircle2 size={20} />
                          ) : item.name === "Medium" ? (
                            <Zap size={20} />
                          ) : (
                            <Brain size={20} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">
                            {item.name}
                          </p>
                          <p className="mt-1 text-[11px] leading-4 text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="questionCount"
                    className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
                  >
                    <Hash size={16} className="text-blue-600" />
                    Number of Questions
                  </label>

                  <div className="relative">
                    <select
                      id="questionCount"
                      value={questions}
                      onChange={(e) => setQuestions(Number(e.target.value))}
                      disabled={loading}
                      className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {[5, 10, 15, 20, 25].map((count) => (
                        <option key={count} value={count}>
                          {count} Questions
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
                  >
                    <Clock3 size={16} className="text-blue-600" />
                    Quiz Duration
                  </label>

                  <div className="relative">
                    <select
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      disabled={loading}
                      className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {[5, 10, 15, 20, 30, 45, 60].map((minutes) => (
                        <option key={minutes} value={minutes}>
                          {minutes} Minutes
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Topic</p>
                  <p className="mt-1 truncate text-sm font-bold text-[#142a59]">
                    {topic || "Not selected"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Difficulty</p>
                  <p className="mt-1 text-sm font-bold text-[#142a59]">
                    {difficulty}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-slate-500">Questions / Time</p>
                  <p className="mt-1 text-sm font-bold text-[#142a59]">
                    {questions} / {duration} min
                  </p>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles
                      size={18}
                      className="transition-transform duration-300 group-hover:rotate-12"
                    />
                    Generate Quiz
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                AI-generated questions will be prepared based on your settings.
              </p>
            </form>
          </div>

          <aside className="space-y-5 animate-fade-up [animation-delay:150ms]">
            <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-[#eaf2ff] via-white to-[#eaf5ff] p-6 sm:p-8">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-200/40 blur-2xl" />

              <div className="relative z-10">
                <div className="animate-float mx-auto mb-5 grid h-32 w-32 place-items-center rounded-[2rem] border border-blue-100 bg-white/80 text-blue-600 shadow-xl shadow-blue-100">
                  <div className="relative">
                    <Bot size={68} strokeWidth={1.5} />
                    <Sparkles
                      size={22}
                      className="absolute -right-4 -top-2 text-amber-400"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700">
                    <Sparkles size={12} />
                    SMART QUIZ CREATION
                  </span>

                  <h3 className="mt-4 text-xl font-extrabold text-[#142a59]">
                    Let AI Create Your Perfect Quiz
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Get personalized questions with carefully selected options
                    and explanations to improve your knowledge.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-base font-bold text-[#142a59]">
                Why use AI quizzes?
              </h3>

              <div className="space-y-5">
                {[
                  {
                    icon: Brain,
                    title: "Personalized Practice",
                    description: "Choose any topic and difficulty.",
                  },
                  {
                    icon: Clock3,
                    title: "Timed Assessments",
                    description: "Practice with a time limit.",
                  },
                  {
                    icon: BarChart3,
                    title: "Track Your Progress",
                    description: "Review your results after each quiz.",
                  },
                ].map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-1"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {feature.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-600">
                <Lightbulb size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-amber-900">
                  Quick Tip
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-800/80">
                  Start with a familiar topic and medium difficulty to get
                  comfortable with your quiz experience.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

