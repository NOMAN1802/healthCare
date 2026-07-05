import { PaymentStatus, UserRole } from "../../../generated/prisma";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const fetcheDashboardMetaData = async (user: IAuthUser) => {
  let result;
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      result = await getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      result = await getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      result = await getDoctorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
      result = await getPatientMetaData(user as IAuthUser);
      break;
    default:
      throw new Error("Invalid user role!");
  }

  return result;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCoount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const adminCount = await prisma.admin.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  // const barChartData = await getBarChartData();
  // const pieChartData = await getPieChartData();
  return {
    appointmentCount,
    patientCoount,
    doctorCount,
    paymentCount,
    totalRevenue: totalRevenue._sum.amount,
    adminCount,
    // barChartData,
    // pieChartData,
  };
};
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCoount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID },
  });

  const recentAppointments = await prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { patient: true },
  });

  const recentPayments = await prisma.payment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    where: { status: PaymentStatus.PAID },
    include: { appointment: { include: { patient: true } } },
  });

  const actionLabel: Record<string, string> = {
    SCHEDULED: "Appointment scheduled",
    INPROGRESS: "Appointment in progress",
    COMPLETED: "Appointment completed",
    CANCELLED: "Appointment cancelled",
  };

  const appointmentActivities = recentAppointments.map((a) => ({
    id: a.id,
    action: actionLabel[a.status] ?? "Appointment updated",
    user: a.patient.name,
    createdAt: a.createdAt,
    activityStatus: a.status,
  }));

  const paymentActivities = recentPayments.map((p) => ({
    id: p.id,
    action: "Payment processed",
    user: p.appointment.patient.name,
    createdAt: p.createdAt,
    activityStatus: "PAID",
  }));

  const recentActivities = [...appointmentActivities, ...paymentActivities]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  return {
    appointmentCount,
    patientCoount,
    doctorCount,
    paymentCount,
    totalRevenue,
    recentActivities,
  };
};
const getDoctorMetaData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue: totalRevenue._sum.amount,
    formattedAppointmentStatusDistribution,
  };
};

const getPatientMetaData = async (user: IAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patientData.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  return {
    appointmentCount,
    reviewCount,
    formattedAppointmentStatusDistribution,
  };
};

// const getBarChartData = async () => {
//   const appointmentCountByMonth = await prisma.$queryRaw`
//   SELECT DATE_TRUNC('month', "createdAt") AS month,
//          CAST(COUNT(*) AS INT) AS count
//   FROM "appointments"
//   GROUP BY month
//   ORDER BY month ASC;
// `;

//   return appointmentCountByMonth;
// };

// const getPieChartData = async () => {
//   const appointmentStatusDistribution = await prisma.appointment.groupBy({
//     by: ["status"],
//     _count: { id: true },
//   });

//   const formattedAppointmentStatusDistribution =
//     appointmentStatusDistribution.map((count) => ({
//       status: count.status,
//       count: Number(count._count.id),
//     }));

//   return formattedAppointmentStatusDistribution;
// };
export const metaServices = {
  fetcheDashboardMetaData,
};
