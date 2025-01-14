"use server";

import { authKey } from "@/app/constent/authKey";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const setAccessToken = (token, option) => {
  cookies().set(authKey, token);
  if (option && option.redirect) {
    redirect(option.redirect);
  }
}
