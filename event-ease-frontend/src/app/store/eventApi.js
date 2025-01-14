import {apiSlice} from "./apiSlice";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (data) => ({
        url: `/api/events`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Event"]
    }),
    getEvents: builder.query({
      query: () => ({
        url: `/api/events`,
        method: "GET",
      }),
      providesTags: ["Event"]
    }),
    registerEvent: builder.mutation({
      query: (id) => ({
        url: `/api/events/${id}/register`,
        method: "POST",
      }),
      invalidatesTags:["Event"]
    }),
  }),
});
export const {useCreateEventMutation, useGetEventsQuery, useRegisterEventMutation } = eventApi;
