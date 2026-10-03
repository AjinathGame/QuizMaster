import Attempt from "../models/Attempt.js";

export const getResultHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({
      userId: req.user._id,
      status: "submitted",
    })
      .populate("quizId", "topic difficulty")
      .sort({ submittedAt: -1 });

    const results = attempts.map((attempt) => ({
      attemptId: attempt._id,
      topic: attempt.quizId?.topic || "Deleted Quiz",
      difficulty: attempt.quizId?.difficulty || null,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage:
        attempt.totalQuestions > 0
          ? Number(
              (
                (attempt.score / attempt.totalQuestions) *
                100
              ).toFixed(2)
            )
          : 0,
      submittedAt: attempt.submittedAt,
    }));

    res.status(200).json({
      success: true,
      totalAttempts: results.length,
      results,
    });
  } catch (error) {
    console.error("Result history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch result history",
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const attempts = await Attempt.find({
      userId: req.user._id,
      status: "submitted",
    }).populate("quizId", "topic");

    const totalAttempts = attempts.length;

    const totalQuestions = attempts.reduce(
      (sum, attempt) => sum + attempt.totalQuestions,
      0
    );

    const totalCorrect = attempts.reduce(
      (sum, attempt) => sum + attempt.score,
      0
    );

    const percentages = attempts.map((attempt) =>
      attempt.totalQuestions > 0
        ? (attempt.score / attempt.totalQuestions) * 100
        : 0
    );

    const averagePercentage =
      totalAttempts > 0
        ? Number(
            (
              percentages.reduce((sum, value) => sum + value, 0) /
              totalAttempts
            ).toFixed(2)
          )
        : 0;

    const bestPercentage =
      percentages.length > 0
        ? Number(Math.max(...percentages).toFixed(2))
        : 0;

    const topicStats = {};

    for (const attempt of attempts) {
      const topic = attempt.quizId?.topic || "Deleted Quiz";

      if (!topicStats[topic]) {
        topicStats[topic] = {
          topic,
          attempts: 0,
          correct: 0,
          questions: 0,
        };
      }

      topicStats[topic].attempts += 1;
      topicStats[topic].correct += attempt.score;
      topicStats[topic].questions += attempt.totalQuestions;
    }

    const topicPerformance = Object.values(topicStats).map(
      (item) => ({
        ...item,
        percentage:
          item.questions > 0
            ? Number(
                ((item.correct / item.questions) * 100).toFixed(2)
              )
            : 0,
      })
    );

    res.status(200).json({
      success: true,
      analytics: {
        totalAttempts,
        totalQuestions,
        totalCorrect,
        averagePercentage,
        bestPercentage,
        topicPerformance,
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