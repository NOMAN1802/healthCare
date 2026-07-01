import { baseApi } from './baseApi';
import { tagTypes, TQueryParams } from '../tag-types';
import { IMeta } from '@/types/common';
import { IDoctor } from '@/types/doctor';

export const doctorApi = baseApi.injectEndpoints({
   endpoints: (build) => ({
      createDoctor: build.mutation({
         query: (data) => ({
            url: '/user/create-doctor',
            method: 'POST',
            contentType: 'multipart/form-data',
            data,
         }),
         invalidatesTags: [tagTypes.doctor],
      }),

      getAllDoctors: build.query({
         // query: (args) => {
         //    console.log(args)
         //    const params = new URLSearchParams();
    
         //    if (args) {
         //      args.forEach((item: TQueryParams) => {
         //        params.append(item.name, item.value as string);
         //      });
         //    }
         //    return {
         //      url: "/doctor",
         //      method: "GET",
         //      params: params,
         //    };
         //  },
         //  providesTags: [tagTypes.doctor],
         //  transformResponse: (response: IDoctor[], meta: IMeta) => {
         //    return {
         //       doctors: response,
         //       meta,
         //    };
         // },
         query: (arg: Record<string, any>) => ({
            url: `/doctor`,
            method: 'GET',
            params: arg,
         }),
         transformResponse: (response: IDoctor[], meta: IMeta) => {
            return {
               doctors: response,
               meta,
            };
         },
         providesTags: [tagTypes.doctor],
      }),

      deleteDoctor: build.mutation({
         query: (id) => ({
            url: `/doctor/soft/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: [tagTypes.doctor],
      }),
      //get single doctor
      getDoctor: build.query({
         query: (id: string | string[] | undefined) => ({
            url: `/doctor/${id}`,
            method: 'GET',
         }),
         providesTags: [tagTypes.doctor],
      }),
      // update a doctor
      updateDoctor: build.mutation({
         query: (data) => {
            console.log(data);
            return {
               url: `/doctor/${data.id}`,
               method: 'PATCH',
               data: data.body,
            };
         },
         invalidatesTags: [tagTypes.doctor, tagTypes.user],
      }),
   }),
});

export const {
   useCreateDoctorMutation,
   useGetAllDoctorsQuery,
   useDeleteDoctorMutation,
   useGetDoctorQuery,
   useUpdateDoctorMutation,
} = doctorApi;
