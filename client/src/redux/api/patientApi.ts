import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export const patientApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateMyHealthData: build.mutation({
      query: (data) => ({
        url: "/patient/update-my-health-data",
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const { useUpdateMyHealthDataMutation } = patientApi;
