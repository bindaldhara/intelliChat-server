import express from "express";
import { signup, login, fetchSelf ,forgotPassword, verifyOtpAndResetPassword} from "../controller/user.js";
import { catchAsync } from "../utils/index.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.post("/signup", catchAsync(signup));

router.post("/login", catchAsync(login));

router.get("/self", authenticate, catchAsync(fetchSelf));

router.post("/forgot-password", catchAsync(forgotPassword));

router.post("/verify-otp-reset-password", catchAsync(verifyOtpAndResetPassword));

export default router;
