import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UserServices from '../services/UserService';
import { useLocalStorage } from 'usehooks-ts';
import { setTokenAndUser } from '../redux/slices/userSlice';

const useAuth = () => {
    const [token, setToken] = useLocalStorage('token');
    const dispatch = useDispatch();

    const getMyInfo = async () => {
        const response = await UserServices.getOwn();
        const { data } = response.data;
        dispatch(setTokenAndUser({ user: data, token }));
    };

    useEffect(() => {
        if (token) {
            getMyInfo();
        }
    }, [token]);

    return true;
};

export default useAuth;
