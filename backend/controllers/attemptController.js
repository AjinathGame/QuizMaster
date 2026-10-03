import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";

export const startAttempt = async (req, res) => {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID is required",
      });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const existingAttempt = await Attempt.findOne({
      userId: req.user._id,
      quizId,
      status: "in-progress",
    });

    if (existingAttempt) {
      return res.status(409).json({
        success: false,
        message: "An attempt is already in progress",
        attemptId: existingAttempt._id,
      });
    }

    const startedAt = new Date();
    const expiresAt = new Date(
      startedAt.getTime() + quiz.durationMinutes * 60 * 1000
    );

    const attempt = await Attempt.create({
      userId: req.user._id,
      quizId: quiz._id,
      startedAt,
      expiresAt,
      totalQuestions: quiz.questions.length,
    });

    const safeQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    res.status(201).json({
      success: true,
      message: "Quiz attempt started",
      attempt: {
        _id: attempt._id,
        quizId: quiz._id,
        topic: quiz.topic,
        durationMinutes: quiz.durationMinutes,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    console.error("Start attempt error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to start quiz",
    });
  }
};


export const submitAttempt = async (req, res) => {
  try {
    const { attemptId, answers = [] } = req.body;

    if (!attemptId) {
      return res.status(400).json({
        success: false,
        message: "Attempt ID is required",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId: req.user._id,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    if (attempt.status === "submitted") {
      return res.status(409).json({
        success: false,
        message: "Attempt already submitted",
      });
    }

    const quiz = await Quiz.findById(attempt.quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const now = new Date();
    const isTimeOver = now >= attempt.expiresAt;

    const questionIds = new Set(
      quiz.questions.map((q) => q._id.toString())
    );

    const submittedAnswers = new Map();

    for (const answer of answers) {
      const questionId = answer.questionId?.toString();
      const selectedOption = answer.selectedOption;

      if (!questionIds.has(questionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid question ID",
        });
      }

      if (
        !Number.isInteger(selectedOption) ||
        selectedOption < 0 ||
        selectedOption > 3
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid selected option",
        });
      }

      if (submittedAnswers.has(questionId)) {
        return res.status(400).json({
          success: false,
          message: "Duplicate answers are not allowed",
        });
      }

      submittedAnswers.set(questionId, selectedOption);
    }

    let score = 0;
    const evaluatedAnswers = [];

    for (const question of quiz.questions) {
      const questionId = question._id.toString();
      const selectedOption = submittedAnswers.get(questionId);

      const isCorrect =
        selectedOption !== undefined &&
        selectedOption === question.correctAnswer;

      if (isCorrect) {
        score++;
      }

      evaluatedAnswers.push({
        questionId: question._id,
        selectedOption:
          selectedOption === undefined ? null : selectedOption,
      });
    }

    attempt.answers = evaluatedAnswers;
    attempt.score = score;
    attempt.submittedAt = now;
    attempt.status = "submitted";

    await attempt.save();

    const totalQuestions = quiz.questions.length;
    const percentage =
      totalQuestions > 0
        ? Number(((score / totalQuestions) * 100).toFixed(2))
        : 0;

    res.status(200).json({
      success: true,
      message: isTimeOver
        ? "Time expired. Quiz auto-submitted"
        : "Quiz submitted successfully",
      result: {
        attemptId: attempt._id,
        topic: quiz.topic,
        score,
        totalQuestions,
        percentage,
        submittedAt: attempt.submittedAt,
        timeExpired: isTimeOver,
      },
    });
  } catch (error) {
    console.error("Submit attempt error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
    });
  }
};