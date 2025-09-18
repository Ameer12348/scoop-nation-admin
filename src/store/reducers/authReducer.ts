import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state type
interface CounterState {
}

const initialState: CounterState = {
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   
  },
});

export const {  } = authSlice.actions;
export default authSlice.reducer;