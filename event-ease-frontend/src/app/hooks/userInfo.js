import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../utils/local-storage";
import { decodedToken } from "../utils/jwt";
import { authKey } from "../constants/authKey";

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState("");
  const authToken = getFromLocalStorage(authKey);
  useEffect(() => {
    const fetchUserInfo = () => {
      if (authToken) {
        const decodedData = decodedToken(
          authToken
        )
        const userInfo = {
          ...decodedData,
        };
        setUserInfo(userInfo);
      } else {
        setUserInfo("");
      }
    };

    fetchUserInfo();
  }, [authToken]);

  return userInfo;
};

export default useUserInfo;
