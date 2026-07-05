import express from "express";
import { authValidation } from "../../middlewares/authValidation";
import { UserRole } from "../../../generated/prisma";
import { reviewControllers } from "./review.controller";

const router = express.Router();

router.post(
  "/",
  authValidation(UserRole.PATIENT),
  reviewControllers.createIntoDB
);

router.get(
  "/",
  authValidation(UserRole.DOCTOR),
  reviewControllers.getAllReview
);

export const ReviewRoutes = router;
