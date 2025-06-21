import { privateAPI } from '.';

export const authApi = privateAPI.injectEndpoints({
  endpoints: build => ({
    authorized: build.query({
      query: () => '/instagram/user-profile/',
      providesTags: ['FetchUserDetails'],
    }),
  }),
});

export const {
  useAuthorizedQuery,
  useLazyAuthorizedQuery,
} = authApi;
