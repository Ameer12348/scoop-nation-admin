import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import api from '@/lib/api';

// Define Customer type based on API response
export interface Customer {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  gender: string | null;
  date_of_birth: string | null;
  customer_since: string;
  user_role: string;
  user_created_at: string;
  total_orders: string;
  total_revenue: string;
  first_ordered_at: string | null;
  last_ordered_at: string | null;
  customer_type: string;
}

// Define pagination type
export interface Pagination {
  total: string;
  page: number;
  per_page: number;
  total_pages: number;
}

// Define query parameters for fetching customers
export interface CustomerQueryParams {
  search?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  min_orders?: string;
  max_orders?: string;
  min_revenue?: string;
  max_revenue?: string;
  date_from?: string;
  date_to?: string;
  customer_type?: string;
  sort_field?: string;
  sort_direction?: 'ASC' | 'DESC';
  page?: number;
  per_page?: number;
}

// Define customer state
interface CustomerState {
  customers: Customer[];
  pagination: Pagination | null;
  filters: any[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CustomerState = {
  customers: [],
  pagination: null,
  filters: [],
  loading: false,
  error: null,
};

// Create async thunk for fetching customers
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params: CustomerQueryParams = {}, { rejectWithValue }) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/api/admin/customers${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

// Create customer slice
const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<{ data: Customer[], pagination: Pagination, filters: any[] }>) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.pagination = action.payload.pagination;
        state.filters = action.payload.filters;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch customers';
      });
  },
});

// Export actions
export const { clearCustomerError } = customerSlice.actions;

// Export selectors
export const selectCustomers = (state: RootState) => state.customers.customers;
export const selectCustomersPagination = (state: RootState) => state.customers.pagination;
export const selectCustomersLoading = (state: RootState) => state.customers.loading;
export const selectCustomersError = (state: RootState) => state.customers.error;
export const selectCustomersFilters = (state: RootState) => state.customers.filters;

// Export reducer
export default customerSlice.reducer;