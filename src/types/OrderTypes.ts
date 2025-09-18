// types/order.ts

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  originalPrice: number;
  discount: number;
  finalPrice: number;
}

export interface Order {
  id: string;
  uniqueId: string;
  time: Date;
  paymentType: string;
  branch: string;
  status: "pending" | "rejected" | "accepted";
  address: string;
  total: number;
  phone: string;
  customerName: string;
  items: OrderItem[];
  deliveryEta: number;
  deviceType: string;
  appVersion: string;
  deliveryNote: string;
}