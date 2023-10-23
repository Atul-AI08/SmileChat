import { Router } from "express";
import {
  checkUser,
  onBoardUser,
  getAllUsers,
  updateLastSeen,
} from "../controllers/AuthController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/onBoardUser", onBoardUser);
router.get("/get-contacts", getAllUsers);
router.post("/update-last-seen", updateLastSeen);

export default router;
