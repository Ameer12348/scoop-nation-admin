import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';

// Infer the `RootState` and `AppDispatch` types from the store itself
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Infer types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;