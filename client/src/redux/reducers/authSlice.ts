import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  user: null,
  isAuthenticated: false,
  provider: null,
  session: null,
  error: null
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
      state.session = action.payload.session;
      state.isLoading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAuth, setLoading,setAuthError } = authSlice.actions;
export default authSlice.reducer;