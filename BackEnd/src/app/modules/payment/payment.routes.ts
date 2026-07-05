import express from "express";
import { paymentControllers } from "./payment.controller";

const router = express.Router();

router.get("/init-payment/:appointmentId", paymentControllers.initPayment);

router.post("/success", paymentControllers.validatePayment);
router.post("/fail", paymentControllers.handleFail);
router.post("/cancel", paymentControllers.handleCancel);

export const PaymentRoutes = router;
