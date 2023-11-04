import { axiosClient } from '../utils/axiosClient';
const GroupServices = {
    getAllGroups: async () => {
        const result = await axiosClient.get('/group');
        return result.data;
    },
    getAllGroupsJoined: async () => {
        const result = await axiosClient.get(`/group/joined`);
        return result.data;
    },
    getAllGroupsOwn: async () => {
        const result = await axiosClient.get(`/group/own`);
        return result.data;
    },
};

export default GroupServices;
