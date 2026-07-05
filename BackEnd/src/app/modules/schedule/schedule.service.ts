import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../../shared/prisma";
import { Prisma, Schedule, UserRole } from "../../../generated/prisma";
import { IFilterRequest, ISchedule } from "./schedule.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IAuthUser } from "../../interfaces/common";
import { IPagination } from "../../interfaces/paginationInterface";

const createIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;
  const schedule = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedule.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedule;
};

const getAllFromDB = async (filters: IFilterRequest, options: IPagination, user: IAuthUser) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filteredData } = filters;
  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        { startDateTime: { gte: startDate } },
        { endDateTime: { lte: endDate } },
      ],
    });
  }

  if (Object.keys(filteredData).length > 0) {
    andConditions.push({
      AND: Object.keys(filteredData).map((field) => ({
        [field]: { equals: filteredData[field as keyof typeof filteredData] },
      })),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput = { AND: andConditions };

  // Doctors only see schedules they haven't claimed yet.
  // Admins/super-admins see all schedules.
  let excludeIds: string[] = [];
  if (user.role === UserRole.DOCTOR) {
    const claimed = await prisma.doctorSchedule.findMany({
      where: { doctor: { email: user.email } },
    });
    excludeIds = claimed.map((s) => s.scheduleId);
  }

  const finalWhere: Prisma.ScheduleWhereInput =
    excludeIds.length > 0
      ? { ...whereConditions, id: { notIn: excludeIds } }
      : whereConditions;

  const result = await prisma.schedule.findMany({
    where: finalWhere,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.schedule.count({ where: finalWhere });

  return { meta: { page, limit, total }, data: result };
};


const updateIntoDB = async (
  id: string,
  payload: { startDateTime: string; endDateTime: string }
): Promise<Schedule> => {
  await prisma.schedule.findUniqueOrThrow({ where: { id } });
  const result = await prisma.schedule.update({
    where: { id },
    data: {
      startDateTime: new Date(payload.startDateTime),
      endDateTime: new Date(payload.endDateTime),
    },
  });
  return result;
};

const getByIdFromDB = async (id: string): Promise<Schedule | null> => {
    const result = await prisma.schedule.findUnique({
        where: {
            id,
        },
    });
    return result;
};

const deleteFromDB = async (id: string): Promise<Schedule> => {
    const result = await prisma.schedule.delete({
        where: {
            id,
        },
    });
    return result;
};


export const scheduleServices = {
  createIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
