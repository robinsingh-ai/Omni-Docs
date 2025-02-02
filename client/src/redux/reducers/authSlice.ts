import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

const initialState = {
  isLoading: false,
  user: null,
  isAuthenticated: false,
  provider: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.provider = action.payload.provider;
      state.isLoading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
});

export const { setAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;