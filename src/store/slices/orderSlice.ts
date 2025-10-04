import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

// Define types based on the API response
export interface Product {
  id: string;
  slug: string;
  title: string;
  mainImage: string;
  price: string;
  discountType: string | null;
  discountValue: string | null;
  originalPrice: string | null;
  discountStartDate: string | null;
  discountEndDate: string | null;
  rating: string;
  description: string;
  manufacturer: string;
  inStock: string;
  categoryId: string;
}

export interface Variant {
  id: string;
  productId: string;
  name: string;
  value: string;
  price: string;
  discountType: string | null;
  discountValue: string | null;
  originalPrice: string | null;
  discountStartDate: string | null;
  discountEndDate: string | null;
  inStock: string;
}

export interface OrderItem {
  id: string;
  customerOrderId: string;
  productId: string;
  variantId: string | null;
  bundleId: string | null;
  quantity: string;
  product: Product;
  variant: Variant | null;
}

export interface Order {
  id: string;
  customer_id: string;
  branch_id: string;
  rider_id: string;
  dateTime: string;
  status: string;
  total: string;
  orderNotice: string | null;
  order_number: string;
  address_id: string;
  fullname: string;
  items: OrderItem[];
}

export interface Pagination {
  total: string;
  per_page: number;
  page: number;
  total_pages: number;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: Pagination;
}

interface OrdersState {
  orders: Order[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  pagination: null,
  loading: false,
  error: null,
};

// Define the query parameters interface
interface FetchOrdersParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Create async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: FetchOrdersParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<OrdersResponse>('/api/admin/orders', {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OrdersResponse>) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;