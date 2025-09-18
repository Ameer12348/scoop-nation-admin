import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state type
interface AuthState {
  user:null
}

const initialState: AuthState = {
  user:null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   
  },
});

export const {  } = authSlice.actions;
export default authSlice.reducer;