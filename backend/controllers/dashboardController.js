
import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("Dashboard API called");
    console.log("Logged-in user ID:", userId);

    const [totalQuizzes, attempts] = await Promise.all([
      Quiz.countDocuments({ createdBy: userId }),
      Attempt.find({
        userId,
        status: "submitted",
      }).select("score totalQuestions"),
    ]);

    console.log("Dashboard total quizzes:", totalQuizzes);
    console.log("Dashboard attempts:", attempts);

    const totalAttempts = attempts.length;

    const percentages = attempts.map((attempt) =>
      attempt.totalQuestions > 0
        ? (attempt.score / attempt.totalQuestions) * 100
        : 0
    );

    const averageScore =
      totalAttempts > 0
        ? Number(
            (
              percentages.reduce((sum, score) => sum + score, 0) /
              totalAttempts
            ).toFixed(2)
          )
        : 0;

    const bestScore =
      totalAttempts > 0 ? Number(Math.max(...percentages).toFixed(2)) : 0;

    return res.status(200).json({
      success: true,
      totalQuizzes,
      averageScore,
      totalAttempts,
      bestScore,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

export const getRecentResults = async (req, res) => {
  try {
    const attempts = await Attempt.find({
      userId: req.user._id,
      status: "submitted",
    })
      .sort({ submittedAt: -1 })
      .limit(5)
      .populate("quizId", "topic");

    const results = attempts.map((attempt) => {
      const percentage =
        attempt.totalQuestions > 0
          ? Number(
              (
                (attempt.score / attempt.totalQuestions) *
                100
              ).toFixed(2)
            )
          : 0;

      return {
        attemptId: attempt._id,
        topic: attempt.quizId?.topic || "Deleted Quiz",
        score: `${attempt.score}/${attempt.totalQuestions}`,
        percentage,
        date: attempt.submittedAt,
      };
    });

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Recent results error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent results",
    });
  }
};



export const getAnalytics = async (req, res) => {
  try {
    const days = [7, 30, 90].includes(Number(req.query.days))
      ? Number(req.query.days)
      : 30;

    const now = new Date();
    const startDate = new Date(
      now.getTime() - days * 24 * 60 * 60 * 1000
    );

    const attempts = await Attempt.find({
      userId: req.user._id,
      status: "submitted",
      submittedAt: { $ne: null },
    })
      .populate("quizId", "topic difficulty durationMinutes")
      .sort({ submittedAt: 1 });

    const filtered = attempts.filter(
      (attempt) => attempt.submittedAt >= startDate
    );

    const totalQuizzes = filtered.length;

    const totalCorrect = filtered.reduce(
      (sum, attempt) => sum + (attempt.score || 0),
      0
    );

    const totalQuestions = filtered.reduce(
      (sum, attempt) => sum + (attempt.totalQuestions || 0),
      0
    );

    const averageScore = totalQuizzes
      ? Number(
          (
            filtered.reduce(
              (sum, attempt) =>
                sum +
                (attempt.totalQuestions
                  ? (attempt.score / attempt.totalQuestions) * 100
                  : 0),
              0
            ) / totalQuizzes
          ).toFixed(2)
        )
      : 0;

    const accuracy = totalQuestions
      ? Number(((totalCorrect / totalQuestions) * 100).toFixed(2))
      : 0;

    const studySeconds = filtered.reduce((sum, attempt) => {
      if (!attempt.startedAt || !attempt.submittedAt) return sum;

      const duration =
        (new Date(attempt.submittedAt) - new Date(attempt.startedAt)) /
        1000;

      return sum + Math.max(0, duration);
    }, 0);

    const trendMap = new Map();

    filtered.forEach((attempt) => {
      const date = new Date(attempt.submittedAt)
        .toISOString()
        .slice(0, 10);

      const percentage = attempt.totalQuestions
        ? (attempt.score / attempt.totalQuestions) * 100
        : 0;

      if (!trendMap.has(date)) {
        trendMap.set(date, { total: 0, count: 0 });
      }

      const item = trendMap.get(date);
      item.total += percentage;
      item.count += 1;
    });

    const scoreTrend = Array.from(trendMap.entries()).map(
      ([date, item]) => ({
        date,
        score: Number((item.total / item.count).toFixed(2)),
      })
    );

    const subjectMap = new Map();
    const difficultyMap = new Map();

    filtered.forEach((attempt) => {
      const quiz = attempt.quizId;
      if (!quiz) return;

      const percentage = attempt.totalQuestions
        ? (attempt.score / attempt.totalQuestions) * 100
        : 0;

      const topic = quiz.topic || "Other";
      const difficulty = quiz.difficulty || "medium";

      if (!subjectMap.has(topic)) {
        subjectMap.set(topic, { total: 0, count: 0 });
      }

      const subject = subjectMap.get(topic);
      subject.total += percentage;
      subject.count += 1;

      if (!difficultyMap.has(difficulty)) {
        difficultyMap.set(difficulty, { total: 0, count: 0 });
      }

      const level = difficultyMap.get(difficulty);
      level.total += percentage;
      level.count += 1;
    });

    const subjectPerformance = Array.from(subjectMap.entries()).map(
      ([subject, item]) => ({
        subject,
        score: Number((item.total / item.count).toFixed(2)),
      })
    );

    const difficultyData = ["easy", "medium", "hard"].map((name) => {
      const item = difficultyMap.get(name);

      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: item
          ? Number((item.total / item.count).toFixed(2))
          : 0,
      };
    });

    const recentActivity = [...filtered]
      .sort(
        (a, b) =>
          new Date(b.submittedAt) - new Date(a.submittedAt)
      )
      .slice(0, 5)
      .map((attempt) => ({
        attemptId: attempt._id,
        title: attempt.quizId?.topic || "Quiz",
        subject: attempt.quizId?.topic || "Other",
        date: attempt.submittedAt,
        score: attempt.totalQuestions
          ? Number(
              ((attempt.score / attempt.totalQuestions) * 100).toFixed(2)
            )
          : 0,
        questions: attempt.totalQuestions,
        status: attempt.status,
      }));

    res.status(200).json({
      success: true,
      analytics: {
        totalQuizzes,
        averageScore,
        accuracy,
        studyHours: Number((studySeconds / 3600).toFixed(2)),
        scoreTrend,
        subjectPerformance,
        difficultyData,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};