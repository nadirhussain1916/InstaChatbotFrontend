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
      getPreviousChat: build.query({
        query: () => ({
          url: '/instagram/chats/',
          method: 'GET',
        }),
      }),
      getChatId: build.query({
        query: () => ({
          url: '/instagram/chats/new/',
          method: 'GET',
        }),
      }),
      getChatDetail: build.query({
        query: id => ({
          url: `/instagram/chats/${id}/`,
          method: 'GET',
        }),
      }),
  }),
});
export const {
    useCreateChatMutation,
    useGetPreviousChatQuery,
    useLazyGetChatIdQuery,
    useGetChatDetailQuery,
} = authApi;