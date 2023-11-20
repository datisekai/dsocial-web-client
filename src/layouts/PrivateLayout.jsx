import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import Header from '../components/Header';
import ScreenSpinner from '../components/ScreenSpinner';
import SideFriend from '../components/SideFriend';
import Sidebar from '../components/Sidebar';
import DrawerMenu from '../components/Drawer/DrawerMenu';
import DrawerFriend from '../components/Drawer/DrawerFriend';

const PrivateLayout = ({ children }) => {
    const [token, setToken] = useLocalStorage('token', '');
    const { user } = useSelector((state) => state.user);

    // const user = null
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        console.log('mounted')
    }, []);

    return <>{!token || !user ? <ScreenSpinner /> : <>{children}</>}</>;
};

export default PrivateLayout;
