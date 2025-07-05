import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onLoggedIn: (state, action) => {
      const userDetails = { ...action.payload };
      delete userDetails.access;

      // Move side-effect outside reducer
      if (action.payload.access) {
        localStorage.setItem('token', action.payload.access);
      }

      state.isAuthenticated = true;
      state.user = userDetails;
    },

    getUserDetail: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    updateUserDetail: (state, action) => {
      state.isAuthenticated = true;
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    onLoggedOut: () => {
      localStorage.removeItem('token');
      return { ...initialState };

    },
  },
});

export const {
  onLoggedIn,
  getUserDetail,
  onLoggedOut,
  updateUserDetail,
} = authSlice.actions;
export default authSlice.reducer;
