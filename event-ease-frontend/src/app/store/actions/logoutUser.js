import { authKey } from "@/app/constent/authKey";
import { deleteCookies } from "./deleteCookies";


export const logoutUser = (router) => {
  localStorage.removeItem(authKey);
  deleteCookies([authKey, "refreshToken"]);
  router.push("/login");
  router.refresh();
};
