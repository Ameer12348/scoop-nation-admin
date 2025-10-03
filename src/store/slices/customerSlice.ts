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

// Define CustomerDetails type based on API response
export interface RecentOrder {
  id: string;
  order_number: string;
  dateTime: string;
  status: string;
  total: string;
  branch_name: string;
}

export interface CustomerDetails {
  id: string;
  user_id: string;
  fullname: string;
  createdAt: string;
  updatedAt: string;
  gender: string | null;
  date_of_birth: string | null;
  user_email: string;
  user_role: string;
  phone_verified: string;
  email_verified: string;
  user_created_at: string;
  total_orders: string;
  total_spent: string;
  first_order_date: string;
  last_order_date: string;
  average_order_value: string;
  recent_orders: RecentOrder[];
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
  customerDetails: CustomerDetails | null;
  pagination: Pagination | null;
  filters: any[];
  loading: boolean;
  detailsLoading: boolean;
  error: string | null;
  detailsError: string | null;
}

// Initial state
const initialState: CustomerState = {
  customers: [],
  customerDetails: null,
  pagination: null,
  filters: [],
  loading: false,
  detailsLoading: false,
  error: null,
  detailsError: null,
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

// Create async thunk for fetching customer details
export const fetchCustomerDetails = createAsyncThunk(
  'customers/fetchCustomerDetails',
  async (customerId: string | number, { rejectWithValue }) => {
    try {
      const url = `/api/admin/customer-details?customer_id=${customerId}`;
      const response = await api.get(url);
      
      if (!response.data.success) {
        return rejectWithValue(response.data.error || 'Failed to fetch customer details');
      }
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch customer details');
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
    clearCustomerDetailsError: (state) => {
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers cases
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
      })
      
      // Fetch customer details cases
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.detailsLoading = true;
        state.customerDetails = null;
        state.detailsError = null;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action: PayloadAction<CustomerDetails>) => {
        state.detailsLoading = false;
        state.detailsError = null;
        state.customerDetails = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload as string || 'Failed to fetch customer details';
        state.customerDetails = null;
      });
  },
});

// Export actions
export const { clearCustomerError, clearCustomerDetailsError } = customerSlice.actions;

// Export selectors
export const selectCustomers = (state: RootState) => state.customers.customers;
export const selectCustomersPagination = (state: RootState) => state.customers.pagination;
export const selectCustomersLoading = (state: RootState) => state.customers.loading;
export const selectCustomersError = (state: RootState) => state.customers.error;
export const selectCustomersFilters = (state: RootState) => state.customers.filters;
export const selectCustomerDetails = (state: RootState) => state.customers.customerDetails;
export const selectCustomerDetailsLoading = (state: RootState) => state.customers.detailsLoading;
export const selectCustomerDetailsError = (state: RootState) => state.customers.detailsError;

// Export reducer
export default customerSlice.reducer;