import { configureStore } from '@reduxjs/toolkit';
import { serviceMiddlewares, serviceReducers } from '@services';
import authSlice from './slices/authSlice';
import chatSlice from './slices/chatSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
    ...serviceReducers,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(serviceMiddlewares),
});

export default store;
