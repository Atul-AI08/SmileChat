import { Router } from "express";
import {
  checkUser,
  onBoardUser,
  getAllUsers,
  updateLastSeen,
  updateProfile,
} from "../controllers/AuthController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/onBoardUser", onBoardUser);
router.get("/get-contacts", getAllUsers);
router.post("/update-last-seen", updateLastSeen);
router.post("/update-profile", updateProfile);

export default router;
