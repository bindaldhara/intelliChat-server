import express from "express";
import { signup, login, fetchSelf } from "../controller/user.js";
import { catchAsync } from "../utils/index.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.post("/signup", catchAsync(signup));

router.post("/login", catchAsync(login));

router.get("/self", authenticate, catchAsync(fetchSelf));

export default router;
