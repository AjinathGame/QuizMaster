
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Home,
  Menu,
  X,
  Trophy,
  XCircle,
  LayoutDashboard,
  BarChart3,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/navbar/Navbar.jsx";

const reviewQuestions = [
  {
    id: 1,
    question: "Which programming language is primarily used for web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    selectedAnswer: 1,
    correctAnswer: 1,
    explanation:
      "JavaScript is widely used to create interactive and dynamic web pages. It runs in browsers and can also be used on the server with Node.js.",
  },
  {
    id: 2,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    selectedAnswer: 0,
    correctAnswer: 0,
    explanation:
      "HTML stands for HyperText Markup Language. It is the standard markup language used to structure content on the web.",
  },
  {
    id: 3,
    question: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Linked List", "Stack", "Tree"],
    selectedAnswer: 1,
    correctAnswer: 2,
    explanation:
      "A stack follows the Last In, First Out (LIFO) principle. The last element inserted is the first one removed.",
  },
  {
    id: 4,
    question: "Which of the following is a relational database?",
    options: ["MongoDB", "Redis", "MySQL", "Cassandra"],
    selectedAnswer: 2,
    correctAnswer: 2,
    explanation:
      "MySQL is a relational database management system that organizes data into tables with rows and columns.",
  },
  {
    id: 5,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    selectedAnswer: 0,
    correctAnswer: 1,
    explanation:
      "Binary search repeatedly divides a sorted search space in half. Its time complexity is O(log n).",
  },
];

export default function AnswerReview() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const question = reviewQuestions[currentQuestion];
  const isCorrect = question.selectedAnswer === question.correctAnswer;
  const correctCount = reviewQuestions.filter(
    (item) => item.selectedAnswer === item.correctAnswer
  ).length;
  const incorrectCount = reviewQuestions.length - correctCount;
  const score = Math.round((correctCount / reviewQuestions.length) * 100);

  const goToQuestion = (index) => {
    if (index >= 0 && index < reviewQuestions.length) {
      setCurrentQuestion(index);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.45s ease-out both;
        }
      `}</style>

     <Navbar/>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <button
              onClick={() => navigate("/results")}
              className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to Results
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Answer Review
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review your answers, correct options, and explanations.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:self-auto"
          >
            <Home size={17} />
            Dashboard
          </button>
        </div>

        {/* Summary cards */}
        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Your Score</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {score}%
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Trophy size={22} />
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Correct</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {correctCount}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Correct answers out of {reviewQuestions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Incorrect</p>
                <p className="mt-2 text-3xl font-bold text-rose-600">
                  {incorrectCount}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <XCircle size={22} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Answers that need improvement
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Questions</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {reviewQuestions.length}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FileText size={22} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Total questions in this quiz
            </p>
          </div>
        </section>

        {/* Quiz title */}
        <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Completed Quiz
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Intermediate
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Web Development Fundamentals
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review each question and understand your performance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={16} />
            <span>Completed attempt</span>
          </div>
        </div>

        {/* Review layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main question panel */}
          <section className="fade-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Question {currentQuestion + 1} of {reviewQuestions.length}
                </p>
                <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / reviewQuestions.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isCorrect
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                {isCorrect ? "Correct Answer" : "Incorrect Answer"}
              </span>
            </div>

            <h3 className="mb-6 text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = question.selectedAnswer === index;
                const isAnswer = question.correctAnswer === index;

                let optionStyle =
                  "border-slate-200 bg-white text-slate-700";
                let icon = <Circle size={19} className="text-slate-300" />;

                if (isAnswer) {
                  optionStyle =
                    "border-emerald-300 bg-emerald-50 text-emerald-900";
                  icon = (
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-emerald-600"
                    />
                  );
                } else if (isSelected) {
                  optionStyle = "border-rose-300 bg-rose-50 text-rose-900";
                  icon = (
                    <XCircle size={19} className="shrink-0 text-rose-600" />
                  );
                }

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 rounded-xl border p-4 transition ${optionStyle}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-500 shadow-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-sm font-medium sm:text-base">
                      {option}
                    </span>
                    {icon}
                    {isAnswer && (
                      <span className="hidden text-xs font-semibold text-emerald-700 sm:inline">
                        Correct
                      </span>
                    )}
                    {isSelected && !isAnswer && (
                      <span className="hidden text-xs font-semibold text-rose-700 sm:inline">
                        Your answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <div className="mt-7 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2 text-indigo-800">
                <Sparkles size={18} />
                <h4 className="font-semibold">Explanation</h4>
              </div>
              <p className="text-sm leading-7 text-slate-700">
                {question.explanation}
              </p>
            </div>

            {/* Navigation */}
            <div className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => goToQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <span className="text-xs font-medium text-slate-400 sm:text-sm">
                {currentQuestion + 1} / {reviewQuestions.length}
              </span>

              <button
                onClick={() => goToQuestion(currentQuestion + 1)}
                disabled={currentQuestion === reviewQuestions.length - 1}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={17} />
              </button>
            </div>
          </section>

          {/* Question navigator */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="font-bold text-slate-900">Question Navigator</h3>
              <p className="mt-1 text-xs text-slate-500">
                Select a question to review
              </p>
            </div>

            <div className="mb-5 grid grid-cols-5 gap-2">
              {reviewQuestions.map((item, index) => {
                const correct = item.selectedAnswer === item.correctAnswer;
                const active = currentQuestion === index;

                return (
                  <button
                    key={item.id}
                    onClick={() => goToQuestion(index)}
                    aria-label={`Go to question ${index + 1}`}
                    className={`flex h-10 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                      active
                        ? "border-indigo-600 bg-indigo-600 text-white ring-4 ring-indigo-100"
                        : correct
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400"
                        : "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-400"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                Correct answer
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-3 w-3 rounded-sm bg-rose-500" />
                Incorrect answer
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-3 w-3 rounded-sm border-2 border-indigo-600 bg-white" />
                Current question
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Review progress
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {currentQuestion + 1} of {reviewQuestions.length}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / reviewQuestions.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => navigate("/results")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              <BarChart3 size={17} />
              View Full Results
            </button>
          </aside>
        </div>

        {/* Bottom CTA */}
        <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:flex-row sm:p-7">
          <div>
            <h3 className="text-lg font-bold">Ready to improve your score?</h3>
            <p className="mt-1 text-sm text-indigo-100">
              Practice more questions and strengthen your knowledge.
            </p>
          </div>
          <button
            onClick={() => navigate("/generate-quiz")}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
          >
            Practice Again
            <ArrowRight size={17} />
          </button>
        </div>
      </main>

      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 QuizMaster. All rights reserved.</p>
          <p>Learn. Practice. Improve.</p>
        </div>
      </footer>
    </div>
  );
}