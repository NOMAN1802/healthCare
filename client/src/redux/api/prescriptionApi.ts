import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IMeta } from "@/types/common";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPrescription: build.mutation({
      query: (data) => ({
        url: "/prescription/create-prescription",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.prescription],
    }),
    getAllPrescriptions: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/prescription/my-prescription",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: [], meta: IMeta) => {
        return {
          prescriptions: response,
          meta,
        };
      },
      providesTags: [tagTypes.prescription],
    }),
  }),
});

export const {
    useCreatePrescriptionMutation,
    useGetAllPrescriptionsQuery
} = appointmentApi;
