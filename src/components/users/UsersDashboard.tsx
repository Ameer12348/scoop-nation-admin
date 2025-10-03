// components/users-dashboard.tsx
"use client";

// This is the main dashboard component for managing registered users.
// It includes a table of users, search/filter form, and more filters modal.

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Download, Filter, Eye, Loader } from "lucide-react";
import { FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt, FaTimes, FaCheck, FaPrint, FaEdit, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User } from "@/types/UsersTypes";
import TableContainerCard from "../common/TableContainerCard";
import SearchAndPaginationWrapper from "../common/SearchAndPaginationWrapper";
import { Customer } from "@/store/slices/customerSlice";
import { useCustomers } from "@/store/hooks";
import UserDetailsPopup from "./UserDetailsPopup";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";

interface UsersDashboardProps {
  initialUsers: User[];
}

const filterSchema = z.object({
  fullname: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  minOrders: z.number().optional(),
  maxOrders: z.number().optional(),
  minRevenue: z.number().optional(),
  maxRevenue: z.number().optional(),
  validity: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
});

type FilterForm = z.infer<typeof filterSchema>;


function UsersTable({ data }: { data: Customer[] }) {
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleViewUser = (user: Customer) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100 text-left text-xs md:text-sm">
          <tr>
            <th className="px-3 py-2 border whitespace-nowrap">FULL NAME	</th>
            <th className="px-3 py-2 border whitespace-nowrap">PHONE NO	</th>
            <th className="px-3 py-2 border whitespace-nowrap">EMAIL ADDRESS		</th>
            <th className="px-3 py-2 border whitespace-nowrap">TOTAL ORDERS	</th>
            <th className="px-3 py-2 border whitespace-nowrap">TOTAL REVENUE	</th>
            <th className="px-3 py-2 border whitespace-nowrap">FIRST ORDERED AT	</th>
            <th className="px-3 py-2 border whitespace-nowrap">LAST ORDERED AT	</th>
            {/* <th className="px-3 py-2 border whitespace-nowrap">SOCIAL PLATFORM	</th> */}
            <th className="px-3 py-2 border whitespace-nowrap">BLACKLIST ACTION	</th>
            <th className="px-3 py-2 border whitespace-nowrap">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50 transition">
              {/* full name */}
              <td className="px-3 py-2 border text-center">
                <div className="flex items-center space-x-2  whitespace-nowrap">
                  <span>{row.fullname ?? 'N/A'}</span>
                </div>
              </td>
              {/* phone no */}
              <td className="px-3 py-2 border text-center">
                <div className="flex items-center space-x-1  whitespace-nowrap">
                  <FaWhatsapp className="h-3 w-3 text-green-500" />
                  <span>{row.phone ?? 'N/A'}</span>
                </div>
              </td>
              {/* email address */}
              <td className="px-3 py-2 border text-center">
                <div className="flex items-center space-x-1  whitespace-nowrap">
                  <FaEnvelope className="h-3 w-3 text-gray-400 " />
                  <a href={`mailto:${row.email}`} className="truncate max-w-xs">{row.email ?? 'N/A'}</a >
                </div>
              </td>
              {/* total orders */}
              <td className="px-3 py-2 border text-center">
                <span>{row.total_orders ?? 0}</span>
              </td>
              {/* total revenue */}
              <td className="px-3 py-2 border text-center  whitespace-nowrap">
                <span>PKR {(parseFloat(row.total_revenue) ?? 0).toFixed(2)}</span>
              </td>
              {/* first ordered at  */}
              <td className="px-3 py-2 border text-center  whitespace-nowrap">
                {row.first_ordered_at ? format(row.first_ordered_at, "dd MMM yyyy") : 'N/A'}
              </td>
              {/* last ordered at */}
              <td className="px-3 py-2 border text-center  whitespace-nowrap">
                {row.last_ordered_at ? format(row.last_ordered_at, "dd MMM yyyy") : 'N/A'}
              </td>
              {/* social platform */}
              {/* <td className="px-3 py-2 border text-center  whitespace-nowrap">
                <Badge variant="secondary">{row.socialPlatform ?? 'Local Signup'}</Badge>               
              </td> */}
              {/* blacklist action */}
              <td className="px-3 py-2 border text-center  whitespace-nowrap">
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" className="p-1 h-6">
                    <FaTimes className="h-3 w-3 text-red-500" />
                  </Button>
                  {/* <Badge variant={row.blacklist ? "destructive" : "default"} className="text-xs">No</Badge> */}
                </div>
              </td>
              {/* actions */}
              <td className="px-3 py-2 border text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-blue-50"
                  onClick={() => handleViewUser(row)}
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Details Popup */}
      <UserDetailsPopup
        userId={selectedUser?.id ?? 0}
        open={showUserDetails}
        onOpenChange={setShowUserDetails}
        loading={true}
      />
    </div>
  );
}


