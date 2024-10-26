import express from "express";
import { submitFeedback } from "../controller/feedback.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

router.post("/", catchAsync(submitFeedback));

export default router;
