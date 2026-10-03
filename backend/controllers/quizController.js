import { generateQuiz } from "../services/aiQuizService.js";
import Quiz from "../models/Quiz.js";

export const createAIQuiz = async (req, res) => {
  try {
    const {
      topic,
      difficulty = "medium",
      questionCount = 10,
      durationMinutes,
    } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const questions = await generateQuiz({
      topic,
      difficulty,
      questionCount,
    });

    const duration = durationMinutes ?? questionCount;

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Duration must be between 1 and 180 minutes",
      });
    }

    const quiz = await Quiz.create({
      createdBy: req.user._id,
      topic: topic.trim(),
      difficulty,
      durationMinutes: duration,
      questions,
    });

    const safeQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    res.status(201).json({
      success: true,
      message: "AI quiz generated successfully",
      quiz: {
        _id: quiz._id,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        durationMinutes: quiz.durationMinutes,
        totalQuestions: quiz.questions.length,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    console.error("Quiz generation error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate quiz",
    });
  }
};