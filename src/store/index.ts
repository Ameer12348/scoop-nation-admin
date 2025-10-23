import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice'
import bannerReducer from './slices/bannerSlice'
import customerReducer from './slices/customerSlice'
import orderReducer from './slices/orderSlice'
import productReducer from './slices/productSlice'
import emailTemplateReducer from './slices/emailTemplateSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
    customers: customerReducer,
    orders: orderReducer,
    products: productReducer,
    emailTemplates: emailTemplateReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
