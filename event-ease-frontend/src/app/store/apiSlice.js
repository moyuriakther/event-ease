import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authKey } from "../constent/authKey";
import { getUserInfo } from "./authServices";
import { getFromLocalStorage } from "../utils/local-storage";
// import { axiosBaseQuery } from "../helpers/axios/axiosBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    prepareHeaders: async (headers, { getState }) => {
      const userInfo = getFromLocalStorage(authKey);
      console.log(userInfo)
      if (userInfo) {
        headers.set("Authorization", `${userInfo}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});
