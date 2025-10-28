"use client";
import { useAuth } from "@/store/hooks";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { setAuthTab, setShowAuthDialog , } = useAuth();
  const [haveToken , setHaveToken ] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      redirect("/signin");
      return;
    }
    setHaveToken(true);
  }, []);

  if (!haveToken) {
    return <></>;
  }
  return <>{children}</>;

};

export default ProtectedRoutes;
