import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocalStorage } from 'usehooks-ts';
import { reloadMyFriend, setTokenAndUser } from '../redux/slices/userSlice';
import UserServices from '../services/UserService';

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
            dispatch(reloadMyFriend());
        }
    }, [token]);

    return true;
};

export default useAuth;
