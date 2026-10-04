
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  Circle,
  LayoutGrid,
  AlertCircle,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

import Navbar from "../component/navbar/Navbar";
import api from "../api/api";

const normalizeQuestions = (items = []) => {
  return items.map((item, index) => ({
    id: item._id || item.id || index,
    question: item.question || item.text || item.title || "",
    options: Array.isArray(item.options)
      ? item.options.map((option) =>
          typeof option === "string"
            ? option
            : option.text || option.label || ""
        )
      : [],
  }));
};

const getQuizFromResponse = (data) => {
  return data?.quiz || data?.data?.quiz || data?.data || data;
};

export default function QuizAttempt() {
  const location = useLocation();
  const navigate = useNavigate();

  const quizId = location.state?.quizId || location.state?.quiz?._id || location.state?.quiz?.id;

  const [quiz, setQuiz] = useState(location.state?.quiz || null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attemptResult, setAttemptResult] = useState(null);

  const submitLock = useRef(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError("Quiz ID is missing. Please select a quiz first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/quizzes/${quizId}`);
        const quizData = getQuizFromResponse(response.data);

        const normalized = normalizeQuestions(quizData.questions || []);

        if (!normalized.length) {
          setError("No questions are available for this quiz.");
          return;
        }

        setQuiz(quizData);
        setQuestions(normalized);

        const duration = Number(
          quizData.duration ?? quizData.timeLimit ?? 10
        );

        setTimeLeft(Math.max(1, duration) * 60);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load quiz. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleSubmit = useCallback(
    async (autoSubmit = false) => {
      if (submitLock.current || submitted || !questions.length) return;

      submitLock.current = true;
      setSubmitting(true);
      setShowSubmit(false);
      setError("");

      try {
        const formattedAnswers = questions.map((question, index) => ({
          questionId: question.id,
          selectedOption:
            answers[index] !== undefined ? answers[index] : null,
        }));

        const response = await api.post("/attempts", {
          quizId,
          answers: formattedAnswers,
          timeTaken: Math.max(
            0,
            Number(quiz?.duration ?? quiz?.timeLimit ?? 10) * 60 -
              timeLeft
          ),
          autoSubmitted: autoSubmit,
        });

        const result =
          response.data?.attempt ||
          response.data?.result ||
          response.data?.data ||
          response.data;

        setAttemptResult(result);
        setSubmitted(true);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to submit quiz. Please try again."
        );
        submitLock.current = false;
        if (!autoSubmit) setShowSubmit(true);
      } finally {
        setSubmitting(false);
      }
    },
    [answers, questions, quizId, quiz, timeLeft, submitted]
  );

  useEffect(() => {
    if (loading || submitted || submitting || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, loading, submitted, submitting, questions.length, handleSubmit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const selectAnswer = (optionIndex) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: optionIndex,
    }));
  };

  const clearAnswer = () => {
    setAnswers((previous) => {
      const updated = { ...previous };
      delete updated[currentQuestion];
      return updated;
    });
  };

  const answeredCount = Object.keys(answers).length;
  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const goToResult = () => {
    const attemptId =
      attemptResult?._id ||
      attemptResult?.id ||
      attemptResult?.attemptId;

    navigate("/result", {
      state: {
        attemptId,
        result: attemptResult,
        quizId,
      },
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7fc]">
        <div className="text-center">
          <LoaderCircle
            size={38}
            className="mx-auto animate-spin text-blue-600"
          />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your quiz...
          </p>
        </div>
      </main>
    );
  }

  if (error && !questions.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7fc] px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={28} />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Unable to open quiz
          </h1>
          <p className="mt-3 text-sm text-slate-500">{error}</p>
          <Link
            to="/my-quizzes"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Back to My Quizzes
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl sm:p-10">
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

          <button
            type="button"
            onClick={goToResult}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View Result
            <ChevronRight size={18} />
          </button>

          <Link
            to="/my-quizzes"
            className="mt-4 inline-block text-sm font-semibold text-slate-500 hover:text-blue-600"
          >
            Back to My Quizzes
          </Link>
        </div>
      </main>
    );
  }

  const activeQuestion = questions[currentQuestion];

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
                  {quiz?.title || quiz?.topic || "Quiz"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {questions.length} Questions
                  <span className="mx-2">•</span>
                  {quiz?.duration ?? quiz?.timeLimit ?? 10} Minutes
                </p>
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                {quiz?.difficulty || "Medium"}
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

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>

              <button
                type="button"
                onClick={clearAnswer}
                disabled={answers[currentQuestion] === undefined}
                className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Flag size={15} />
                Clear answer
              </button>
            </div>

            <h2 className="max-w-3xl text-lg font-bold leading-relaxed text-slate-900 sm:text-xl">
              {activeQuestion.question}
            </h2>

            <div className="mt-8 space-y-3">
              {activeQuestion.options.map((option, index) => {
                const selected = answers[currentQuestion] === index;

                return (
                  <button
                    key={`${activeQuestion.id}-${index}`}
                    type="button"
                    onClick={() => selectAnswer(index)}
                    aria-pressed={selected}
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
                type="button"
                onClick={() =>
                  setCurrentQuestion((previous) =>
                    Math.max(0, previous - 1)
                  )
                }
                disabled={currentQuestion === 0}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestion((previous) =>
                      Math.min(questions.length - 1, previous + 1)
                    )
                  }
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Next Question
                  <ChevronRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
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
              <h3 className="font-bold text-slate-900">
                Question Palette
              </h3>
              <LayoutGrid size={18} className="text-slate-400" />
            </div>

            <div className="mb-5 grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const answered = answers[index] !== undefined;
                const active = currentQuestion === index;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setCurrentQuestion(index)}
                    aria-label={`Go to question ${index + 1}`}
                    aria-current={active ? "step" : undefined}
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

              <div className="mt-2 flex items-end justify-between gap-2">
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
              type="button"
              onClick={() => setShowSubmit(true)}
              disabled={submitting}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-600 bg-white px-4 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit Quiz
              <ChevronRight size={17} />
            </button>
          </aside>
        </div>
      </main>

      {showSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
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
                  type="button"
                  onClick={() => setShowSubmit(false)}
                  className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Continue Quiz
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Confirm Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

