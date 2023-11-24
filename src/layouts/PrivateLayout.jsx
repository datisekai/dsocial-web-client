import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import ScreenSpinner from '../components/ScreenSpinner';
import SocketContextProvider from '../contexts/SocketContext';

const PrivateLayout = ({ children }) => {
    const [token, setToken] = useLocalStorage('token', '');
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // const user = null
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, []);

    return <>{!token || !user ? <ScreenSpinner /> : <SocketContextProvider>{children}</SocketContextProvider>}</>;
};

export default PrivateLayout;
