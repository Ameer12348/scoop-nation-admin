'use client';

import React from 'react';
import { RecentOrder } from '@/lib/analytics';
import { format } from 'date-fns';
import { Package, User, Mail, Phone, Loader } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateOrder } from '@/store/slices/orderSlice';

interface RecentOrdersTableProps {
  orders: RecentOrder[];
  isLoading?: boolean;
  onOrderUpdate?: (data: { orderId: number; status: string }) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  dispatched: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const statusMap: Record<string, string> = {
  pending: "Pending",
  rejected: "Rejected",
  accepted: "Accepted",
  dispatched: "Dispatched",
  delivered: "Delivered",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function RecentOrdersTable({ orders, isLoading, onOrderUpdate }: RecentOrdersTableProps) {
  const dispatch = useAppDispatch();
  const { loading: updateOrderLoading } = useAppSelector(x => x.orders.updateOrder);

  const handleUpdateOrder = async (orderId: string | number, status: string) => {
    const result = await dispatch(updateOrder({ orderId, status }));
    // If update was successful and callback provided, notify parent
    if (updateOrder.fulfilled.match(result) && onOrderUpdate) {
      onOrderUpdate({ orderId: Number(orderId), status });
    }
  };
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 dark:text-gray-400">
          No orders found for this period
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {order.order_number}
                </div>
                {order.branch_name && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {order.branch_name}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.customer_name}
                    </div>
                    {order.customer_email && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="w-3 h-3" />
                        {order.customer_email}
                      </div>
                    )}
                    {order.customer_phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="w-3 h-3" />
                        {order.customer_phone}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {format(new Date(order.dateTime), 'MMM dd, yyyy')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(order.dateTime), 'hh:mm a')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span
                      className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                        statusColors[order.status.toLowerCase()] ||
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {updateOrderLoading ? (
                        <Loader className="h-3 w-3 animate-spin" />
                      ) : (
                        statusMap[order.status.toLowerCase()] || order.status
                      )}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" 
                      onClick={() => handleUpdateOrder(order.id, 'pending')}
                    >
                      Pending
                    </DropdownMenuLabel>
                    <DropdownMenuLabel 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" 
                      onClick={() => handleUpdateOrder(order.id, 'rejected')}
                    >
                      Rejected
                    </DropdownMenuLabel>
                    <DropdownMenuLabel 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" 
                      onClick={() => handleUpdateOrder(order.id, 'accepted')}
                    >
                      Accepted
                    </DropdownMenuLabel>
                    <DropdownMenuLabel 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" 
                      onClick={() => handleUpdateOrder(order.id, 'dispatched')}
                    >
                      Dispatched
                    </DropdownMenuLabel>
                    <DropdownMenuLabel 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" 
                      onClick={() => handleUpdateOrder(order.id, 'delivered')}
                    >
                      Delivered
                    </DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {order.item_count}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                PKR {order.total.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
