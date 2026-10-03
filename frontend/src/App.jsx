import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GenerateQuiz from "./pages/GenerateQuiz";
import QuizAttempt from "./pages/QuizAttempt";
import Result from "./pages/Result";
import MyQuizzes from "./pages/MyQuizzes";
import AnswerReview from "./pages/AnswerReview";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate-quiz" element={<GenerateQuiz />} />
        <Route path="/quiz-attempt" element={<QuizAttempt />} />
        <Route path="/results" element={<Result />} />
        <Route path="/my-quizzes" element={<MyQuizzes />} />
        <Route path="/answer-review" element={<AnswerReview />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;