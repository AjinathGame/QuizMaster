import express from "express";
import { startAttempt } from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";
import { submitAttempt} from "../controllers/attemptController.js";

const router = express.Router();

router.post("/start", protect, startAttempt);


router.post("/submit", protect, submitAttempt);

export default router;