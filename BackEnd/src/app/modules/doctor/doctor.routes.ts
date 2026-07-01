import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { UserRole } from "../../../generated/prisma";
import { doctorController } from "./doctor.controller";

const router = express.Router();

// Public routes — doctor listing must be accessible without login
router.get("/", doctorController.getAllFromDB);
router.get("/:id", doctorController.getByIdFromDB);

router.patch(
  "/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  doctorController.updateIntoDB
);
router.delete(
  "/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorController.deleteFromDB
);
router.delete(
  "/soft/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorController.softDeleteFromDB
);

export const DoctorRoutes = router;
