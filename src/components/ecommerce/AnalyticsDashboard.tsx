'use client';

import React, { useState, useEffect } from 'react';
import { 
  getDashboardAnalytics, 
  getSalesAnalytics,
  DateRange, 
  DashboardAnalytics,
  SalesAnalytics
} from '@/lib/analytics';
import DateRangeSelector from '@/components/common/DateRangeSelector';
import StatsCard from '@/components/common/StatsCard';
import TopProductsList from '@/components/common/TopProductsList';
import RecentOrdersTable from '@/components/common/RecentOrdersTable';
import SalesChart from '@/components/charts/SalesChart';
import OrdersStatusChart from '@/components/charts/OrdersStatusChart';
import RevenueComparisonChart from '@/components/charts/RevenueComparisonChart';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  RefreshCw,
  BarChart3,
  PieChart
} from 'lucide-react';
import { toast } from 'sonner';

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({ preset: 'last_30_days' });
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [dashboardData, salesChartData] = await Promise.all([
        getDashboardAnalytics(dateRange),
        getSalesAnalytics(dateRange)
      ]);
      setAnalytics(dashboardData);
      setSalesData(salesChartData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSalesTrend = () => {
    if (!analytics?.comparison) return undefined;
    
    return {
      value: analytics.comparison.percentage_change,
      isPositive: analytics.comparison.percentage_change >= 0,
    };
  };

  function handleOrderUpdate(data: { orderId: number; status: string }) {
    const { orderId, status } = data;
    const updatedOrders = analytics?.recent_orders.map(order => {
      if (order.id == orderId) {
        return { ...order, status };
      }
      return order;
    });
    setAnalytics(prev => prev ? { ...prev, recent_orders: updatedOrders || [] } : null);
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your business performance and insights
          </p>
        </div>
        
        <button
          onClick={fetchAnalytics}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Date Range Selector */}
      <DateRangeSelector value={dateRange} onChange={setDateRange} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Sales"
          value={formatCurrency(analytics?.sales.total_sales || 0)}
          icon={<div className='font-semibold'>PKR</div>}
          trend={getSalesTrend()}
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
        
        <StatsCard
          title="Total Orders"
          value={(analytics?.sales.total_orders || 0).toLocaleString()}
          icon={<ShoppingCart className="w-6 h-6" />}
          subtitle={`Avg: ${formatCurrency(analytics?.sales.average_order_value || 0)}`}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        
        <StatsCard
          title="New Customers"
          value={(analytics?.customers.total_customers || 0).toLocaleString()}
          icon={<Users className="w-6 h-6" />}
          subtitle={`${analytics?.customers.total_users || 0} total users`}
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        
        <StatsCard
          title="Average Order"
          value={formatCurrency(analytics?.sales.average_order_value || 0)}
          icon={<TrendingUp className="w-6 h-6" />}
          subtitle={`Min: ${formatCurrency(analytics?.sales.min_order_value || 0)} | Max: ${formatCurrency(analytics?.sales.max_order_value || 0)}`}
          iconBgColor="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Trend
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Daily sales and order volume over time
            </p>
          </div>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <SalesChart 
          data={salesData?.sales_by_date || []} 
          isLoading={isLoading}
        />
      </div>

      {/* Charts Grid - Orders Status & Revenue Comparison */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Orders by Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Orders by Status
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Distribution of orders across different statuses
              </p>
            </div>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <OrdersStatusChart 
            data={analytics?.orders.by_status || []} 
            isLoading={isLoading}
            type="donut"
          />
        </div>

        {/* Revenue Comparison Chart */}
        {analytics?.comparison && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue Comparison
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Current vs previous period performance
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <RevenueComparisonChart
              currentRevenue={analytics.comparison.current.total_sales || 0}
              previousRevenue={analytics.comparison.previous.total_sales || 0}
              currentOrders={analytics.comparison.current.total_orders || 0}
              previousOrders={analytics.comparison.previous.total_orders || 0}
              percentageChange={analytics.comparison.percentage_change}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Products
            </h2>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <TopProductsList 
            products={analytics?.top_products || []} 
            isLoading={isLoading}
          />
        </div>

        {/* Order Status Breakdown Table */}
        {analytics?.orders.by_status && analytics.orders.by_status.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Status Details
            </h2>
            <div className="space-y-3">
              {analytics.orders.by_status.map((statusData) => (
                <div
                  key={statusData.status}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                      {statusData.status}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatCurrency(statusData.total_amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statusData.count}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Orders
        </h2>
        <RecentOrdersTable 
          orders={analytics?.recent_orders || []} 
          isLoading={isLoading}
          onOrderUpdate={handleOrderUpdate}
        />
      </div>
    </div>
  );
}
