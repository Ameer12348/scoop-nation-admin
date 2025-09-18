// components/users-dashboard.tsx
"use client";

// This is the main dashboard component for managing registered users.
// It includes a table of users, search/filter form, and more filters modal.

import { useState } from "react";
import { format } from "date-fns";
import { Search, Download, Filter, Eye } from "lucide-react";
import { FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt, FaTimes, FaCheck, FaPrint, FaEdit, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User } from "@/types/UsersTypes";
import TableContainerCard from "../common/TableContainerCard";
import SearchAndPaginationWrapper from "../common/SearchAndPaginationWrapper";

interface UsersDashboardProps {
  initialUsers: User[];
}

const filterSchema = z.object({
  lastOrderDate: z.string().optional(),
  numberOfOrders: z.string().optional(),
  amountSpent: z.string().optional(),
  branches: z.array(z.string()).optional(),
  cities: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  sections: z.array(z.string()).optional(),
  items: z.array(z.string()).optional(),
  deviceType: z.string().optional(),
  orderTimeSlot: z.string().optional(),
});

type FilterForm = z.infer<typeof filterSchema>;


function UsersTable({ data }: { data: User[] }) {
  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100 text-left text-xs md:text-sm">
          <tr>
            <th className="px-3 py-2 border">FULL NAME	</th>
            <th className="px-3 py-2 border">PHONE NO	</th>
            <th className="px-3 py-2 border">EMAIL ADDRESS		</th>
            <th className="px-3 py-2 border">TOTAL ORDERS	</th>
            <th className="px-3 py-2 border">TOTAL REVENUE	</th>
            <th className="px-3 py-2 border">FIRST ORDERED AT	</th>
            <th className="px-3 py-2 border">LAST ORDERED AT	</th>
            <th className="px-3 py-2 border">SOCIAL PLATFORM	</th>
            <th className="px-3 py-2 border">BLACKLIST ACTION	</th>
            <th className="px-3 py-2 border">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50 transition">
              {/* full name */}
              <td className="px-3 py-2 border text-center">
                <div className="flex items-center space-x-2">
                  <FaUser className="h-4 w-4 text-gray-400" />
                  <span>{row.fullName ?? 'N/A'}</span>
                </div>
              </td>
              {/* phone no */}
              <td className="px-3 py-2 border text-center">
                <div className="flex items-center space-x-1">
                  <FaWhatsapp className="h-3 w-3 text-green-500" />
                  <span>{row.phone ?? 'N/A'}</span>
                </div>
              </td>
              {/* email address */}
              <td className="px-3 py-2 border text-center">
                <div className="flex items-center space-x-1">
                  <FaEnvelope className="h-3 w-3 text-gray-400" />
                  <span className="truncate max-w-xs">{row.email ?? 'N/A'}</span>
                </div>
              </td>
              {/* total orders */}
              <td className="px-3 py-2 border text-center">
                <span>{row.totalOrders ?? 0}</span>
              </td>
              {/* total revenue */}
              <td className="px-3 py-2 border text-center">
                <span>PKR {(row.totalRevenue ?? 0).toFixed(2)}</span>
              </td>
              {/* first ordered at  */}
              <td className="px-3 py-2 border text-center">
                {row.firstOrderedAt ? format(row.firstOrderedAt, "dd MMM yyyy") : 'N/A'}
              </td>
              {/* last ordered at */}
              <td className="px-3 py-2 border text-center">
                {row.lastOrderedAt ? format(row.lastOrderedAt, "dd MMM yyyy") : 'N/A'}
              </td>
              {/* social platform */}
              <td className="px-3 py-2 border text-center">
                <Badge variant="secondary">{row.socialPlatform ?? 'Local Signup'}</Badge>               </td>
              {/* blacklist action */}
              <td className="px-3 py-2 border text-center">
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" className="p-1 h-6">
                    <FaTimes className="h-3 w-3 text-red-500" />
                  </Button>
                  <Badge variant={row.blacklist ? "destructive" : "default"} className="text-xs">No</Badge>
                </div>
              </td>
              {/* actions */}
              <td className="px-3 py-2 border text-center">
                <Button variant="ghost" size="sm" className="p-1">
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function MoreFiltersModal({ open, onOpenChange, onApply }: { open: boolean; onOpenChange: (open: boolean) => void; onApply: (filters: FilterForm) => void }) {
  const form = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: {},
  });

  const handleSubmit = (data: FilterForm) => {
    onApply(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>More Filters</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Last Order Date</Label>
            <Input type="date" {...form.register("lastOrderDate")} />
          </div>
          <div className="space-y-2">
            <Label>Number of Orders</Label>
            <Select onValueChange={(value) => form.setValue("numberOfOrders", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="50+">50+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount Spent</Label>
            <Select onValueChange={(value) => form.setValue("amountSpent", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1000">PKR 0-1000</SelectItem>
                <SelectItem value="1000-5000">PKR 1000-5000</SelectItem>
                <SelectItem value="5000+">PKR 5000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Branches</Label>
            <Select onValueChange={(value) => form.setValue("branches", [value])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gulberg">100 C Gulberg 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cities</Label>
            <Select onValueChange={(values) => form.setValue("cities", [values])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lahore">Lahore</SelectItem>
                <SelectItem value="karachi">Karachi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Locations (Areas)</Label>
            <Select onValueChange={(values) => form.setValue("locations", [values])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phase7">Phase 7</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sections</Label>
            <Select onValueChange={(values) => form.setValue("sections", [values])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Items</Label>
            <Select onValueChange={(values) => form.setValue("items", [values])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shawarma">Shawarma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Device Type</Label>
            <Select onValueChange={(value) => form.setValue("deviceType", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Order Time Slot</Label>
            <Select onValueChange={(value) => form.setValue("orderTimeSlot", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Apply Filters</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UsersDashboard({ initialUsers }: UsersDashboardProps) {
  const [usersData, setUsersData] = useState(initialUsers);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleApplyFilters = (filters: FilterForm) => {
    // Mock filter logic
    console.log("Applied filters:", filters);
    // In real app, filter usersData based on filters
  };

  const columns = [
    {
      accessorKey: "fullName",
      header: "FULL NAME",
      cell: ({ row }: { row: User }) => (
        <div className="flex items-center space-x-2">
          <FaUser className="h-4 w-4 text-gray-400" />
          <span>{row.fullName ?? 'N/A'}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "PHONE NO",
      cell: ({ row }: { row: User }) => (
        <div className="flex items-center space-x-1">
          <FaWhatsapp className="h-3 w-3 text-green-500" />
          <span>{row.phone ?? 'N/A'}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "EMAIL ADDRESS",
      cell: ({ row }: { row: User }) => (
        <div className="flex items-center space-x-1">
          <FaEnvelope className="h-3 w-3 text-gray-400" />
          <span className="truncate max-w-xs">{row.email ?? 'N/A'}</span>
        </div>
      ),
    },
    {
      accessorKey: "totalOrders",
      header: "TOTAL ORDERS",
      cell: ({ row }: { row: User }) => <span>{row.totalOrders ?? 0}</span>,
    },
    {
      accessorKey: "totalRevenue",
      header: "TOTAL REVENUE",
      cell: ({ row }: { row: User }) => <span>PKR {(row.totalRevenue ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: "firstOrderedAt",
      header: "FIRST ORDERED AT",
      cell: ({ row }: { row: User }) => row.firstOrderedAt ? format(row.firstOrderedAt, "dd MMM yyyy") : 'N/A',
    },
    {
      accessorKey: "lastOrderedAt",
      header: "LAST ORDERED AT",
      cell: ({ row }: { row: User }) => row.lastOrderedAt ? format(row.lastOrderedAt, "dd MMM yyyy") : 'N/A',
    },
    {
      accessorKey: "socialPlatform",
      header: "SOCIAL PLATFORM",
      cell: ({ row }: { row: User }) => <Badge variant="secondary">{row.socialPlatform ?? 'Local Signup'}</Badge>,
    },
    {
      id: "blacklistAction",
      header: "BLACKLIST ACTION",
      cell: ({ row }: { row: User }) => (
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" className="p-1 h-6">
            <FaTimes className="h-3 w-3 text-red-500" />
          </Button>
          <Badge variant={row.blacklist ? "destructive" : "default"} className="text-xs">No</Badge>
        </div>
      ),
    },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }: { row: User }) => (
        <Button variant="ghost" size="sm" className="p-1">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="  space-y-6 bg-purple-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div>
          <div className="text-xs text-gray-500 mb-1">UTC+05:00 Asia/Karachi</div>
          <h1 className="text-xl font-bold">Registered Users</h1>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Input placeholder="Quick search users by name or phone number" className="pl-10 pr-20" />
            <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button className="bg-green-500 hover:bg-green-600">Export to Excel</Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">

        <TableContainerCard
          title="Orders"
          addButton
          addButtonText="More Filters"
          addButtonAction={() => { setShowMoreFilters(true) }}
        >
          <SearchAndPaginationWrapper
            searchValue={''}
            onSearchChange={() => { }}
            currentPage={1}
            totalItems={10}
            itemsPerPage={10}
            onPageChange={() => { }}
            onItemsPerPageChange={() => { }}
          >
            <UsersTable data={usersData} />
          </SearchAndPaginationWrapper>
        </TableContainerCard>
      </div>

      <MoreFiltersModal open={showMoreFilters} onOpenChange={setShowMoreFilters} onApply={handleApplyFilters} />
    </div>
  );
}