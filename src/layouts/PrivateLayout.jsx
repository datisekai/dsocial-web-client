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
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleFriend, setVisibleFriend] = useState(false);
    // const user = null
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, []);

    return (
        <>
            {!token || !user ? (
                <ScreenSpinner />
            ) : (
                <div className="min-h-screen">
                    <Header onOpenMenu={() => setVisibleMenu(true)} onOpenFriend={() => setVisibleFriend(true)} />
                    <div className="flex h-[calc(100vh-66px)]">
                        <div className="w-[250px]"></div>
                        <div className="w-[250px] fixed bg-base-100 z-50 hidden md:block px-4 py-2 h-full border-r">
                            <Sidebar />
                        </div>
                        <div className="flex-1 px-4 py-2">{children}</div>
                        <div className="w-[250px]"></div>
                        <div className="w-[250px] fixed bg-base-100 z-50 right-0 hidden md:block px-4 py-2 h-full border-l">
                            <SideFriend />
                        </div>
                    </div>
                    <DrawerMenu visible={visibleMenu} onClose={() => setVisibleMenu(false)} />
                    <DrawerFriend visible={visibleFriend} onClose={() => setVisibleFriend(false)} />
                </div>
            )}
        </>
    );
};

export default PrivateLayout;
