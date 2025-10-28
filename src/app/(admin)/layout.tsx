"use client";

import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import OrderNotify from "@/components/orders/OrderNotify";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[250px]"
    : "lg:ml-[70px]";

  return (
    <div className="min-h-screen xl:flex">
      <ProtectedRoutes>
          {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          <div className="p-2.5 mx-auto max-w-[1800px] md:p-4">{children}</div>
        </div>
        <OrderNotify/>
      </ProtectedRoutes>
    </div>
  );
}
