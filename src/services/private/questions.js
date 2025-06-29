import { privateAPI } from '.';

export const authApi = privateAPI.injectEndpoints({
    endpoints: build => ({
        getQuestions: build.query({
            query: () => ({
                url: '/instagram/questions/',
                method: 'GET',
            }),
        }),
        addQuestion: build.mutation({
            query: body => ({
                url: 'instagram/submit-answers/',
                method: 'POST',
                body,
            }),
        }),
    }),
});
export const {
    useGetQuestionsQuery,
    useAddQuestionMutation,
} = authApi;