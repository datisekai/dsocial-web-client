import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeTokenAndUser } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../contexts/SocketContext';

const useUser = () => {
    const { user, token } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(removeTokenAndUser());
        navigate('/login')

    };

    return { user, token, handleLogout };
};

export default useUser;
