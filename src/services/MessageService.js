import { axiosClient } from '../utils/axiosClient';

const MessageService = {
    getMyMessages: async ({ pageParam = 1 }) => {
        const limit = 9999;
        const result = await axiosClient.get(`/message/user?page=${pageParam}&limit=${limit}`);
        return result.data.data;
    },
    getMessageByReceiveId: async ({ pageParam = 1, id }) => {
        if (!id) return;
        const limit = 9999;
        const result = await axiosClient.get(`/message/${id}?page=${pageParam}&limit=${limit}`);

        return result.data.data;
    },
    addMessage: (data) => {
        return axiosClient.post('/message', data);
    },
    recallMessage: (messageId) => {
        return axiosClient.delete(`/message/${messageId}`);
    },
    seenMessage:(messageId) => {
        return axiosClient.put(`/message/seen/${messageId}`)
    }
};

export default MessageService;
