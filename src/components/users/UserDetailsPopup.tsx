
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt, FaWhatsapp, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer } from "@/store/slices/customerSlice";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { useCustomers } from "@/store/hooks";

interface UserDetailsPopupProps {
    userId:number|string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loading?: boolean;
}
const UserDetailsSkeleton = () => {
    return (
        <>
            <div className="space-y-6">
                {/* Profile Information Skeleton */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <Skeleton className="h-6 w-48 mb-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-16" />
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-16" />
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                </div>

                {/* Additional Information Skeleton */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <Skeleton className="h-6 w-48 mb-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>

                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const UserDetailsPopup = ({ userId, open, onOpenChange, loading }: UserDetailsPopupProps) => {
    const {fetchCustomerDetails,customerDetails,detailsLoading,detailsError} = useCustomers()
    useEffect(()=>{
        if (open) {
        fetchCustomerDetails(userId)
        }
    },[open])

    const [activeTab, setActiveTab] = useState("details");
  


    

    if (detailsLoading) return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[98vw] min-w-[98vw] md:min-w-[90vw] md:w-[90vw] xl:min-w-[1100px] xl:w-[1100px]  max-h-[90vh] overflow-y-auto">
            <UserDetailsSkeleton />
        </DialogContent>
    </Dialog>;

    if (detailsError) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-[98vw] min-w-[98vw] md:min-w-[90vw] md:w-[90vw] xl:min-w-[1100px] xl:w-[1100px]  max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <FaExclamationCircle className="text-red-500" /> Error {detailsError}
                        </DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[98vw] min-w-[98vw] md:min-w-[90vw] md:w-[90vw] xl:min-w-[1100px] xl:w-[1100px]  max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <FaUser className="text-primary" /> Customer Details
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="details">User Information</TabsTrigger>
                        <TabsTrigger value="orders">Order History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        {/* User Profile Section */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Profile Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FaUser className="text-gray-500" />
                                        <span className="font-medium">Full Name:</span>
                                        <span>{customerDetails?.fullname || 'N/A'}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaPhone className="text-gray-500" />
                                        <span className="font-medium">Phone:</span>
                                        <div className="flex items-center gap-1">
                                            <FaWhatsapp className="text-green-500" />
                                            {/* <span>{customerDetails?.phone   || 'N/A'}</span> */}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-gray-500" />
                                        <span className="font-medium">Email:</span>
                                        <a href={`mailto:${customerDetails?.user_email || ''}`} className="text-blue-600 hover:underline">
                                            {customerDetails?.user_email || 'N/A'}
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-500" />
                                        <span className="font-medium">First Order:</span>
                                        <span>{customerDetails?.first_order_date ? format(customerDetails?.first_order_date, "dd MMM yyyy") : 'N/A'}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-500" />
                                        <span className="font-medium">Last Order:</span>
                                        <span>{customerDetails?.last_order_date ? format(customerDetails?.last_order_date, "dd MMM yyyy") : 'N/A'}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaMoneyBillWave className="text-gray-500" />
                                        <span className="font-medium">Total Revenue:</span>
                                        <span className="font-semibold text-green-600">
                                            PKR {(parseFloat(customerDetails?.total_spent || '0') || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="text-sm font-medium text-blue-700">Total Orders</h4>
                                <p className="text-2xl font-bold">{customerDetails?.total_orders || 0}</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <h4 className="text-sm font-medium text-green-700">Total Spent</h4>
                                <p className="text-2xl font-bold">PKR {(parseFloat(customerDetails?.total_spent || '0') || 0).toFixed(2)}</p>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <h4 className="text-sm font-medium text-purple-700">Customer Since</h4>
                                <p className="text-2xl font-bold">{customerDetails?.first_order_date ? format(customerDetails?.first_order_date, "MMM yyyy") : 'N/A'}</p>
                            </div>
                        </div>

                        {/* Additional Information */}
                        {/* <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Additional Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Blacklisted:</span>
                                        <Badge variant={customerDetails?.blacklisted ? "destructive" : "default"}>
                      {customerDetails?.blacklisted ? "Yes" : "No"}
                    </Badge>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Social Platform:</span>
                                        <Badge variant="secondary">
                                            {customerDetails?.social_platform || 'Local Signup'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-500" />
                                        <span className="font-medium">Most Ordered From:</span>
                                        <span>{customerDetails?.most_ordered_branch || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Order History</h3>

                            {customerDetails?.recent_orders && customerDetails?.recent_orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border">Order ID</th>
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Amount</th>
                        <th className="px-4 py-2 border">Status</th>
                        {/* <th className="px-4 py-2 border">Items</th>
                        <th className="px-4 py-2 border">Branch</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {customerDetails?.recent_orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border">{order.id}</td>
                          <td className="px-4 py-2 border">{format(new Date(order.dateTime), "dd MMM yyyy HH:mm")}</td>
                          <td className="px-4 py-2 border">PKR {parseFloat(order.total).toFixed(2)}</td>
                          <td className="px-4 py-2 border">
                            <Badge 
                              
                            >
                              {order.status}
                            </Badge>
                          </td>
                          {/* <td className="px-4 py-2 border">{order.items_count}</td>
                          <td className="px-4 py-2 border">{order.branch}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No order history available</p>
                </div>
              )}
                        </div>

                        {/* Order Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="text-sm font-medium text-blue-700">Most Ordered Item</h4>
                                <p className="text-lg font-bold">{customerDetails?.most_ordered_item || 'N/A'}</p>
                            </div> */}

                            {/* <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                <h4 className="text-sm font-medium text-amber-700">Favorite Branch</h4>
                                <p className="text-lg font-bold">{customerDetails?.most_ordered_branch || 'N/A'}</p>
                            </div> */}

                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <h4 className="text-sm font-medium text-indigo-700">Average Order Value</h4>
                                <p className="text-lg font-bold">
                                    PKR {' '}
                                    {customerDetails?.total_orders && parseFloat(customerDetails?.total_spent) 
                    ? (parseFloat(customerDetails?.total_spent) / parseInt( customerDetails?.total_orders)).toFixed(2) 
                    : '0.00'}
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsPopup;