import express from "express";
import {
  getResultHistory,
  getAnalytics,
} from "../controllers/resultController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/history", protect, getResultHistory);
router.get("/analytics", protect, getAnalytics);

export default router;