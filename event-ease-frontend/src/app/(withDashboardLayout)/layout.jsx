"use client";

import { useRouter } from "next/navigation";
import DashboardDrawer from "../component/DashboarDrawer";
import { getUserInfo, isLoggedIn } from "../store/authServices";

const DashboardLayout = ({ children }) => {
    console.log(getUserInfo())
  const router = useRouter();
    if (!getUserInfo()) {
      router.push(`/login`);
    }
  return <DashboardDrawer>{children}</DashboardDrawer>;
};

export default DashboardLayout;
