
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
  LayoutDashboard,
  RotateCcw,
  UserRound,
  Menu,
  X,
  Sparkles,
  Target,
  Award,
} from "lucide-react";
import Navbar from "../component/navbar/Navbar.jsx";

export default function Result() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const result = {
    topic: "JavaScript",
    score: 5,
    total: 5,
    correct: 5,
    incorrect: 0,
    timeTaken: "2m 45s",
    timeExpired: false,
  };

  const percentage = Math.round((result.score / result.total) * 100);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= percentage) {
        current = percentage;
        clearInterval(interval);
      }
      setAnimatedScore(current);
    }, 20);

    return () => clearInterval(interval);
  }, [percentage]);

  const getMessage = () => {
    if (percentage === 100) return "Outstanding Performance!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job! Keep Improving.";
    return "Keep Practicing!";
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-slate-800">
     <Navbar />
      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Completion heading */}
        <section className="mb-8 animate-[fadeIn_0.6s_ease-out] text-center">
          <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <Trophy size={42} className="animate-[bounce_1.5s_ease-in-out_infinite]" />
            <Sparkles
              size={20}
              className="absolute -right-2 -top-1 text-blue-500"
            />
          </div>

          <p className="mb-2 text-xs font-extrabold uppercase tracking-[3px] text-blue-600">
            Quiz Completed
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {getMessage()}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Great job! You have successfully completed your{" "}
            <span className="font-semibold text-slate-700">
              {result.topic} Quiz
            </span>
            . Here is your performance summary.
          </p>
        </section>

        {/* Main score card */}
        <section className="mx-auto max-w-4xl rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_15px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:shadow-[0_20px_60px_rgba(15,23,42,0.09)] sm:p-9">
          <div className="grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
            {/* Score circle */}
            <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-8">
              <div className="relative flex h-52 w-52 items-center justify-center">
                <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
                  <circle
                    cx="110"
                    cy="110"
                    r="88"
                    fill="none"
                    stroke="#e8eef5"
                    strokeWidth="15"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="88"
                    fill="none"
                    stroke="#10b99b"
                    strokeWidth="15"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={
                      2 * Math.PI * 88 -
                      (animatedScore / 100) * 2 * Math.PI * 88
                    }
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {animatedScore}%
                  </span>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Score
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <Award size={17} />
                {percentage === 100 ? "Perfect Score" : "Quiz Completed"}
              </div>
            </div>

            {/* Result details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-400">
                  Your Score
                </p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900">
                  {result.score}
                  <span className="ml-1 text-xl font-semibold text-slate-400">
                    / {result.total}
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  You answered {result.correct} questions correctly out of{" "}
                  {result.total}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={19} />
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Correct Answers
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">
                    {result.correct}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-500">
                    <XCircle size={19} />
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Incorrect Answers
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">
                    {result.incorrect}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Clock3 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Time Taken
                    </p>
                    <p className="mt-1 font-bold text-slate-800">
                      {result.timeTaken}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500">
                    Time Expired
                  </p>
                  <p className="mt-1 text-sm font-bold text-emerald-600">
                    {result.timeExpired ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance summary */}
        <section className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:scale-110">
              <CheckCircle2 size={22} />
            </div>
            <p className="text-sm text-slate-500">Accuracy</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">
              {percentage}%
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-110">
              <Target size={22} />
            </div>
            <p className="text-sm text-slate-500">Total Questions</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">
              {result.total}
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:scale-110">
              <Clock3 size={22} />
            </div>
            <p className="text-sm text-slate-500">Time Taken</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">
              {result.timeTaken}
            </p>
          </div>
        </section>

        {/* Action buttons */}
        <section className="mx-auto mt-8 flex max-w-4xl flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/answer-review"
            className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-50"
          >
            <RotateCcw size={17} />
            View Answer Review
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
          >
            <LayoutDashboard size={17} />
            Back to Dashboard
          </Link>
        </section>
      </main>
    </div>
  );
}