import { privateAPI } from '.';

export const authApi = privateAPI.injectEndpoints({
  endpoints: build => ({
    getUserPost: build.query({
        query: () => ({
          url: 'instagram/user-posts/',
          method: 'GET',
        }),
      }),
      UserInstagramPostData: build.mutation({
        query: body => ({
          url: 'instagram/save-userData/',
          method: 'POST',
          body,
        }),
      }),
  }),
});
export const {
    useGetUserPostQuery,
    useUserInstagramPostDataMutation,
} = authApi;