import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import status from "http-status";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";

  // Zod validation errors → 400
  if (err instanceof ZodError) {
    statusCode = status.BAD_REQUEST;
    message = err.errors.map((e) => e.message).join(", ");
  }
  // Custom API errors (ApiError instances)
  else if (err?.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Prisma known request errors (record not found, unique constraint, etc.)
  else if (err?.code?.startsWith("P")) {
    statusCode = status.BAD_REQUEST;
    const prismaMessages: Record<string, string> = {
      P2002: "A record with this value already exists.",
      P2025: "Record not found.",
      P2003: "Foreign key constraint failed.",
      P2016: "Query interpretation error.",
    };
    message = prismaMessages[err.code] ?? err.message ?? "Database error";
  }
  // Generic error
  else if (err?.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
};
