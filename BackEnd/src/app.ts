import status from "http-status";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { appointmentServices } from "./app/modules/appointment/appointment.service";
import cron from "node-cron";
import config from "./config";
const app: Application = express();

const allowedOrigins = ["http://localhost:3000", config.frontendUrl].filter(
  Boolean,
) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (e.g. curl, server-to-server) with no origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/admins", adminRoutes);

cron.schedule("* * * * *", async () => {
  try {
    await appointmentServices.cancelUnpaidAppointments();
  } catch (error) {
    console.error("[CRON] Failed to cancel unpaid appointments:", error);
  }
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "Api Not Found",
    error: {
      path: `${req.originalUrl} is wrong`,
      message: "your requested path is not found ",
    },
  });
});

export default app;
