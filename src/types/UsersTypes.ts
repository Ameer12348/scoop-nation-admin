// types/UserTypes.ts

export interface User {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    totalOrders: number;
    totalRevenue: number;
    firstOrderedAt: Date;
    lastOrderedAt: Date;
    socialPlatform: string;
    blacklist: boolean;
  }