"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { setAccessToken } from "./setAccessToken";

export const userLogin = async (formData) => {
  console.log({formData})
  console.log("formData")
  const res = await fetch(`http://localhost:5000/api/users/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });
  const userInfo = await res.json();
  console.log({userInfo});

  if (userInfo?.data?.accessToken) {
    setAccessToken(userInfo?.data?.accessToken, {
      redirect: "/",
    });
  }
  return userInfo;
};
