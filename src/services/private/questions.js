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
        getQuestionResp: build.query({
            query: () => ({
                url: 'instagram/submit-answers/',
                method: 'GET',
            }),
        }),
    }),
});
export const {
    useGetQuestionsQuery,
    useAddQuestionMutation,
    useGetQuestionRespQuery,
} = authApi;