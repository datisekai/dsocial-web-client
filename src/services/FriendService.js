import { axiosClient } from '../utils/axiosClient';
const FriendServices = {
    getFriendByUserId: async (userId) => {
        if (!userId) return;
        const result = await axiosClient.get(`/friend/${userId}`);
        return result.data;
    },
    getFriendRequestByUserId: async () => {
        const result = await axiosClient.get(`/friend/requests`);
        return result.data;
    },
    acceptFriend: async (userId) => {
        if (!userId) return;
        const result = await axiosClient.put(`/friend/${userId}`);
        return result;
    },
    deleteFriendRequest: async (userId) => {
        if (!userId) return;
        const result = await axiosClient.delete(`/friend/request/${userId}`);
        return result;
    },
    deleteFriend: async (userId) => {
        if (!userId) return;
        const result = await axiosClient.delete(`/friend/${userId}`);
        return result;
    },
};

export default FriendServices;
