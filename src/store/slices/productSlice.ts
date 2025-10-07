
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import api from '@/lib/api';
import { Media } from './bannerSlice';
import { toast } from 'sonner';






// Define Variant type
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

// Define Product type
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
  variants: Variant[];
  media: Media[];
}

// Payload for creating a product
export interface CreateProductPayload {
  slug: string;
  title: string;
  mainImage: File | string;
  price: string;
  discountType: string | null;
  discountValue: string | null;
  originalPrice: string | null;
  discountStartDate: string | null;
  discountEndDate: string | null;
  rating: string | undefined;
  description: string;
  manufacturer: string;
  inStock: string;
  categoryId: string;
  variants: Variant[];
  media: (any )[];
}

// Define pagination type
export interface Pagination {
  limit: number;
  page: number;
  total: string;
  total_pages: number;
}

// Define query parameters for fetching products
export interface ProductQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

// Define product state
interface ProductState {
  products: Product[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  createProduct:{
    loading: boolean,
    error: null | string,
    data?: Product | null,
  }
}

// Initial state
const initialState: ProductState = {
  products: [],
  pagination: null,
  loading: false,
  error: null,
  createProduct:{
    loading: false,
    error: null,
    data: null,
  }
};

// Create async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductQueryParams = {}, { rejectWithValue }) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/api/admin/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      
      if (!response.data.success) {
        return rejectWithValue(response.data.error || 'Failed to fetch products');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);




// Async thunk for creating a product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: CreateProductPayload, { rejectWithValue }) => {
    try {
      console.log('productData', productData);
      const formData = new FormData();
      // Append all fields to formData
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'variants') {
          formData.append('variants', JSON.stringify(value));
        } else if (key === 'media') {
          // media can be array of File or string
          (value as (File | string)[]).forEach((item) => {
            formData.append('media[]', item);
          });
        } else if (key === 'mainImage') {
          formData.append('mainImage', value as any);
        } else {
          if (value !== undefined && value !== null) {
            formData.append(key, value as any);
          }
        }
      });
      const response = await api.post('/api/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create product');
      }
      toast.success('Product created successfully');
      return response.data.data;
    } catch (error: any) {
      console.log('error', error);
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create product';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Create product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products cases
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ data: Product[], pagination: Pagination }>) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch products';
      })
      // Create product cases
      .addCase(createProduct.pending, (state) => {
        state.createProduct.loading = true;
        state.createProduct.error = null;
        state.createProduct.data = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.createProduct.loading = false;
        state.createProduct.data = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createProduct.loading = false;
        state.createProduct.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearProductError } = productSlice.actions;

// Export selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductsPagination = (state: RootState) => state.products.pagination;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;

// Export reducer
export default productSlice.reducer;


