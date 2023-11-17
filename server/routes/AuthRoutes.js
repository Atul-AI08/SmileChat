import { Router } from "express";
import {
  checkUser,
  getAllUsers,
  onBoardUser,
  updateLastSeen,
  updateProfile,
  createGroup,
  addGroupMember,
} from "../controllers/AuthController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/onBoardUser", onBoardUser);
router.post("/get-contacts", getAllUsers);
router.post("/update-last-seen", updateLastSeen);
router.post("/update-profile", updateProfile);
router.post("/create-group", createGroup);
router.post("/add-group-member", addGroupMember);

export default router;
