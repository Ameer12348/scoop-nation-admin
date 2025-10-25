import type { Metadata } from "next";
import React from "react";
import AnalyticsDashboard from "@/components/ecommerce/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Scoop Nation Admin",
  description: "Monitor your business performance and insights",
};

export default function Ecommerce() {
  return <AnalyticsDashboard />;
}
