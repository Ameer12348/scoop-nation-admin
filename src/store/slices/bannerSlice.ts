import api from '@/lib/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';


export interface Media {
  imageID: string;
  type: string;
  title: string;
  description: string;
  alt_text: string;
  mime_type: string;
  file_size: string;
  width: string;
  height: string;
  is_featured: string;
  sort_order: string;
  productID: string;
  category_id: string | null;
  banner_position: string;
  banner_url: string | null;
  banner_target: string | null;
  campaign_id: string | null;
  status: string;
  created_by: string;
  updated_by: string;
  image: string;
  created_at: string;
}


export interface Banner {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: string;
  created_by: string;
  updated_by: string;
  branch_id: string;
  created_at: string;
  updated_at: string;
  media: Media[];
}

interface BannerState {
  banners: Banner[];
  currentBanner: {
    data:null | Banner,
    loading:boolean,
    error:null | string,
  };
  updateBanner:{
    loading:boolean,
    error:null | string,
  };
  createBanner:{
    loading:boolean,
    error:null | string,
    bannerId: string | null,
  };
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BannerState = {
  banners: [],
  currentBanner:{
    data:null,
    loading:false,
    error:null,
  },
  updateBanner:{
    loading:false,
    error:null,
  },
  createBanner:{
    loading:false,
    error:null,
    bannerId: null,
  },
  loading: false,
  error: null,
};

// Create async thunk for fetching banners
export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/banners');
      
      if (!response.data.success) {
        throw new Error('Failed to fetch banners');
      }
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Create async thunk for fetching a banner by ID
export const fetchBannerById = createAsyncThunk(
  'banners/fetchBannerById',
  async (campaignId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/banners/get?campaignId=${campaignId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch banner');
      }
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Interface for update banner payload
interface UpdateBannerPayload {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// Interface for create banner payload
interface CreateBannerPayload {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// Create async thunk for creating a banner
export const createBanner = createAsyncThunk(
  'banners/createBanner',
  async (bannerData: CreateBannerPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/banners/create', bannerData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create banner');
      }
      
      // Show success toast
      toast.success(response.data.message || 'Banner created successfully');
      
      return response.data.data; // Returns the new banner ID
    } catch (error) {
      // Show error toast
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Create async thunk for updating a banner
export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async (bannerData: UpdateBannerPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/banners/update', bannerData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update banner');
      }
      
      // Show success toast
      toast.success(response.data.message || 'Banner updated successfully');
      
      return response.data;
    } catch (error) {
      // Show error toast
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Create the banner slice
const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    clearBannerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchBanners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action: PayloadAction<Banner[]>) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchBannerById
      .addCase(fetchBannerById.pending, (state) => {
        state.currentBanner.loading = true;
        state.currentBanner.error = null;
      })
      .addCase(fetchBannerById.fulfilled, (state, action: PayloadAction<Banner>) => {
        state.currentBanner.loading = false;
        state.currentBanner.data = action.payload;
      })
      .addCase(fetchBannerById.rejected, (state, action) => {
        state.currentBanner.loading = false;
        state.currentBanner.error = action.payload as string;
        state.currentBanner.data = null;
      })
      
      // Handle updateBanner
      .addCase(updateBanner.pending, (state) => {
        state.updateBanner.loading = true;
        state.updateBanner.error = null;
      })
      .addCase(updateBanner.fulfilled, (state) => {
        state.updateBanner.loading = false;
        state.updateBanner.error = null;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.updateBanner.loading = false;
        state.updateBanner.error = action.payload as string;
      })
      
      // Handle createBanner
      .addCase(createBanner.pending, (state) => {
        state.createBanner.loading = true;
        state.createBanner.error = null;
        state.createBanner.bannerId = null;
      })
      .addCase(createBanner.fulfilled, (state, action: PayloadAction<string>) => {
        state.createBanner.loading = false;
        state.createBanner.bannerId = action.payload;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.createBanner.loading = false;
        state.createBanner.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearBannerError } = bannerSlice.actions;
export default bannerSlice.reducer;

// Selectors
export const selectBanners = (state: { banners: BannerState }) => state.banners.banners;
export const selectCurrentBanner = (state: { banners: BannerState }) => state.banners.currentBanner;
export const selectBannersLoading = (state: { banners: BannerState }) => state.banners.loading;
export const selectBannersError = (state: { banners: BannerState }) => state.banners.error;
export const selectCreateBanner = (state: { banners: BannerState }) => state.banners.createBanner;