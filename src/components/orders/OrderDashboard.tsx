// components/orders-dashboard.tsx
"use client";

// This is the main dashboard component for managing orders.
// It includes a table of orders, search/filter form, modal for order details, and modal for adding new orders.
// We use React hooks for state, forms, and validation.

import { useState } from "react"; // For managing component state
import { format } from "date-fns"; // For formatting dates nicely
import { Search, Download, Filter, Eye, } from "lucide-react"; // Icons for buttons
import { FaMoneyBillWave, FaEye, FaMapMarkerAlt, FaTimes, FaCheck, FaPrint, FaEdit } from "react-icons/fa"; // React Icons for money, eye, etc.
import { toast } from "react-hot-toast"; // For showing toast notifications
import { Button } from "@/components/ui/button"; // UI button component
import { Input } from "@/components/ui/input"; // UI input component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Dropdown select
import { Badge } from "@/components/ui/badge"; // Colored status badges
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"; // Table components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Modal dialog
import { Label } from "@/components/ui/label"; // Form labels
import { useForm } from "react-hook-form"; // For handling form state and validation
import { zodResolver } from "@hookform/resolvers/zod"; // Connects Zod validation to the form
import * as z from "zod"; // For defining form validation rules
import type { Order, OrderItem } from "@/types/OrderTypes"; // Import our order types
import TableContainerCard from "../common/TableContainerCard";
import SearchAndPaginationWrapper from "../common/SearchAndPaginationWrapper";

// Props for the main component: receives initial list of orders from parent
interface OrdersDashboardProps {
  initialOrders: Order[];
}

// Define validation rules for the "Add Order" form using Zod
// This ensures required fields are filled and data types are correct
const addOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email("Valid email is required").optional(),
  address: z.string().min(1, "Address is required"),
  branch: z.string().min(1, "Branch is required"),
  paymentType: z.enum(["cash", "card", "wallet"]),
  deliveryEta: z.number().min(0),
  deliveryNote: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Item name is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        originalPrice: z.number().min(0, "Price must be non-negative"),
        discount: z.number().min(0).max(100),
        finalPrice: z.number().min(0, "Price must be non-negative"),
      })
    )
    .min(1, "At least one item is required"),
});

// Type for the form data based on the schema
type AddOrderForm = z.infer<typeof addOrderSchema>;

// Simple OrdersDataTable component: Renders a table with columns and data rows
// Columns define headers and how to render cells (some are custom functions)


