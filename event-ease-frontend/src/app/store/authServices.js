import { authKey } from "../constent/authKey";
import { decodedToken } from "../utils/jwt";
import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage } from "../utils/local-storage";


export const storeUserInfo = ({ accessToken }) => {
  return setToLocalStorage(authKey, accessToken);
};
export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    const decodedData = decodedToken(authToken);
    return {
      ...decodedData,
    };
  }
};
export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    return !!authToken;
  }
};
export const removeUser = () => {
  return removeFromLocalStorage(authKey);
};
// export const getNewAccessToken = async () => {
//   return await axiosInstance({
//     url: "http://localhost:5000/api/auth/refresh-token",
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     withCredentials: true,
//   });
// };
