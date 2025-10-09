'use client';

import { fetchOrderDetails, Order, updateOrder } from "@/store/slices/orderSlice";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Skeleton } from "../ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Loader } from "lucide-react";


 const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'outline' as const; // Orange-ish in shadcn
      case 'rejected': return 'destructive' as const; // Red
      case 'accepted': return 'default' as const; // Green-ish
      case 'dispatched': return 'default' as const; // Green-ish
      case 'delivered': return 'secondary' as const; // Green-ish
      default: return 'default' as const;
    }
  };
   const statusMap: Record<string, string> = {
    pending: "Pending",
    rejected: "Rejected",
    accepted: "Accepted",
    dispatched: "Dispatched",
    delivered:"Delivered",
  };
export default function OrderDetailsModal({ order, open, onOpenChange}: { order: Order; open: boolean; onOpenChange: (open: boolean) => void; }) {
  const {orderDetails:{data:currentOrder,loading:orderDetailsLoading,error:orderDetailsError}} = useAppSelector(x=>x.orders)
  const dispatch = useAppDispatch()
  const { loading: updateOrderLoading } = useAppSelector(x => x.orders.updateOrder)


   useEffect(()=>{
    if (open) {
          dispatch(fetchOrderDetails(order.id))
    }
  },[order,open])



  const handleUpdateOrder = (orderId: string | number, status: string) => {
    dispatch(updateOrder({ orderId, status }));
  };


  if (orderDetailsLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white  rounded-lg min-w-[95vw] 2xl:min-w-[1300px] md:w-auto">
          <div className="max-h-[90vh] p-4 md:p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                <Skeleton className="h-6 w-48" />
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Customer and Order Details Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-3 rounded-md">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>

              {/* Items Detail Skeleton */}
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                {/* Mobile cards skeleton */}
                <div className="md:hidden space-y-3">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="border rounded-md p-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop table skeleton */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        {[...Array(8)].map((_, i) => (
                          <th key={i} className="border p-2">
                            <Skeleton className="h-4 w-full" />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(3)].map((_, idx) => (
                        <tr key={idx}>
                          {[...Array(8)].map((_, i) => (
                            <td key={i} className="border p-2">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary Skeleton */}
              <div className="bg-gray-50 p-3 rounded-md">
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="space-y-2">
                  {[...Array(7)].map((_, idx) => (
                    <div key={idx} className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  if (orderDetailsError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white  rounded-lg min-w-[95vw] 2xl:min-w-[1300px] md:w-auto">
          <div className="max-h-[90vh] p-4 md:p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Order Details</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center text-center py-12 px-6">
              {/* Animated red cross icon */}
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-full bg-red-100 animate-pulse" />
                <svg
                  className="w-20 h-20 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Failed to load order details
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                {orderDetailsError || 'Something went wrong while fetching the order. Please try again later.'}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="gap-2"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

 


  // Render mobile-friendly item card for small screens
  const renderItemCard = (item: Order['items'][0], idx: number) => (
    <div key={item.id ?? idx} className="border rounded-md p-3 mb-3 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm">{item.product?.title ?? 'N/A'}</span>
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
          <p>PKR {(parseFloat(item.variant?.originalPrice || '0') ?? 0).toFixed(2)}</p>
        </div>
        {/* <div>
          <p className="text-gray-500">Discount</p>
          <p>{(item.variant?.value ?? 0)}</p>
        </div> */}
        <div>
          <p className="text-gray-500">Item Price</p>
          <p>PKR {(parseFloat(item.variant?.price || '0') ?? 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Total</p>
          <p className="font-semibold">PKR {(parseFloat(item.variant?.price || '0') * ( parseInt(item.quantity) ?? 0)).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="  bg-white  rounded-lg min-w-[95vw]  2xl:min-w-[1300px] md:w-auto">
      <div className="max-h-[90vh] p-4 md:p-6 overflow-y-auto">
          <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Order Details (ASAP)</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Customer and Order Details - Responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-3 rounded-md"> {/* Left column: Customer */}
              <h3 className="font-semibold mb-2 text-sm">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {currentOrder?.fullname ?? 'N/A'}</p>
                {/* <p><strong>Phone:</strong> {currentOrder?.phone ?? 'N/A'}</p>
                <p><strong>Email Address:</strong> bilalnasir@example.com</p> */}
                <a className="flex flex-col sm:flex-row sm:items-center" href={`https://www.google.com/maps?q=${currentOrder?.customer_address?.latitude},${currentOrder?.customer_address?.longitude}`} target="_blank" rel="noopener noreferrer">
                  <div className="flex-grow">
                    <strong>Delivery Location:</strong> {`${currentOrder?.customer_address?.street_address} ${currentOrder?.customer_address?.city} ${currentOrder?.customer_address?.state} `}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-1 sm:mt-0 sm:ml-2 p-0 h-auto w-fit">
                    <FaMapMarkerAlt className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md"> {/* Right column: Order info */}
              <h3 className="font-semibold mb-2 text-sm">Order Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Daily Order #:</strong> 1</p>
                <p><strong>Order #:</strong> {currentOrder?.order_number ?? 'N/A'}</p>
                <p><strong>Order Unique Id:</strong> {currentOrder?.id ?? 'N/A'}</p>
                <p><strong>Time Status:</strong> {currentOrder?.dateTime ? format(currentOrder?.dateTime, "dd/MM/yyyy HH:mm:ss") : 'N/A'}</p>
                <p>
                  <strong>Status:</strong> 
                  <DropdownMenu>
                    <DropdownMenuTrigger>  <Badge  variant={getStatusVariant(currentOrder?.status as string)} className="text-xs"> {/* Custom variant */}
                      {
                        updateOrderLoading ? <Loader className="h-3 w-3  animate-spin" /> :  <>{statusMap[currentOrder?.status as string] ?? currentOrder?.status?? 'Unknown'}</>
                      }
                     
                    </Badge></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel className="cursor-pointer" onClick={()=>{handleUpdateOrder(currentOrder?.id as string,'pending')}}>pending</DropdownMenuLabel>
                      <DropdownMenuLabel className="cursor-pointer" onClick={()=>{handleUpdateOrder(currentOrder?.id as string,'rejected')}}>rejected</DropdownMenuLabel>
                      <DropdownMenuLabel className="cursor-pointer" onClick={()=>{handleUpdateOrder(currentOrder?.id as string,'accepted')}}>accepted</DropdownMenuLabel>
                      <DropdownMenuLabel className="cursor-pointer" onClick={()=>{handleUpdateOrder(currentOrder?.id as string,'dispatched')}}>dispatched</DropdownMenuLabel>
                      <DropdownMenuLabel className="cursor-pointer" onClick={()=>{handleUpdateOrder(currentOrder?.id as string,'delivered')}}>delivered</DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </p>
                <p><strong>Delivery Time:</strong> ASAP</p>
                <p><strong>Payment Type:</strong> Cash on delivery</p>
                <p><strong>Payment Channel:</strong> COD</p>
                <p><strong>Payment Verified Status:</strong> <Badge variant="default" className="ml-1">COD</Badge></p>
                {/* <p><strong>Device Type:</strong> {order.deviceType ?? 'N/A'}</p>
                <p><strong>App Version:</strong> {order.appVersion ?? 'N/A'}</p> */}
              </div>
            </div>
          </div>

          {/* Items section - Responsive design */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">Items Detail</h3>

            {/* Mobile view (cards) */}
            <div className="md:hidden space-y-3">
              {(currentOrder?.items ?? []).map((item, idx) => renderItemCard(item, idx))}
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
                  {(currentOrder?.items ?? []).map((item, idx) => (
                    <tr key={item.id ?? idx}>
                      <td className="border p-2">{item.id ?? 'N/A'}</td>
                      <td className="border p-2 max-w-xs truncate">{item.product.title ?? 'N/A'}</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2">{item.quantity ?? 0}</td>
                      <td className="border p-2">{( parseFloat(item.variant?.originalPrice || '0') ?? 0).toFixed(2)}</td>
                      {/* <td className="border p-2">{(item.variant?.discount ?? 0)}%</td> */}
                      <td className="border p-2">{( parseFloat(item.variant?.price || '0') ?? 0).toFixed(2)}</td>
                      <td className="border p-2">{(( parseFloat(item.variant?.price || '0') ?? 0) * (parseInt(item.quantity) ?? 0)).toFixed(2)}</td>
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
                <span className="text-right">PKR {(parseInt((currentOrder?.total || '0')) ?? 14).toFixed(2)}</span>
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
                <span className="text-right">PKR {(parseInt((currentOrder?.total || '0')) ?? 14).toFixed(2)}</span>
              </div>
              <div>
                <strong>Delivery Note:</strong> {currentOrder?.orderNotice ?? ''}
              </div>
            </div>
          </div>

          {/* ETA update input - Responsive design */}
          {/* <div className="flex flex-wrap items-center gap-2">
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
          </div> */}

          {/* Action buttons - Responsive design */}
          {/* <div className="flex flex-wrap justify-end gap-2 pt-4">
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
              disabled={currentOrder?.status === "rejected"}
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
              disabled={currentOrder?.status === "accepted"}
            >
              <FaCheck className="h-3 w-3" /> Accept
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FaPrint className="h-3 w-3" /> Print
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FaEdit className="h-3 w-3" /> Edit Order
            </Button>
          </div> */}
        </div>
 
      </div>
      </DialogContent>
    </Dialog>
  );
}