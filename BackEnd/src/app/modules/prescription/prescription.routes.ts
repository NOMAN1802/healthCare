import express from "express";
import { authValidation } from "../../middlewares/authValidation";
import { UserRole } from "../../../generated/prisma";
import { prescriptionControllers } from "./prescription.controller";

const router = express.Router();

router.post(
  "/create-prescription",
  authValidation(UserRole.DOCTOR),
  prescriptionControllers.createIntoDB
);

router.get(
  "/my-prescription",
  authValidation(UserRole.DOCTOR, UserRole.PATIENT),
  prescriptionControllers.getMyPrescription)

export const PrescriptionRoutes = router;
