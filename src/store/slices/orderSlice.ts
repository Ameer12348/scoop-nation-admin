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
  orderDetails: {
    data: Order | null;
    loading:boolean;
    error: null | string;
  },
  updateOrder: {
    loading: boolean,
    error: null | string,
  }
};

const initialState: OrdersState = {
  orders: [],
  pagination: null,
  loading: false,
  error: null,
  orderDetails:{
    data: null,
    loading: false,
    error: null,
  },
  updateOrder: {
    loading: false,
    error: null,
  }
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
export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (id :string | number , { rejectWithValue }) => {
    try {
      const { data} = await api.get<{ success:boolean, data:Order,error?:string}>(`/api/admin/orders-details?id=${id}`);
      if (!data.success) {
          return rejectWithValue(data?.error || 'Failed to fetch order details');
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (params:{orderId:string|number,status:string} , { rejectWithValue ,dispatch}) => {
    try {
      const { data } = await api.post<{ success:boolean, data:Order,error?:string}>(`/api/admin/update-order`,params);
      if (!data.success) {
          return rejectWithValue(data?.error || 'Failed to update order');
      }
      dispatch(fetchOrderDetails(params.orderId));
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order');
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
    // -------------------------- fetch orders -----------------------------
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
      // -------------------------- fetch order details -----------------------------
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.orderDetails.loading = true;
        state.orderDetails.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action: PayloadAction<Order>) => {
        state.orderDetails.loading = false;
        state.orderDetails.data = action.payload;
        state.orderDetails.error = null;
        state.orders = state.orders.map(order => order.id === action.payload.id ? action.payload : order);
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.orderDetails.loading = false;
        state.orderDetails.error = action.payload as string;
      });
      // ----------------------------------------- update order -------------------------------
      builder
      .addCase(updateOrder.pending, (state) => {
        state.updateOrder.loading = true;
        state.updateOrder.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, ) => {
        state.updateOrder.loading = false;
        state.updateOrder.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.updateOrder.loading = false;
        state.updateOrder.error = action.payload as string;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;