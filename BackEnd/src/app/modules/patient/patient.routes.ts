import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { UserRole } from "../../../generated/prisma";
import { patientControllers } from "./patient.controller";

const router = express.Router();

router.get(
  "/",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientControllers.getAllFromDB
);
router.patch(
  "/update-my-health-data",
  authValidation(UserRole.PATIENT),
  patientControllers.updateMyHealthData
);

router.get(
  "/:id",
  authValidation(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  patientControllers.getByIdFromDB
);
router.patch(
  "/:id",
  authValidation(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  patientControllers.updateIntoDB
);

router.delete("/:id", patientControllers.deleteFromDB);

router.delete(
  "/soft/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientControllers.softDeleteFromDB
);
export const PatientRoutes = router;