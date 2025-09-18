// app/orders/page.tsx (Server Component - no "use client")
import { OrdersDashboard } from "@/components/orders/OrderDashboard";
import type { Order } from "@/types/OrderTypes";
// Mock data - in future, fetch from API/database here
const mockOrders: Order[] = [
  {
    id: "158296",
    uniqueId: "OJP9-4RTK768",
    time: new Date("2021-07-29T11:49:37"),
    paymentType: "Cash",
    branch: "100 C Gulberg 3",
    status: "pending",
    address: "Test.Test Al Rehman Garden - Phase 7, Lahore",
    total: 14.00,
    phone: "+92353547869",
    customerName: "Bilal Nasir",
    items: [
      {
        id: "249893",
        name: "Bata Bin Arabo 6 pieces shawarma chicken with potato cubes, Aloo cubes, Aloo sauce and Aloo cubes, Aloo sauce and pickles and fries",
        quantity: 1,
        originalPrice: 20.00,
        discount: 30,
        finalPrice: 14.00,
      },
    ],
    deliveryEta: 45,
    deviceType: "Web",
    appVersion: "2.0",
    deliveryNote: "Test Order",
  },
  {
    id: "156789",
    uniqueId: "GFYD-FOKG92",
    time: new Date("2021-07-25T01:49:00"),
    paymentType: "Cash",
    branch: "100 C Gulberg 3",
    status: "rejected",
    address: "Q.T Al Rehman Garden - Phase 7, Lahore",
    total: 14.00,
    phone: "+92353547869",
    customerName: "Test User",
    items: [],
    deliveryEta: 0,
    deviceType: "Web",
    appVersion: "2.0",
    deliveryNote: "",
  },
  // Add more as needed
];

export default function OrdersPage() {
  return <OrdersDashboard initialOrders={mockOrders} />;
}