// components/orders-dashboard.tsx
"use client";

// This is the main dashboard component for managing orders.
// It includes a table of orders, search/filter form, modal for order details, and modal for adding new orders.
// We use React hooks for state, forms, and validation.

import { useState } from "react"; // For managing component state
import { format } from "date-fns"; // For formatting dates nicely
import { Search, Download, Filter, Eye, } from "lucide-react"; // Icons for buttons
import { FaMoneyBillWave, FaEye, FaMapMarkerAlt, FaTimes, FaCheck, FaPrint, FaEdit } from "react-icons/fa"; // React Icons for money, eye, etc.
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
  customerName: z.string().min(1, "Name is required"), // String, at least 1 char
  phone: z.string().min(10, "Phone is required"), // String, at least 10 chars (for phone length)
  address: z.string().min(1, "Address is required"), // String, at least 1 char
  paymentType: z.enum(["cash", "card"]), // Must be one of these values
  items: z
    .array( // Array of items
      z.object({
        name: z.string().min(1), // Item name required
        quantity: z.number().min(1), // Quantity at least 1
        price: z.number().min(0), // Price 0 or more
      })
    )
    .min(1, "At least one item is required"), // At least one item in the array
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

  return (
    <div className="overflow-x-auto ">
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
                <div className="flex items-center space-x-1 text-green-600">
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
  );
}



