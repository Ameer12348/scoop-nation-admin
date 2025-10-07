import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice'
import bannerReducer from './slices/bannerSlice'
import customerReducer from './slices/customerSlice'
import orderReducer from './slices/orderSlice'
import productReducer from './slices/productSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
    customers: customerReducer,
    orders: orderReducer,
    products: productReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
