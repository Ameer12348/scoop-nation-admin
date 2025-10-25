import api from './api';

export interface DateRange {
  start?: string;
  end?: string;
  preset?: 'today' | 'this_week' | 'this_month' | 'last_30_days' | 'this_year' | 'custom';
}

export interface SalesSummary {
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  min_order_value: number;
  max_order_value: number;
}

export interface CustomerSummary {
  total_customers: number;
  total_users: number;
}

export interface OrderStatus {
  status: string;
  count: number;
  total_amount: number;
}

export interface TopProduct {
  id: number;
  title: string;
  mainImage: string;
  price: number;
  slug: string;
  category_name: string;
  total_quantity: number;
  order_count: number;
  total_revenue: number;
}

export interface RecentOrder {
  id: number;
  order_number: string;
  dateTime: string;
  status: string;
  total: number;
  orderNotice: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  branch_name: string;
  item_count: number;
}

export interface RevenueComparison {
  current: SalesSummary;
  previous: SalesSummary;
  percentage_change: number;
  period_days: number;
}

export interface DashboardAnalytics {
  success: boolean;
  date_range: {
    start: string;
    end: string;
    preset: string;
  };
  sales: SalesSummary;
  customers: CustomerSummary;
  orders: {
    by_status: OrderStatus[];
  };
  comparison: RevenueComparison;
  top_products: TopProduct[];
  recent_orders: RecentOrder[];
}

export interface SalesAnalytics {
  success: boolean;
  date_range: {
    start: string;
    end: string;
  };
  sales_by_date: {
    total_orders: number;
    total_sales: number;
    average_order_value: number;
    order_date: string;
  }[];
}

export interface CustomerAnalytics {
  success: boolean;
  date_range: {
    start: string;
    end: string;
  };
  summary: CustomerSummary;
  registrations_by_date: {
    registration_date: string;
    new_customers: number;
    new_users: number;
  }[];
}

export interface CategorySales {
  category_id: number;
  category_name: string;
  category_image: string;
  items_sold: number;
  total_quantity: number;
  total_revenue: number;
}

/**
 * Get comprehensive dashboard analytics
 */
export const getDashboardAnalytics = async (
  dateRange: DateRange,
  branchId?: number
): Promise<DashboardAnalytics> => {
  const params: any = {};

  if (dateRange.preset && dateRange.preset !== 'custom') {
    params.preset = dateRange.preset;
  } else if (dateRange.start && dateRange.end) {
    params.start_date = dateRange.start;
    params.end_date = dateRange.end;
  }

  if (branchId) {
    params.branch_id = branchId;
  }

  const response = await api.get<DashboardAnalytics>('/dashboard', { params });
  return response.data;
};

/**
 * Get sales analytics with daily breakdown
 */
export const getSalesAnalytics = async (
  dateRange: DateRange,
  branchId?: number
): Promise<SalesAnalytics> => {
  const params: any = {};

  if (dateRange.preset && dateRange.preset !== 'custom') {
    params.preset = dateRange.preset;
  } else if (dateRange.start && dateRange.end) {
    params.start_date = dateRange.start;
    params.end_date = dateRange.end;
  }

  if (branchId) {
    params.branch_id = branchId;
  }

  const response = await api.get<SalesAnalytics>('/sales', { params });
  return response.data;
};

/**
 * Get customer registration analytics
 */
export const getCustomerAnalytics = async (
  dateRange: DateRange,
  branchId?: number
): Promise<CustomerAnalytics> => {
  const params: any = {};

  if (dateRange.preset && dateRange.preset !== 'custom') {
    params.preset = dateRange.preset;
  } else if (dateRange.start && dateRange.end) {
    params.start_date = dateRange.start;
    params.end_date = dateRange.end;
  }

  if (branchId) {
    params.branch_id = branchId;
  }

  const response = await api.get<CustomerAnalytics>('/customers', { params });
  return response.data;
};

/**
 * Get top products
 */
export const getTopProducts = async (
  dateRange: DateRange,
  branchId?: number,
  limit: number = 10
): Promise<{ success: boolean; date_range: any; top_products: TopProduct[] }> => {
  const params: any = { limit };

  if (dateRange.preset && dateRange.preset !== 'custom') {
    params.preset = dateRange.preset;
  } else if (dateRange.start && dateRange.end) {
    params.start_date = dateRange.start;
    params.end_date = dateRange.end;
  }

  if (branchId) {
    params.branch_id = branchId;
  }

  const response = await api.get('/top-products', { params });
  return response.data;
};

/**
 * Get recent orders
 */
export const getRecentOrders = async (
  dateRange: DateRange,
  branchId?: number,
  limit: number = 20
): Promise<{ success: boolean; date_range: any; orders: RecentOrder[] }> => {
  const params: any = { limit };

  if (dateRange.preset && dateRange.preset !== 'custom') {
    params.preset = dateRange.preset;
  } else if (dateRange.start && dateRange.end) {
    params.start_date = dateRange.start;
    params.end_date = dateRange.end;
  }

  if (branchId) {
    params.branch_id = branchId;
  }

  const response = await api.get('/recent-orders', { params });
  return response.data;
};

/**
 * Get sales by category
 */
export const getSalesByCategory = async (
  dateRange: DateRange,
  branchId?: number
): Promise<{ success: boolean; date_range: any; categories: CategorySales[] }> => {
  const params: any = {};

  if (dateRange.preset && dateRange.preset !== 'custom') {
    params.preset = dateRange.preset;
  } else if (dateRange.start && dateRange.end) {
    params.start_date = dateRange.start;
    params.end_date = dateRange.end;
  }

  if (branchId) {
    params.branch_id = branchId;
  }

  const response = await api.get('/sales-by-category', { params });
  return response.data;
};
