import { createSlice } from '@reduxjs/toolkit';
import { SIGN_UP, SIGN_IN, GOOGLE_SIGN_IN } from '../actions/authActions';


const initialState = {
  user: null,
  isAuthenticated: false,
  provider: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.user;
      state.provider = action.payload.provider;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
});


export const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SIGN_UP:
    case SIGN_IN:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        provider: action.payload.provider,
      };
    case GOOGLE_SIGN_IN:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        provider: action.payload.provider,
      };

    default:
      return state;
  }
};


export const { setAuth, setUser } = authSlice.actions;
export default authSlice.reducer;