import { axiosClient } from '../utils/axiosClient';
const ProfileServices = {
    getProfileByUserId: async (userId) => {
        if (!userId) return;
        const result = await axiosClient.get(`/profile/${userId}`);
        return result.data;
    },
    getPostByUserId: async (userId) => {
        if (!userId) return;
        const result = await axiosClient.get(`/post/user/${userId}`);
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

export default ProfileServices;
