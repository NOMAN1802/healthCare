import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleUser: build.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    getAllUsers: build.query({
      query: (params) => ({
        url: "/user",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.user],
    }),

    changeUserStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/user/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useGetSingleUserQuery,
  useGetAllUsersQuery,
  useChangeUserStatusMutation,
} = userApi;
