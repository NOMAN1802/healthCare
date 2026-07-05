import { Patient } from './../../../generated/prisma/index.d';
import express from "express";
import { doctorScheduleControllers } from './doctorSchedule.controller';
import { authValidation } from "../../middlewares/authValidation";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();


// Public — patients browse available slots without needing to log in
router.get('/', doctorScheduleControllers.getAllFromDB)

router.get('/my-schedule', authValidation(UserRole.DOCTOR), doctorScheduleControllers.getMySchedule)

router.post("/", authValidation(UserRole.DOCTOR), doctorScheduleControllers.createIntoDB);

router.delete('/:id',authValidation(UserRole.DOCTOR),doctorScheduleControllers.deleteFromDB)

export const DoctorScheduleRoutes = router;
