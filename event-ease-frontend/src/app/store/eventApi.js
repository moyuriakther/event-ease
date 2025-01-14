import {apiSlice} from "./apiSlice";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: () => ({
        url: `/api/events`,
        method: "POST",
      }),
    }),
    getEvents: builder.query({
      query: () => ({
        url: `/api/events`,
        method: "GET",
      }),
    }),
    registerEvent: builder.mutation({
      query: (id) => ({
        url: `/api/events/${id}/register`,
        method: "POST",
      }),
    }),
  }),
});
export const {useCreateEventMutation, useGetEventsQuery, useRegisterEventMutation } = eventApi;
