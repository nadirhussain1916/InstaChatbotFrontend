import { privateAPI } from '.';

export const authApi = privateAPI.injectEndpoints({
  endpoints: build => ({
    createChat: build.mutation({
        query: body => ({
          url: '/instagram/generate-carousel/',
          method: 'POST',
          body
        }),
      }),
  }),
});
export const {
    useCreateChatMutation,
} = authApi;