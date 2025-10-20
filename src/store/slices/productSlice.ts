

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
  priority: string | number;
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
  productDetails: Product | null,
  detailsLoading:boolean,
  detailsError: string | null;
  createProduct:{
    loading: boolean,
    error: null | string,
    data?: Product | null,
  }
  deleteProduct:{
    loading: boolean,
  }
}

// Initial state
const initialState: ProductState = {
  products: [],
  pagination: null,
  loading: false,
  error: null,
  productDetails:null,
  detailsLoading:false,
  detailsError:null,
  createProduct:{
    loading: false,
    error: null,
    data: null,
  },
  deleteProduct:{
    loading: false,
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


// Create async thunk for fetching products
export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id: string | number ,{ rejectWithValue }) => {
    try {
      
      const url = `/api/admin/products/getById?productId=${id}`;
      
      const response = await api.get(url);
      
      if (!response.data.success) {
        return rejectWithValue(response.data.error || 'Failed to fetch products');
      }
      
      return response.data.data;
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
      // Validate required fields
      const requiredFields = ['title', 'description', 'price', 'categoryId'];
      const missingFields = requiredFields.filter((field) => !productData[field]);

      console.log(productData.media)

      if (missingFields.length > 0) {
        const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      // Validate media
      if (!productData.media) {
        const errorMessage = 'Media file is required.';
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      const formData = new FormData();
      // Append all fields to FormData
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'variants' && value && Array.isArray(value) && value.length > 0) {
          formData.append('variants', JSON.stringify(value));
        } else if (key === 'media' && value) {
          formData.append('media',productData.media[0]);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      // Log FormData for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`FormData: ${key} = ${value}`);
      }

      const response = await api.post('/api/admin/products', formData, {
          headers: {
            'Content-Type': undefined, // Let browser set multipart/form-data
          },
        });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create product');
      }

      toast.success('Product created successfully');
      return response.data.data;
    } catch (error: any) {
      console.log('error', error);
      const errorMessage =
        error.response?.data?.details?.join(', ') ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create product';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for deleting a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string | number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/admin/products/delete?productId=${productId}`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete product');
      }
      toast.success(response.data.message || 'Product deleted successfully');
      return productId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete product';
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
      // Fetch product details cases
      .addCase(fetchProductDetails.pending, (state) => {
        state.detailsLoading = true;
        state .productDetails = null;
        state.detailsError = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action: PayloadAction<Product>) => {
        state.detailsLoading = false;
        state.productDetails = action.payload;
        state.detailsError = null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.productDetails = null;
        state.detailsError = action.payload as string || 'Failed to fetch product details';
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
      })
      // Delete product cases
      .addCase(deleteProduct.pending, (state) => {
        state.deleteProduct.loading = true
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.deleteProduct.loading = false
        // Remove deleted product from products array if present
        state.products = state.products.filter((p) => p.id !== String(action.payload));
        state.pagination = state.pagination ? {
          ...state.pagination,
          total: String(Number(state.pagination.total) - 1),
        } : null;
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.deleteProduct.loading = false
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


