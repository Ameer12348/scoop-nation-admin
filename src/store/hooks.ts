'use client';
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'
import { setShowAuthDialog, setAuthTab, setIsLoggedIn, logout, clearError, loginAdmin, registerUser, setAuthFromStorage } from './slices/authSlice'
import { fetchBanners, fetchBannerById, updateBanner, createBanner, clearBannerError, selectBanners, selectCurrentBanner, selectBannersLoading, selectBannersError, selectCreateBanner } from './slices/bannerSlice'
import { fetchCustomers, clearCustomerError, selectCustomers, selectCustomersPagination, selectCustomersLoading, selectCustomersError, selectCustomersFilters, CustomerQueryParams, fetchCustomerDetails, selectCustomerDetails, selectCustomerDetailsLoading, selectCustomerDetailsError } from './slices/customerSlice'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useBanners = () => {
  const banners = useAppSelector(selectBanners);
  const currentBanner = useAppSelector(selectCurrentBanner);
  const createBannerState = useAppSelector(selectCreateBanner);
  const loading = useAppSelector(selectBannersLoading);
  const error = useAppSelector(selectBannersError);
  const dispatch = useAppDispatch();
  
  return {
    // State
    banners,
    currentBanner,
    createBanner: createBannerState,
    loading,
    error,
    
    // Actions
    fetchBanners: (params:{ page?: number, limit?: number, search?: string }) => dispatch(fetchBanners(params)),
    fetchBannerById: (id: string) => dispatch(fetchBannerById(id)),
    updateBannerAction: (bannerData: { id: number, name: string, description: string, start_date: string, end_date: string, is_active: boolean }) => 
      dispatch(updateBanner(bannerData)),
    createBannerAction: (bannerData: { name: string, description: string, start_date: string, end_date: string, is_active: boolean }) => 
      dispatch(createBanner(bannerData)),
    clearError: () => dispatch(clearBannerError()),
  };
}

export const useCustomers = () => {
  const customers = useAppSelector(selectCustomers);
  const pagination = useAppSelector(selectCustomersPagination);
  const loading = useAppSelector(selectCustomersLoading);
  const error = useAppSelector(selectCustomersError);
  const filters = useAppSelector(selectCustomersFilters);
  const dispatch = useAppDispatch();
  const customerDetails = useAppSelector(selectCustomerDetails);
  const detailsLoading = useAppSelector(selectCustomerDetailsLoading);
  const detailsError = useAppSelector(selectCustomerDetailsError)
  
  return {
    // State
    customers,
    pagination,
    loading,
    error,
    filters,
    customerDetails,
    detailsLoading,
    detailsError,
    
    // Actions
    fetchCustomers: (params: CustomerQueryParams = {}) => dispatch(fetchCustomers(params)),
    fetchCustomerDetails: (id: string | number) => dispatch(fetchCustomerDetails(id)),
    clearError: () => dispatch(clearCustomerError()),
  };
}

export const useAuth = () =>{
    const showAuthDialog = useAppSelector(state => state.auth.showAuthDialog)
    const authTab = useAppSelector(state => state.auth.authTab)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const user = useAppSelector(state => state.auth.user)
    const token = useAppSelector(state => state.auth.token)
    const loading = useAppSelector(state => state.auth.loading)
    const error = useAppSelector(state => state.auth.error)
    const dispatch = useAppDispatch()
    
    return { 
        // State
        showAuthDialog, 
        authTab, 
        isLoggedIn,
        user,
        token,
        loading,
        error,
        
        // Actions
        setShowAuthDialog: (value: boolean) => dispatch(setShowAuthDialog(value)), 
        setAuthTab: (value: 'login' | 'register' | 'otp' | 'forgotEmail' | 'updateEmail' | 'forgotPassword') => dispatch(setAuthTab(value)),
        setIsLoggedIn: (value: boolean) => dispatch(setIsLoggedIn(value)),
        logout: () => dispatch(logout()),
        clearError: () => dispatch(clearError()),
        setAuthFromStorage: () => dispatch(setAuthFromStorage()),
        
        // API Thunks
        login: (credentials: { email: string, password: string }) => dispatch(loginAdmin(credentials)),
        register: (userData: { email: string, password: string, fullname: string, phone: string }) => dispatch(registerUser(userData))
    }
}