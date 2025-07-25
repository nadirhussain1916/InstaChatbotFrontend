import { privateAPI } from '.';

export const authApi = privateAPI.injectEndpoints({
  endpoints: build => ({
    createChat: build.mutation({
        query: body => ({
          url: '/instagram/generate-carousel/',
          method: 'POST',
          body
        }),
        invalidatesTags:['getChat']
      }),
      getPreviousChat: build.query({
        query: () => ({
          url: '/instagram/chats/',
          method: 'GET',
        }),
        providesTags: ['ChatList', 'getChat'],
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
      deleteChat: build.mutation({
        query: id => ({
          url: `/instagram/chats/${id}/`,
          method: 'DELETE',
        }),
        invalidatesTags:['ChatList', 'ChatDetail'],
      }),
      UpdateChatTitle: build.mutation({
        query: body => ({
          url: '/instagram/update-thread-title/',
          method: 'PUT',
          body,
        }),
        invalidatesTags:['ChatList', 'ChatDetail'],
      }),
  }),
});
export const {
    useCreateChatMutation,
    useGetPreviousChatQuery,
    useLazyGetChatIdQuery,
    useGetChatDetailQuery,
    useDeleteChatMutation,
    useUpdateChatTitleMutation,

} = authApi;