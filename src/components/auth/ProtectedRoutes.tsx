"use client";
import { useAuth } from "@/store/hooks";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { setAuthTab, setShowAuthDialog } = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      redirect("/signin");
    }
  }, []);
  return <>{children}</>;
};

export default ProtectedRoutes;
