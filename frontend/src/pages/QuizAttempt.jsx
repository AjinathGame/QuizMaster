
import { useEffect, useState } from "react";
import {
  GraduationCap,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  Circle,
  LayoutGrid,
  LogOut,
  UserRound,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../component/navbar/Navbar.jsx";

const questions = [
  {
    id: 1,
    question:
      "Which method is used to add one or more elements to the end of an array in JavaScript?",
    options: ["push()", "pop()", "shift()", "unshift()"],
  },
  {
    id: 2,
    question: "Which keyword is used to declare a constant in JavaScript?",
    options: ["var", "let", "const", "static"],
  },
  {
    id: 3,
    question: "What does the map() method return?",
    options: [
      "A new array",
      "A single value",
      "An object",
      "A boolean",
    ],
  },
  {
    id: 4,
    question: "Which symbol is used for strict equality in JavaScript?",
    options: ["==", "=", "===", "!="],
  },
  {
    id: 5,
    question: "Which function converts JSON text into a JavaScript object?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.convert()",
      "JSON.object()",
    ],
  },
];

export default function QuizAttempt() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [showSubmit, setShowSubmit] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const selectAnswer = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex,
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const handleSubmit = () => {
    setSubmitted(true);
    setShowSubmit(false);
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl animate-[fadeIn_0.5s_ease-out]">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 size={42} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Quiz Submitted!
          </h1>
          <p className="mt-3 text-slate-500">
            Your answers have been submitted successfully.
          </p>
          <div className="my-7 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Questions answered</p>
            <p className="mt-1 text-3xl font-bold text-blue-600">
              {answeredCount} / {questions.length}
            </p>
          </div>
          <Link
            to="/result"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View Result <ChevronRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-slate-800">
      <Navbar />
      <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-col justify-between gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:px-7">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <GraduationCap size={23} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  JavaScript Quiz
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {questions.length} Questions
                  <span className="mx-2">•</span>
                  10 Minutes
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                Medium
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-slate-400">
                Time Remaining
              </p>
              <p className="text-sm font-semibold text-slate-700">
                Keep focused
              </p>
            </div>
            <div
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 font-bold tabular-nums ${
                timeLeft <= 60
                  ? "animate-pulse border-red-200 bg-red-50 text-red-600"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <Clock3 size={19} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
            <span>Quiz progress</span>
            <span>{Math.round(progress)}% completed</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <button
                onClick={() =>
                  setAnswers((prev) => {
                    const updated = { ...prev };
                    delete updated[currentQuestion];
                    return updated;
                  })
                }
                className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-red-500"
              >
                <Flag size={15} />
                Clear answer
              </button>
            </div>

            <h2 className="max-w-3xl text-lg font-bold leading-relaxed text-slate-900 sm:text-xl">
              {questions[currentQuestion].question}
            </h2>

            <div className="mt-8 space-y-3">
              {questions[currentQuestion].options.map((option, index) => {
                const selected = answers[currentQuestion] === index;

                return (
                  <button
                    key={option}
                    onClick={() => selectAnswer(index)}
                    className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/50 ${
                      selected
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white text-slate-500 group-hover:border-blue-400"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span
                      className={`flex-1 text-sm font-medium sm:text-base ${
                        selected ? "text-blue-800" : "text-slate-700"
                      }`}
                    >
                      {option}
                    </span>
                    {selected ? (
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-blue-600"
                      />
                    ) : (
                      <Circle
                        size={19}
                        className="shrink-0 text-slate-300"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-9 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
              <button
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestion === 0}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(questions.length - 1, prev + 1)
                    )
                  }
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Next Question
                  <ChevronRight size={17} />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmit(true)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Submit Quiz
                  <CheckCircle2 size={17} />
                </button>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Question Palette</h3>
              <LayoutGrid size={18} className="text-slate-400" />
            </div>

            <div className="mb-5 grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const answered = answers[index] !== undefined;
                const active = currentQuestion === index;

                return (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`flex aspect-square cursor-pointer items-center justify-center rounded-lg border text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                      active
                        ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200"
                        : answered
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-blue-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-5 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-blue-600" />
                Current question
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-emerald-100 ring-1 ring-emerald-300" />
                Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded border border-slate-300 bg-white" />
                Not answered
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <p className="text-xs font-semibold text-blue-800">
                Answered Questions
              </p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-extrabold text-blue-700">
                  {answeredCount}
                  <span className="text-sm font-semibold text-blue-400">
                    {" "}/ {questions.length}
                  </span>
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  {questions.length - answeredCount} remaining
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmit(true)}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-600 bg-white px-4 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              Submit Quiz
              <ChevronRight size={17} />
            </button>
          </aside>
        </div>
      </main>

      {showSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-[fadeIn_0.2s_ease-out] rounded-2xl bg-white p-7 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <Flag size={26} />
            </div>
            <h2 className="text-center text-xl font-extrabold text-slate-900">
              Submit your quiz?
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-slate-500">
              You have answered {answeredCount} out of {questions.length} questions.
              {answeredCount < questions.length &&
                " Unanswered questions will be submitted without an answer."}
            </p>
            <div className="mt-7 flex gap-3">
              {timeLeft > 0 && (
                <button
                  onClick={() => setShowSubmit(false)}
                  className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Continue Quiz
                </button>
              )}
              <button
                onClick={handleSubmit}
                className="flex-1 cursor-pointer rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}