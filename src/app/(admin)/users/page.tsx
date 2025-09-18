// app/users/page.tsx (Server Component)
import { UsersDashboard } from "@/components/users/UsersDashboard";
import type { User } from "@/types/UsersTypes";

const mockUsers: User[] = [
  {
    id: "1",
    fullName: "Hyder Abbas",
    phone: "+92321210088",
    email: "hyder@example.com",
    totalOrders: 56,
    totalRevenue: 2474.46,
    firstOrderedAt: new Date("2020-07-29"),
    lastOrderedAt: new Date("2021-06-30"),
    socialPlatform: "Local Signup",
    blacklist: false,
  },
  {
    id: "2",
    fullName: "Bilal Nasir",
    phone: "+92353547869",
    email: "bilal@example.com",
    totalOrders: 38,
    totalRevenue: 4328.99,
    firstOrderedAt: new Date("2021-03-26"),
    lastOrderedAt: new Date("2021-06-21"),
    socialPlatform: "Local Signup",
    blacklist: false,
  },
  {
    id: "3",
    fullName: "Ahmad",
    phone: "+91715864574",
    email: "ahmad@gmail.com",
    totalOrders: 15,
    totalRevenue: 860.05,
    firstOrderedAt: new Date("2020-09-14"),
    lastOrderedAt: new Date("2021-03-25"),
    socialPlatform: "Local Signup",
    blacklist: false,
  },
  {
    id: "4",
    fullName: "Sair Ali",
    phone: "+92328240072",
    email: "sair@gmail.com",
    totalOrders: 12,
    totalRevenue: 1459.00,
    firstOrderedAt: new Date("2020-08-20"),
    lastOrderedAt: new Date("2020-11-09"),
    socialPlatform: "Facebook",
    blacklist: false,
  },
];

export default function UsersPage() {
  return <UsersDashboard initialUsers={mockUsers} />;
}