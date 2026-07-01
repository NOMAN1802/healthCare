import { prisma } from "../../../shared/prisma";
import { SSlService } from "../SSL/SSL.service";
import { PaymentStatus } from "../../../generated/prisma";

const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const paymentInformation = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    contactNumber: paymentData.appointment.patient.contactNumber,
  };

  const result = await SSlService.initPayment(paymentInformation);

  return {
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  if (!payload || !payload.status || !["VALID", "VALIDATED"].includes(payload.status)) {
    return { message: "Invalid payment" };
  }

  const response = await SSlService.validatePayment(payload);

  if (!["VALID", "VALIDATED"].includes(response.status)) {
    return { message: "Payment validation failed" };
  }

  await prisma.$transaction(async (tx) => {
    const paymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGetWayData: response,
      },
    });

    await tx.appointment.update({
      where: {
        id: paymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return { message: "Payment validated successfully" };
};

export const paymentServices = {
  initPayment,
  validatePayment,
};
