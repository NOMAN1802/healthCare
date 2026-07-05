import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import { paymentServices } from "./payment.service";
import config from "../../../config";

const initPayment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const result = await paymentServices.initPayment(appointmentId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment Create Successfully",
      data: result,
    });
  }
);

const validatePayment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentServices.validatePayment(req.body);
    const frontendUrl = config.frontendUrl || "http://localhost:3000";
    if (result.message === "Payment validated successfully") {
      res.redirect(`${frontendUrl}/payment?status=success`);
    } else {
      res.redirect(`${frontendUrl}/payment?status=failed`);
    }
  }
);

const handleFail: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const frontendUrl = config.frontendUrl || "http://localhost:3000";
    res.redirect(`${frontendUrl}/payment?status=failed`);
  }
);

const handleCancel: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const frontendUrl = config.frontendUrl || "http://localhost:3000";
    res.redirect(`${frontendUrl}/payment?status=cancel`);
  }
);

export const paymentControllers = {
  initPayment,
  validatePayment,
  handleFail,
  handleCancel,
};
