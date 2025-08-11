import { privateAPI } from '.';

export const authApi = privateAPI.injectEndpoints({
  endpoints: build => ({
    getPrompts: build.query({
        query: () => ({
          url: 'prompts/',
          method: 'GET',
        }),
        providesTags: ['Prompts'],
      }),
      updatePrompts: build.mutation({
        query: body => ({
          url: `prompts/${body.id}/`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['Prompts'],
      }),
  }),
});
export const {
   useGetPromptsQuery,
    useUpdatePromptsMutation,
} = authApi;