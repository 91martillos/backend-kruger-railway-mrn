import express from "express";
import {
  saveUser,
  getUser,
  sendWelcomeEmail,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", saveUser);
router.get("/all", getUser);
router.post("/send-welcome-email", sendWelcomeEmail);
router.delete("/:id", deleteUser);

export default router;
