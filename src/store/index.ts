import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice'
import bannerReducer from './slices/bannerSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
