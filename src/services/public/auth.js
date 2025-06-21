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
  }),
});

export const { useLoginMutation } = authAPI;
