import express from "express";
import {
  startAttempt,
  submitAttempt,
  getAttemptReview,
} from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startAttempt);
router.post("/submit", protect, submitAttempt);
router.get("/:attemptId/review", protect, getAttemptReview);

export default router;