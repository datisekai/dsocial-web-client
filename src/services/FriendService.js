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
    acceptFriend: (userId) => {
        if (!userId) return;
        return axiosClient.put(`/friend/${userId}`);
    },
    deleteFriendRequest: (userId) => {
        if (!userId) return;
        return axiosClient.delete(`/friend/request/${userId}`);
    },
    deleteFriend: (userId) => {
        if (!userId) return;
        return axiosClient.delete(`/friend/${userId}`);
    },
};

export default FriendServices;
