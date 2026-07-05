import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IMeta } from "@/types/common";

export const metaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMeta: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/meta",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (
        response: {
          // admin / super-admin fields
          appointmentCount?: number;
          patientCoount?: number;
          doctorCount?: number;
          paymentCount?: number;
          adminCount?: number;
          totalRevenue?: number | { _sum: { amount: number } };
          recentActivities?: {
            id: string;
            action: string;
            user: string;
            createdAt: string;
            activityStatus: string;
          }[];
          // doctor / patient fields
          patientCount?: number;
          reviewCount?: number;
          formattedAppointmentStatusDistribution?: {
            status: string;
            count: number;
          }[];
        },
        meta: IMeta
      ) => {
        return {
          response,
        };
      },
      providesTags: [tagTypes.meta],
    }),
  }),
});

export const { useGetMetaQuery } = metaApi;
