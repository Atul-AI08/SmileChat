import { Router } from "express";
import {
  checkUser,
  onBoardUser
} from "../controllers/AuthController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/onBoardUser", onBoardUser);

export default router;
