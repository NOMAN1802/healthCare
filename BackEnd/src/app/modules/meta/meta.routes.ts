import express from "express";
import { metaControllers } from "./meta.controller";
import { authValidation } from "../../middlewares/authValidation";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get(
  "/",
  authValidation(UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT,UserRole.SUPER_ADMIN),
  metaControllers.fetcheDashboardMetaData
);




export const MetaRoutes = router;