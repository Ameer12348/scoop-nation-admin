'use client';
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'
import { setShowAuthDialog, setAuthTab, setIsLoggedIn, logout, clearError, loginAdmin, registerUser, setAuthFromStorage } from './slices/authSlice'
import { fetchBanners, fetchBannerById, updateBanner, clearBannerError, selectBanners, selectCurrentBanner, selectBannersLoading, selectBannersError } from './slices/bannerSlice'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useBanners = () => {
  const banners = useAppSelector(selectBanners);
  const currentBanner = useAppSelector(selectCurrentBanner);
  const loading = useAppSelector(selectBannersLoading);
  const error = useAppSelector(selectBannersError);
  const dispatch = useAppDispatch();
  
  return {
    // State
    banners,
    currentBanner,
    loading,
    error,
    
    // Actions
    fetchBanners: () => dispatch(fetchBanners()),
    fetchBannerById: (id: string) => dispatch(fetchBannerById(id)),
    updateBanner: (bannerData: { id: number, name: string, description: string, start_date: string, end_date: string, is_active: boolean }) => 
      dispatch(updateBanner(bannerData)),
    clearError: () => dispatch(clearBannerError()),
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