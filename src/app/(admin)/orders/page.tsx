// app/orders/page.tsx (Server Component - no "use client")
import { OrdersDashboard } from "@/components/orders/OrderDashboard";
import type { Order } from "@/types/OrderTypes";
// Mock data - in future, fetch from API/database here


export default function OrdersPage() {
  return <OrdersDashboard  />;
}