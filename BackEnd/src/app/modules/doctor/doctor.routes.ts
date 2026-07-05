import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { UserRole } from "../../../generated/prisma";
import { doctorControllers } from "./doctor.controller";

const router = express.Router();

// Public routes — doctor listing must be accessible without login
router.get("/", doctorControllers.getAllFromDB);
router.get("/:id", doctorControllers.getByIdFromDB);

router.patch(
  "/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  doctorControllers.updateIntoDB
);
router.delete(
  "/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorControllers.deleteFromDB
);
router.delete(
  "/soft/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorControllers.softDeleteFromDB
);

export const DoctorRoutes = router;