// Modal for viewing order details
// Shows customer info, order info, items table, totals, and action buttons
function OrderDetailsModal({ order, open, onOpenChange }: { order: Order; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [eta, setEta] = useState(order.deliveryEta ?? 45); // Local state for ETA input, default to 45 if undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}> {/* Modal dialog */}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg"> {/* Content with max size, scroll, white bg, padding, rounded */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Order Details (ASAP)</DialogTitle> {/* Title */}
        </DialogHeader>
        <div className="space-y-6"> {/* Sections with vertical spacing */}
          {/* Customer and Order Details - Two columns on medium screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div> {/* Left column: Customer */}
              <h3 className="font-semibold mb-2 text-sm">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {order.customerName ?? 'N/A'}</p>
                <p><strong>Phone:</strong> {order.phone ?? 'N/A'}</p>
                <p><strong>Email Address:</strong> bilalnasir@example.com</p> {/* Hardcoded email from image */}
                <p className="flex items-center">
                  <strong>Delivery Location:</strong> {order.address ?? 'N/A'}
                  <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                    <FaMapMarkerAlt className="h-3 w-3" />
                  </Button>
                </p>
              </div>
            </div>
            <div> {/* Right column: Order info */}
              <h3 className="font-semibold mb-2 text-sm">Order Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Daily Order #:</strong> 1</p>
                <p><strong>Order #:</strong> {order.id ?? 'N/A'}</p>
                <p><strong>Order Unique Id:</strong> {order.uniqueId ?? 'N/A'}</p>
                <p><strong>Time Status:</strong> {order.time ? format(order.time, "dd/MM/yyyy HH:mm:ss") : 'N/A'}</p> {/* Match image format */}
                <p><strong>Delivery Time:</strong> ASAP</p>
                <p><strong>Payment Type:</strong> Cash on delivery</p>
                <p><strong>Payment Channel:</strong> COD</p>
                <p><strong>Payment Verified Status:</strong> <Badge variant="default" className="ml-1">COD</Badge></p> {/* Badge for verified */}
                <p><strong>Device Type:</strong> {order.deviceType ?? 'N/A'}</p>
                <p><strong>App Version:</strong> {order.appVersion ?? 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">Items Detail</h3>
            <div className="overflow-x-auto"> {/* Scroll horizontally on small screens */}
              <table className="w-full border-collapse border border-gray-300 text-sm"> {/* Simple HTML table with borders */}
                <thead>
                  <tr className="bg-gray-100"> {/* Header row with light background */}
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
                  {(order.items ?? []).map((item, idx) => ( // Safe map with empty array fallback, use idx if no id
                    <tr key={item.id ?? idx}>
                      <td className="border p-2">{item.id ?? 'N/A'}</td>
                      <td className="border p-2 max-w-xs truncate">{item.name ?? 'N/A'}</td> {/* Truncate long names */}
                      <td className="border p-2">0</td> {/* Delivered qty hardcoded as 0 */}
                      <td className="border p-2">{item.quantity ?? 0}</td>
                      <td className="border p-2">{(item.originalPrice ?? 0).toFixed(2)}</td>
                      <td className="border p-2">{(item.discount ?? 0)}%</td>
                      <td className="border p-2">{(item.finalPrice ?? 0).toFixed(2)}</td>
                      <td className="border p-2">{((item.finalPrice ?? 0) * (item.quantity ?? 0)).toFixed(2)}</td> {/* Calculate total safely */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals section - Single column layout matching image */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Order Total</span>
              <span>Sub Total</span>
              <span>PKR {(order.total ?? 14).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>PKR 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%) Charges</span>
              <span>PKR 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Promo Discount</span>
              <span>PKR 0</span>
            </div>
            <div className="flex justify-between">
              <span>Wallet Amount</span>
              <span>PKR 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Loyalty Discount</span>
              <span>PKR 0</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Grand Total</span>
              <span>PKR {(order.total ?? 14).toFixed(2)}</span>
            </div>
            <div>
              <strong>Delivery Note:</strong> {order.deliveryNote ?? 'Test Order'}
            </div>
          </div>

          {/* ETA update input - Matches image layout */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">Delivery ETA</span>
            <Input
              type="number"
              value={eta}
              onChange={(e) => setEta(Number(e.target.value))}
              className="w-16 text-sm"
            />
            <span className="text-sm">Min</span>
            <Button variant="outline" size="sm" className="h-8">
              Update ETA
            </Button>
          </div>

          {/* Action buttons at bottom - Exact match with icons and colors */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="destructive" size="sm" className="flex items-center gap-1">
              <FaTimes className="h-3 w-3" /> Reject
            </Button>
            <Button variant="default" size="sm" className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
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
      </DialogContent>
    </Dialog>
  );
}

// Modal for adding a new order (kept as is, since not in main image but requested)
function AddOrderModal({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit?: (data: AddOrderForm) => void }) {
  // Set up form with default values and validation
  const form = useForm<AddOrderForm>({
    resolver: zodResolver(addOrderSchema), // Use Zod for validation
    defaultValues: { // Starting values
      customerName: "",
      phone: "",
      address: "",
      paymentType: "cash",
      items: [{ name: "", quantity: 1, price: 0 }], // One empty item to start
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
    form.setValue("items", [...items, { name: "", quantity: 1, price: 0 }]); // Append new one
  };

  // Remove an item by index
  const removeItem = (index: number) => {
    const items = form.getValues("items");
    form.setValue("items", items.filter((_, i) => i !== index)); // Filter out the one at index
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}> {/* Modal */}
      <DialogContent className="max-w-2xl"> {/* Content width */}
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
        </DialogHeader>
        {/* Form with submit handler */}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Customer name field */}
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input id="customerName" {...form.register("customerName")} /> {/* Register with form hook */}
            {form.formState.errors.customerName && ( // Show error if invalid
              <p className="text-sm text-red-500">{form.formState.errors.customerName.message}</p>
            )}
          </div>

          {/* Phone field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...form.register("phone")} />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>

          {/* Address field */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...form.register("address")} />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
            )}
          </div>

          {/* Payment type dropdown */}
          <div className="space-y-2">
            <Label htmlFor="paymentType">Payment Type</Label>
            <Select onValueChange={(value) => form.setValue("paymentType", value as any)} defaultValue="cash">
              <SelectTrigger>
                <SelectValue /> {/* Shows selected value */}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items section: Dynamic list */}
          <div className="space-y-2">
            <Label>Items</Label>
            {form.watch("items").map((item, index) => ( // Watch for changes and re-render
              <div key={index} className="flex space-x-2 items-end"> {/* Row for each item */}
                <Input
                  placeholder="Item Name"
                  {...form.register(`items.${index}.name` as const)} // Register nested field
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  {...form.register(`items.${index}.quantity`, { valueAsNumber: true })} // Convert to number
                />
                <Input
                  type="number"
                  placeholder="Price"
                  {...form.register(`items.${index}.price`, { valueAsNumber: true })}
                />
                <Button type="button" variant="outline" onClick={() => removeItem(index)}>
                  Remove {/* Button to remove this item */}
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem}>
              Add Item {/* Button to add new item */}
            </Button>
            {form.formState.errors.items && ( // Array error
              <p className="text-sm text-red-500">{(form.formState.errors.items as any).message}</p>
            )}
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button> {/* Triggers validation and submit */}
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

  // Open details modal for a specific order
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Handle new order submission (placeholder for API call)
  const handleAddOrder = (data: AddOrderForm) => {
    console.log("New order:", data); // Log for now
    // In real app: Send to server, then refresh ordersData
  };

  return (
    <div className="container mx-auto p-4 space-y-6 bg-purple-50 min-h-screen"> {/* Main layout container with purple bg */}
      <TableContainerCard
        title="Orders"
        addButton
        addButtonText="Add Section"
        addButtonAction={() => { setShowAddOrder(true) }}
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
          <OrdersDataTable  data={ordersData} showOrderDetails={handleViewDetails}   />

        </SearchAndPaginationWrapper>


      </TableContainerCard>



      {/* Render details modal if open */}
      {showDetails && selectedOrder && (
        <OrderDetailsModal order={selectedOrder} open={showDetails} onOpenChange={setShowDetails} />
      )}

      {/* Render add modal if open */}
      <AddOrderModal open={showAddOrder} onOpenChange={setShowAddOrder} onSubmit={handleAddOrder} />
    </div>
  );
}