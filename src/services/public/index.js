import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@utilities/constants';

// eslint-disable-next-line import/prefer-default-export
export const publicAPI = createApi({
  reducerPath: 'publicAPI',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: () => ({}),
});