function OrdersDataTable({ data ,showOrderDetails}: { data: Order[] ,showOrderDetails: (order: Order) => void}) {
  const statusMap: Record<string, string> = {
    pending: "Pending",
    rejected: "Rejected",
    accepted: "Accepted",
  };
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'outline' as const; // Orange-ish in shadcn
      case 'rejected': return 'destructive' as const; // Red
      case 'accepted': return 'default' as const; // Green-ish
      default: return 'default' as const;
    }
  };
  const handleShowOrderDetails = (order: Order) => {
    if (showOrderDetails) {
      showOrderDetails(order);
    }
  };

  // Mobile card view for small screens
  const renderMobileCard = (row: Order) => (
    <div key={row.id} className="border rounded-lg p-3 mb-3 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <Badge variant="secondary" className="text-xs">Order #{row.id ?? 'N/A'}</Badge>
        <Badge variant={getStatusVariant(row.status)} className="text-xs">
          {statusMap[row.status] ?? 'Unknown'}
        </Badge>
      </div>
      
      <div className="text-xs font-mono mb-2">{row.uniqueId ?? 'N/A'}</div>
      
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <p className="text-gray-500">Date & Time</p>
          <p>{row?.time ? format(row.time, "dd/MM/yyyy hh:mma") : 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-500">Payment</p>
          <div className="flex items-center space-x-1 text-green-600">
            <FaMoneyBillWave className="h-3 w-3" />
            <span>Cash</span>
          </div>
        </div>
        <div>
          <p className="text-gray-500">Branch</p>
          <p>{row.branch ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-500">Total</p>
          <p className="font-semibold">PKR {(row?.total ?? 0).toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-500 text-xs">Address</p>
        <p className="text-xs truncate">{row.address ?? 'N/A'}</p>
      </div>
      
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => handleShowOrderDetails(row)}>
          <FaEye className="h-3 w-3 mr-1" /> View Details
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Mobile view (card layout) */}
      <div className="md:hidden space-y-3">
        {data.map(renderMobileCard)}
      </div>

      {/* Desktop view (table layout) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left text-xs md:text-sm">
            <tr>
              <th className="px-3 py-2 border">ORDER ID</th>
              <th className="px-3 py-2 border">ORDER TIME</th>
              <th className="px-3 py-2 border">PAYMENTS TYPE</th>
              <th className="px-3 py-2 border">BRANCH</th>
              <th className="px-3 py-2 border">STATUS</th>
              <th className="px-3 py-2 border">CUSTOMER ADDRESS</th>
              <th className="px-3 py-2 border">TOTAL</th>
              <th className="px-3 py-2 border">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                {/* order id  */}
                <td className="px-3 py-2 border text-center">
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-xs">Order #{row.id ?? 'N/A'}</Badge>
                    <div className="font-mono text-xs">{row.uniqueId ?? 'N/A'}</div>
                  </div>
                </td>
                {/* order time */}
                <td className="px-3 py-2 border text-center">
                  {row?.time ? format(row.time, "dd/MM/yyyy hh:mma") : 'N/A'}
                </td>
                {/* payment type */}
                <td className="px-3 py-2 border text-center">
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <FaMoneyBillWave className="h-3 w-3" />
                    <span>Cash</span>
                  </div>
                </td>
                {/* branch */}
                <td className="px-3 py-2 border text-center">
                  <div className="space-y-1">
                    <div className="text-sm">{row.branch ?? 'N/A'}</div>
                    <div className="text-xs text-gray-500 font-mono">31439278166</div> {/* Hardcoded phone from image */}
                  </div>
                </td>
                {/* status */}
                <td className="px-3 py-2 border text-center">
                  <Badge variant={getStatusVariant(row.status)} className="text-xs"> {/* Custom variant */}
                    {statusMap[row.status] ?? 'Unknown'}
                  </Badge>
                </td>
                {/* customer address */}
                <td className="px-3 py-2 border text-center">
                  <div className="flex items-start space-x-1">
                    <span className="text-xs">(○)</span> {/* Circle icon from image */}
                    <span className="text-sm max-w-xs truncate">{row.address ?? 'N/A'}</span>
                  </div>
                </td>
                {/* total */}
                <td className="px-3 py-2 border text-center">
                  <span className="text-sm">PKR {(row?.total ?? 0).toFixed(2)}</span>
                </td>
                {/* action */}
                <td className="px-3 py-2 border text-center">
                  <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => handleShowOrderDetails(row)}>
                    <FaEye className="h-3 w-3" /> {/* Eye icon for view */}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



// Modal for viewing order details
// Shows customer info, order info, items table, totals, and action buttons
function OrderDetailsModal({ order, open, onOpenChange, onOrderUpdate }: { order: Order; open: boolean; onOpenChange: (open: boolean) => void; onOrderUpdate?: (updatedOrder: Order) => void }) {
  const [currentOrder, setCurrentOrder] = useState<Order>(order); // Local state for the order to handle status changes
  const [eta, setEta] = useState(currentOrder.deliveryEta ?? 45); // Local state for ETA input, default to 45 if undefined

  // Render mobile-friendly item card for small screens
  const renderItemCard = (item: OrderItem, idx: number) => (
    <div key={item.id ?? idx} className="border rounded-md p-3 mb-3 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm">{item.name ?? 'N/A'}</span>
        <Badge variant="secondary" className="text-xs">ID: {item.id ?? 'N/A'}</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Ordered Qty</p>
          <p>{item.quantity ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Delivered Qty</p>
          <p>0</p>
        </div>
        <div>
          <p className="text-gray-500">Original Price</p>
          <p>PKR {(item.originalPrice ?? 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Discount</p>
          <p>{(item.discount ?? 0)}%</p>
        </div>
        <div>
          <p className="text-gray-500">Item Price</p>
          <p>PKR {(item.finalPrice ?? 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Total</p>
          <p className="font-semibold">PKR {((item.finalPrice ?? 0) * (item.quantity ?? 0)).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="  bg-white p-4 md:p-6 rounded-lg min-w-[95vw] 2xl:min-w-[1300px] md:w-auto">
      <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Order Details (ASAP)</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Customer and Order Details - Responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-3 rounded-md"> {/* Left column: Customer */}
              <h3 className="font-semibold mb-2 text-sm">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {currentOrder.customerName ?? 'N/A'}</p>
                <p><strong>Phone:</strong> {currentOrder.phone ?? 'N/A'}</p>
                <p><strong>Email Address:</strong> bilalnasir@example.com</p>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-grow">
                    <strong>Delivery Location:</strong> {currentOrder.address ?? 'N/A'}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-1 sm:mt-0 sm:ml-2 p-0 h-auto w-fit">
                    <FaMapMarkerAlt className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md"> {/* Right column: Order info */}
              <h3 className="font-semibold mb-2 text-sm">Order Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Daily Order #:</strong> 1</p>
                <p><strong>Order #:</strong> {currentOrder.id ?? 'N/A'}</p>
                <p><strong>Order Unique Id:</strong> {currentOrder.uniqueId ?? 'N/A'}</p>
                <p><strong>Time Status:</strong> {currentOrder.time ? format(currentOrder.time, "dd/MM/yyyy HH:mm:ss") : 'N/A'}</p>
                <p>
                  <strong>Status:</strong> 
                  <Badge 
                    variant={currentOrder.status === 'accepted' ? 'default' : currentOrder.status === 'rejected' ? 'destructive' : 'outline'} 
                    className="ml-1"
                  >
                    {currentOrder.status === 'accepted' ? 'Accepted' : currentOrder.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </Badge>
                </p>
                <p><strong>Delivery Time:</strong> ASAP</p>
                <p><strong>Payment Type:</strong> Cash on delivery</p>
                <p><strong>Payment Channel:</strong> COD</p>
                <p><strong>Payment Verified Status:</strong> <Badge variant="default" className="ml-1">COD</Badge></p>
                <p><strong>Device Type:</strong> {order.deviceType ?? 'N/A'}</p>
                <p><strong>App Version:</strong> {order.appVersion ?? 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Items section - Responsive design */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">Items Detail</h3>
            
            {/* Mobile view (cards) */}
            <div className="md:hidden space-y-3">
              {(currentOrder.items ?? []).map((item, idx) => renderItemCard(item, idx))}
            </div>
            
            {/* Desktop view (table) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Item ID</th>
                    <th className="border p-2 text-left">Item Details</th>
                    <th className="border p-2 text-left">Delivered Qty</th>
                    <th className="border p-2 text-left">Ordered Qty</th>
                    <th className="border p-2 text-left">Original Price</th>
                    <th className="border p-2 text-left">Discount % (If Any)</th>
                    <th className="border p-2 text-left">Item Price</th>
                    <th className="border p-2 text-left">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentOrder.items ?? []).map((item, idx) => (
                    <tr key={item.id ?? idx}>
                      <td className="border p-2">{item.id ?? 'N/A'}</td>
                      <td className="border p-2 max-w-xs truncate">{item.name ?? 'N/A'}</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2">{item.quantity ?? 0}</td>
                      <td className="border p-2">{(item.originalPrice ?? 0).toFixed(2)}</td>
                      <td className="border p-2">{(item.discount ?? 0)}%</td>
                      <td className="border p-2">{(item.finalPrice ?? 0).toFixed(2)}</td>
                      <td className="border p-2">{((item.finalPrice ?? 0) * (item.quantity ?? 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals section - Responsive design */}
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="font-semibold mb-2 text-sm">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span>Order Total</span>
                <span className="text-right">Sub Total</span>
                <span className="text-right">PKR {(currentOrder.total ?? 14).toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span>Delivery Charges</span>
                <span className="text-right">PKR 0.00</span>
              </div>
              <div className="grid grid-cols-2">
                <span>Tax (10%) Charges</span>
                <span className="text-right">PKR 0.00</span>
              </div>
              <div className="grid grid-cols-2">
                <span>Promo Discount</span>
                <span className="text-right">PKR 0</span>
              </div>
              <div className="grid grid-cols-2">
                <span>Wallet Amount</span>
                <span className="text-right">PKR 0.00</span>
              </div>
              <div className="grid grid-cols-2">
                <span>Loyalty Discount</span>
                <span className="text-right">PKR 0</span>
              </div>
              <div className="grid grid-cols-2 font-bold border-t pt-2">
                <span>Grand Total</span>
                <span className="text-right">PKR {(currentOrder.total ?? 14).toFixed(2)}</span>
              </div>
              <div>
                <strong>Delivery Note:</strong> {currentOrder.deliveryNote ?? 'Test Order'}
              </div>
            </div>
          </div>

          {/* ETA update input - Responsive design */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm">Delivery ETA</span>
            <Input
              type="number"
              value={eta}
              onChange={(e) => setEta(Number(e.target.value))}
              className="w-16 text-sm"
            />
            <span className="text-sm">Min</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => {
                // Create updated order
                const updatedOrder = {...currentOrder, deliveryEta: eta};
                // Update local state
                setCurrentOrder(updatedOrder);
                // Call the callback to update parent state
                onOrderUpdate?.(updatedOrder);
                // Show success message
                toast.success("Delivery ETA updated successfully");
              }}
            >
              Update ETA
            </Button>
          </div>

          {/* Action buttons - Responsive design */}
          <div className="flex flex-wrap justify-end gap-2 pt-4">
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => {
                // Create updated order
                const updatedOrder :Order = {...currentOrder, status: "rejected"};
                // Update local state
                setCurrentOrder(updatedOrder);
                // Call the callback to update parent state
                onOrderUpdate?.(updatedOrder);
                // In a real app, you would call an API here to update the order status
                toast.success("Order rejected successfully")
              }}
              disabled={currentOrder.status === "rejected"}
            >
              <FaTimes className="h-3 w-3" /> Reject
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
              onClick={() => {
                // Create updated order
                const updatedOrder :Order = {...currentOrder, status: "accepted"};
                // Update local state
                setCurrentOrder(updatedOrder);
                // Call the callback to update parent state
                onOrderUpdate?.(updatedOrder);
                // In a real app, you would call an API here to update the order status
                toast.success("Order accepted successfully")
              }}
              disabled={currentOrder.status === "accepted"}
            >
              <FaCheck className="h-3 w-3" /> Accept
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FaPrint className="h-3 w-3" /> Print
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FaEdit className="h-3 w-3" /> Edit Order
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-4 text-center">
          COPYRIGHT © 2022 Blink Merchant | Powered by Blink. All rights reserved.
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal for adding a new order with responsive design and all required fields
function AddOrderModal({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit?: (data: AddOrderForm) => void }) {
  // Set up form with default values and validation
  const form = useForm<AddOrderForm>({
    resolver: zodResolver(addOrderSchema), // Use Zod for validation
    defaultValues: { // Starting values
      customerName: "",
      phone: "",
      email: "",
      address: "",
      branch: "",
      paymentType: "cash",
      deliveryEta: 45,
      deliveryNote: "",
      items: [{ id: `item-${Date.now()}`, name: "", quantity: 1, originalPrice: 0, discount: 0, finalPrice: 0 }], // One empty item to start
    },
  });

  // Handle form submission
  const handleSubmit = (data: AddOrderForm) => {
    onSubmit?.(data); // Call parent handler (e.g., save to API)
    form.reset(); // Clear form
    onOpenChange(false); // Close modal
  };

  // Add a new empty item to the list
  const addItem = () => {
    const items = form.getValues("items"); // Get current items
    form.setValue("items", [...items, { id: `item-${Date.now()}-${items.length}`, name: "", quantity: 1, originalPrice: 0, discount: 0, finalPrice: 0 }]); // Append new one with unique ID
  };

  // Remove an item by index
  const removeItem = (index: number) => {
    const items = form.getValues("items");
    form.setValue("items", items.filter((_, i) => i !== index)); // Filter out the one at index
  };
  
  // Calculate final price when original price or discount changes
  const calculateFinalPrice = (index: number) => {
    const items = form.getValues("items");
    const item = items[index];
    if (item.originalPrice !== undefined && item.discount !== undefined) {
      const finalPrice = item.originalPrice * (1 - item.discount / 100);
      form.setValue(`items.${index}.finalPrice`, parseFloat(finalPrice.toFixed(2)));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}> {/* Modal */}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"> {/* Increased width and added scrolling */}
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
        </DialogHeader>
        {/* Form with submit handler */}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6"> {/* Increased spacing */}
          {/* Customer Information Section */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-md"> {/* Added section styling */}
            <h3 className="font-semibold text-sm">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Responsive grid */}
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" {...form.register("customerName")} />
                {form.formState.errors.customerName && (
                  <p className="text-sm text-red-500">{form.formState.errors.customerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" {...form.register("branch")} />
                {form.formState.errors.branch && (
                  <p className="text-sm text-red-500">{form.formState.errors.branch.message}</p>
                )}
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2"> {/* Full width on all screens */}
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...form.register("address")} />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Information Section */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-md"> {/* Added section styling */}
            <h3 className="font-semibold text-sm">Delivery Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Responsive grid */}
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select onValueChange={(value) => form.setValue("paymentType", value as any)} defaultValue="cash">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem> {/* Added wallet option */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryEta">Delivery ETA (minutes)</Label>
                <Input 
                  id="deliveryEta" 
                  type="number" 
                  {...form.register("deliveryEta", { valueAsNumber: true })} 
                  defaultValue="45"
                />
                {form.formState.errors.deliveryEta && (
                  <p className="text-sm text-red-500">{form.formState.errors.deliveryEta.message}</p>
                )}
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2"> {/* Full width on all screens */}
                <Label htmlFor="deliveryNote">Delivery Note</Label>
                <Input id="deliveryNote" {...form.register("deliveryNote")} />
                {form.formState.errors.deliveryNote && (
                  <p className="text-sm text-red-500">{form.formState.errors.deliveryNote.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Items section: Dynamic list with improved layout */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-sm">Order Items</h3>
            {form.watch("items").map((item, index) => (
              <div key={index} className="p-3 mb-3 border rounded-md bg-white"> {/* Card for each item */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3"> {/* Responsive grid */}
                  <div className="space-y-2 md:col-span-2"> {/* Name takes more space */}
                    <Label>Item Name</Label>
                    <Input
                      placeholder="Item Name"
                      {...form.register(`items.${index}.name` as const)}
                    />
                    {form.formState.errors.items?.[index]?.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.items?.[index]?.name?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      {...form.register(`items.${index}.quantity`, { 
                        valueAsNumber: true,
                      })}
                    />
                    {form.formState.errors.items?.[index]?.quantity && (
                      <p className="text-sm text-red-500">{form.formState.errors.items?.[index]?.quantity?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Original Price</Label>
                    <Input
                      type="number"
                      placeholder="Original Price"
                      {...form.register(`items.${index}.originalPrice`, { 
                        valueAsNumber: true,
                        onChange: () => calculateFinalPrice(index)
                      })}
                    />
                    {form.formState.errors.items?.[index]?.originalPrice && (
                      <p className="text-sm text-red-500">{form.formState.errors.items?.[index]?.originalPrice?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Discount (%)</Label>
                    <Input
                      type="number"
                      placeholder="Discount"
                      {...form.register(`items.${index}.discount`, { 
                        valueAsNumber: true,
                        onChange: () => calculateFinalPrice(index)
                      })}
                    />
                    {form.formState.errors.items?.[index]?.discount && (
                      <p className="text-sm text-red-500">{form.formState.errors.items?.[index]?.discount?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Final Price</Label>
                    <Input
                      type="number"
                      placeholder="Final Price"
                      {...form.register(`items.${index}.finalPrice`, { valueAsNumber: true })}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)} className="text-red-500">
                    Remove Item
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="w-full md:w-auto">
              Add Item
            </Button>
            {form.formState.errors.items && (
              <p className="text-sm text-red-500">{(form.formState.errors.items as any).message}</p>
            )}
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Main exported component
export function OrdersDashboard({ initialOrders }: OrdersDashboardProps) {
  // State for orders list, selected order, and modal visibility
  const [ordersData, setOrdersData] = useState(initialOrders.filter(order => order && order.id)); // Filter out invalid orders using id
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Currently viewing order
  const [showDetails, setShowDetails] = useState(false); // Show details modal?
  const [showAddOrder, setShowAddOrder] = useState(false); // Show add modal?
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter orders based on search term and status filter
  const filteredOrders = ordersData.filter(order => {
    // Filter by search term (customer name, order ID, or address)
    const matchesSearch = searchTerm === "" || 
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.uniqueId && order.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.address && order.address.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === null || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Open details modal for a specific order
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Handle new order submission (placeholder for API call)
  const handleAddOrder = (data: AddOrderForm) => {
    console.log("New order:", data); // Log for now
    // Create a new order from form data
    const newOrder: Order = {
      id: String(ordersData.length + 1),
      uniqueId: `ORD-${Math.floor(Math.random() * 10000)}`,
      time: new Date(),
      status: "pending",
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      branch: data.branch,
      items: data.items,
      total: data.items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
      deliveryEta: data.deliveryEta,
      deliveryNote: data.deliveryNote || "",
      deviceType: "web",
      appVersion: "1.0.0",
      paymentType: data.paymentType
    };
    
    // Add the new order to the state
    setOrdersData(prev => [newOrder, ...prev]);
    setShowAddOrder(false);
  };
  
  // Handle search term change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 space-y-6 bg-purple-50 min-h-screen"> {/* Main layout container with purple bg */}
      <TableContainerCard
        title="Orders"
        addButton
        addButtonText="Add New Order"
        addButtonAction={() => { setShowAddOrder(true) }}
      >
        <SearchAndPaginationWrapper
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          currentPage={currentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={() => {}}
        >
          <OrdersDataTable data={paginatedOrders} showOrderDetails={handleViewDetails} />
        </SearchAndPaginationWrapper>
      </TableContainerCard>

      {/* Render details modal if open */}
      {showDetails && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          open={showDetails} 
          onOpenChange={setShowDetails} 
          onOrderUpdate={(updatedOrder) => {
            // Update the order in the orders data array
            setOrdersData(prev => 
              prev.map(order => 
                order.id === updatedOrder.id ? updatedOrder : order
              )
            );
            // Update selected order if it's still open
            setSelectedOrder(updatedOrder);
          }}
        />
      )}

      {/* Render add modal if open */}
      <AddOrderModal open={showAddOrder} onOpenChange={setShowAddOrder} onSubmit={handleAddOrder} />
    </div>
  );
}