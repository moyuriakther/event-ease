"use client";

import { useRouter } from "next/navigation";
import DashboardDrawer from "../component/DashboarDrawer";
import { getUserInfo } from "../store/authServices";
// import { Toaster } from "sonner";
import { SocketProvider } from "../../contexts/SocketContext";
import { useEffect, useState } from "react";

const DashboardLayout = ({ children }) => {
 const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

 useEffect(() => {
    if (!getUserInfo()) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return null;
  }

  return(<SocketProvider>
            <DashboardDrawer>{children}</DashboardDrawer>
            {/* <Toaster position="top-right" /> */}
        </SocketProvider> );
};

export default DashboardLayout;
