import { privateAPI } from './private';
import { publicAPI } from './public';

export const serviceReducers = {
  [publicAPI.reducerPath]: publicAPI.reducer,
  [privateAPI.reducerPath]: privateAPI.reducer,
};

export const serviceMiddlewares = [publicAPI.middleware, privateAPI.middleware];
