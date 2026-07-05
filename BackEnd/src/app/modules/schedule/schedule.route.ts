import { Doctor } from './../../../generated/prisma/index.d';
import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { scheduleControllers } from "./schedule.controller";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get('/',authValidation(UserRole.ADMIN,UserRole.DOCTOR),scheduleControllers.getAllFromDB)

router.get('/:id',authValidation(UserRole.ADMIN,UserRole.DOCTOR),scheduleControllers.getByIdFromDB)

router.post("/",authValidation(UserRole.ADMIN,UserRole.DOCTOR), scheduleControllers.createIntoDB);


router.patch(
  '/:id',
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleControllers.updateIntoDB
);

router.delete(
  '/:id',
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleControllers.deleteFromDB
);

export const ScheduleRoutes = router;
