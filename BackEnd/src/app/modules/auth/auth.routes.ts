import express from "express";
import { authControllers } from "./auth.controller";
import { authValidation } from "../../middlewares/authValidation";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post("/login", authControllers.loginUser);
router.post("/refresh-token", authControllers.refreshToken);
router.post(
  "/change-password",
  authValidation(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATIENT,
    UserRole.DOCTOR
  ),
  authControllers.changePassword
);

router.post("/forgot-password", authControllers.forgotPassword);

router.post("/reset-password", authControllers.resetPassword);

export const AuthRoutes = router;
