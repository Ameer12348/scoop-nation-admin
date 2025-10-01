import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/api'
import { toast } from 'sonner'

// Define types for API responses and requests
interface User {
  id: string
  email: string
  role: string
  phone_verified: string
  email_verified: string
  phone: string
  user_created: string
  customer_id: string
  fullname: string
  gender: string | null
  date_of_birth: string | null
}

interface UpdateProfileRequest {
  fullname: string
  phone: string
  date_of_birth?: string
  gender?: string
}

interface UpdateProfileResponse {
  success: boolean
  message?: string
  user?: User
  error?: string
}

interface LoginResponse {
  success: boolean
  token: string
  user: User
  error?: string
}

interface RegisterResponse {
  success: boolean
  message: string
  user_id: string
  error?: string
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  fullname: string
  phone: string
}

interface AuthState {
  showAuthDialog: boolean
  authTab: 'login' | 'register' | 'otp' | 'forgotEmail' | 'updateEmail'  | 'forgotPassword'
  isLoggedIn: boolean
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}



// Create async thunks for API calls

// ----------------- register async thunk ---------------------
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: { error: string } }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/users/register-customer', userData)
    return response.data
  } catch (error: unknown) {
    const err = error as { response?: { data: { error: string } } };
    if (err.response && err.response.data) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue({ error: 'Registration failed. Please try again.' })
  }
})

// ----------------- login async thunk ---------------------
export const loginAdmin = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: { error: string } }
>('auth/loginAdmin', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/users/login-admin', credentials)
    // Store token in localStorage for persistence
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  } catch (error: unknown) {
    const err = error as { response?: { data: { error: string } } };
    if (err.response && err.response.data) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue({ error: 'Login failed. Please try again.' })
  }
})

// ----------------- updateProfile async thunk ---------------------
export const updateProfile = createAsyncThunk<
  UpdateProfileResponse,
  UpdateProfileRequest,
  { rejectValue: { error: string } }
>('auth/updateProfile', async (profileData, { rejectWithValue, getState }) => {
  try {
    const response = await api.put('/api/users/profile', profileData)
    
    // Update user in localStorage if successful
    if (response.data.success && response.data.user) {
      const user = localStorage.getItem('user')
      if (user) {
        const updatedUser = { ...JSON.parse(user), ...response.data.user }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
    
    return response.data
  } catch (error: unknown) {
    const err = error as { response?: { data: { error: string } } };
    if (err.response && err.response.data) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue({ error: 'Profile update failed. Please try again.' })
  }
})

// ------------------ forgot pass async thunk ---------------------
export const forgotPassword = createAsyncThunk<
  { success: boolean; message?: string; error?: string },
  { email: string },
  { rejectValue: { error: string } }
>('auth/forgotPassword', async (emailData, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/users/forgot-password', emailData)
    return response.data
  } catch (error: unknown) {
    const err = error as { response?: { data: { error: string } } };
    if (err.response && err.response.data) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue({ error: 'Password reset failed. Please try again.' })
  }
})



// -------------------  initial state ---------------------

const initialState: AuthState = {
  showAuthDialog: false,
  authTab: 'login',
  isLoggedIn: false,
  user: null,
  token: null,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setShowAuthDialog(state, action: PayloadAction<boolean>) {
      state.showAuthDialog = action.payload
    },
    setAuthTab(state, action: PayloadAction<AuthState['authTab']>) {
      state.authTab = action.payload
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload
    },
    logout(state) {
      state.isLoggedIn = false
      state.user = null
      state.token = null
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError(state) {
      state.error = null
    },
    // set auth if exist in localStorage
    setAuthFromStorage(state) {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        state.isLoggedIn = true
        state.token = token
        state.user = JSON.parse(user)
      }
    },
  },
  extraReducers: (builder) => {
    // Handle register user
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.success) {
        toast.success('Registration successful! Please login to continue.')
        state.authTab = 'login' // Redirect to login after successful registration
      }
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload?.error || 'Registration failed'
      toast.error(action.payload?.error || 'Registration failed. Please try again.')
    })

    // Handle login user
    builder.addCase(loginAdmin.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.success) {
        state.isLoggedIn = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.showAuthDialog = false // Close dialog after successful login
        toast.success('Login successful! Welcome back.')
      }
    })
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload?.error || 'Login failed'
      toast.error(action.payload?.error || 'Login failed. Please try again.')
    })

    // Handle forgot password
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.success) {
        toast.success(action.payload.message || 'Password reset email sent!')
      }
      state.authTab ='otp';
    })
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload?.error || 'Password reset failed'
      toast.error(action.payload?.error || 'Password reset failed. Please try again.')
    })

    // Handle update profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false
      console.log(action.payload);
      
      if (action.payload.success && action.payload.user) {
        state.user = action.payload.user
        toast.success(action.payload.message || 'Profile updated successfully!')
      }
    })
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload?.error || 'Profile update failed'
      toast.error(action.payload?.error || 'Profile update failed. Please try again.')
    })
  }
})

export const { setShowAuthDialog, setAuthTab, setIsLoggedIn, logout, clearError, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
