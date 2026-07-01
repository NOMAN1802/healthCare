import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.get("/init-payment/:appointmentId", PaymentController.initPayment);

router.post("/success", PaymentController.validatePayment);
router.post("/fail", PaymentController.handleFail);
router.post("/cancel", PaymentController.handleCancel);

export const PaymentRoutes = router;