function MoreFiltersModal({ open, onOpenChange, onApply ,form}: { open: boolean; onOpenChange: (open: boolean) => void; onApply: (filters: FilterForm) => void; form: UseFormReturn<FilterForm> }) {
  const handleSubmit = (data: FilterForm) => {
    onApply(data);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-md flex flex-col items-stretch">
        <SheetHeader>
          <DialogTitle>More Filters</DialogTitle>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 overflow-y-auto flex-grow px-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              placeholder="Enter full name"
              {...form.register("fullname")}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              {...form.register("phone")}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="Enter email address"
              {...form.register("email")}
            />
          </div>

          {/* Total Orders Range */}
          {/* <div className="grid grid-cols-2 gap-2 ">
            <div className="space-y-2">
              <Label htmlFor="minOrders">Min Orders</Label>
              <Input
                id="minOrders"
                type="number"
                placeholder="0"
                {...form.register("minOrders", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxOrders">Max Orders</Label>
              <Input
                id="maxOrders"
                type="number"
                placeholder="∞"
                {...form.register("maxOrders", { valueAsNumber: true })}
              />
            </div>
          </div> */}

          {/* Total Revenue Range */}
          {/* <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="minRevenue">Min Revenue (PKR)</Label>
              <Input
                id="minRevenue"
                type="number"
                placeholder="0"
                {...form.register("minRevenue", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRevenue">Max Revenue (PKR)</Label>
              <Input
                id="maxRevenue"
                type="number"
                placeholder="∞"
                {...form.register("maxRevenue", { valueAsNumber: true })}
              />
            </div>
          </div> */}

          {/* Validity Date Range */}
          {/* <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="validityFrom">Validity From</Label>
              <Input
                id="validityFrom"
                type="date"
                {...form.register("validity.from", { valueAsDate: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validityTo">Validity To</Label>
              <Input
                id="validityTo"
                type="date"
                {...form.register("validity.to", { valueAsDate: true })}
              />
            </div>
          </div> */}

        </form>
        <DialogFooter className="space-x-2 px-4 pb-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>Apply Filters</Button>
        </DialogFooter>
      </SheetContent>
    </Sheet>
  );
}

export function UsersDashboard() {

  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search , setSearch ] = useState('')
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const { customers, fetchCustomers, pagination, loading, error } = useCustomers()

  const filterForm = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: {},
  });

  const handleApplyFilters = (filters: FilterForm) => {
    const payload :any= {};
    if (filters.fullname) {
      payload.fullname = filters.fullname;
    }
    if (filters.phone) {
      payload.phone = filters.phone;
    }
    if (filters.email) {
      payload.email = filters.email;
    }
    if (search) {
      payload.search = search;
    }
    fetchCustomers({ page: currentPage, per_page: perPage, ...payload });
  };

  useEffect(() => {
    const filter : any = {};
    const values = filterForm.getValues()
    if (values.fullname) {
      filter.fullname = values.fullname;
    }
    if (values.phone) {
      filter.phone = values.phone;
    }
    if (values.email) {
      filter.email = values.email;
    }
    if (search) {
      filter.search = search;
    }
    fetchCustomers({ page: currentPage, per_page: perPage, ...filter });
  }, [currentPage, perPage, search])

  return (
    <div className="  space-y-6 bg-purple-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div>
          <div className="text-xs text-gray-500 mb-1">UTC+05:00 Asia/Karachi</div>
          <h1 className="text-xl font-bold">Registered Users</h1>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Input placeholder="Quick search users by name or phone number" className="pl-10 pr-20"  />
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
            searchValue={search}
            onSearchChange={(value) => { setSearch(value) }}
            currentPage={currentPage}
            totalItems={parseInt(pagination?.total || '0') || 0}
            itemsPerPage={perPage}
            onPageChange={(page) => { setCurrentPage(page) }}
            onItemsPerPageChange={(data) => { setPerPage(data) }}
          >
            {
              loading ? <div className="text-center text-gray-500 py-7 flex justify-center items-center">
                <Loader className="h-8 w-8 animate-spin" />
              </div> : error ? <div className="text-center text-red-500">
                {error}
              </div> :
                customers.length> 0 ? <UsersTable data={customers} />: 
                <div className="text-center text-gray-500 py-7 flex justify-center items-center">
                  No Customers found
                </div>
            }
          </SearchAndPaginationWrapper>
        </TableContainerCard>
      </div>

      <MoreFiltersModal open={showMoreFilters} onOpenChange={setShowMoreFilters} onApply={handleApplyFilters} form={filterForm} />
    </div>
  );
}