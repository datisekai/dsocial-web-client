import React, { useState } from 'react';
import Header from '../components/Header';
import SidebarMessage from '../components/SidebarMessage';
import DrawMessage from '../components/Drawer/DrawerMessage';
import DrawerMenu from '../components/Drawer/DrawerMenu';
import DrawerFriend from '../components/Drawer/DrawerFriend';
import Sidebar from '../components/Sidebar';
import SideFriend from '../components/SideFriend';

const MainLayout = ({ children }) => {
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleFriend, setVisibleFriend] = useState(false);
    return (
        <div className="min-h-screen">
            <Header onOpenMenu={() => setVisibleMenu(true)} onOpenFriend={() => setVisibleFriend(true)} />
            <div className="flex h-[calc(100vh-66px)]">
                <div className="w-[250px] hidden md:block"></div>
                <div className="w-[250px] fixed bg-base-100 z-50 hidden md:block px-4 py-2 h-full border-r">
                    <Sidebar />
                </div>
                <div className="flex-1">{children}</div>
                <div className="w-[250px] hidden md:block"></div>
                <div className="w-[250px] fixed bg-base-100 z-50 right-0 hidden md:block px-4 py-2 h-full border-l">
                    <SideFriend />
                </div>
            </div>
            <DrawerMenu visible={visibleMenu} onClose={() => setVisibleMenu(false)} />
            <DrawerFriend visible={visibleFriend} onClose={() => setVisibleFriend(false)} />
        </div>
    );
};

export default MainLayout;
