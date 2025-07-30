import { publicAPI } from '.';

export const authAPI = publicAPI.injectEndpoints({
  endpoints: build => ({
    login: build.mutation({
      query: body => ({
        url: 'instagram/signin-user/',
        method: 'POST',
        body,
      }),
    }),
     changePassword: build.mutation({
      query: body => ({
        url: 'instagram/change-password/',
        method: 'POST',
        body,
      }),
    }),
    Signup: build.mutation({
      query: body => ({
        url: 'instagram/signup-user/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useChangePasswordMutation, } = authAPI;
