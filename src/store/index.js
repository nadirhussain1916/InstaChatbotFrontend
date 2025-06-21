import { configureStore } from '@reduxjs/toolkit';
import { serviceMiddlewares, serviceReducers } from '@services';
import authSlice from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    ...serviceReducers,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(serviceMiddlewares),
});

export default store;
