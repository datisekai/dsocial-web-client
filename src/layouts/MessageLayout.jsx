import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import DrawerMenu from '../components/Drawer/DrawerMenu';
import DrawMessage from '../components/Drawer/DrawerMessage';
import Header from '../components/Header';
import SidebarMessage from '../components/SidebarMessage';
import { useQuery } from '@tanstack/react-query';
import MessageService from '../services/MessageService';

const MessageLayout = ({ children }) => {
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleFriend, setVisibleFriend] = useState(false);

    const {data, isLoading} = useQuery({queryKey:['list-message'], queryFn:() => MessageService.getListMessage()})

    return (
        <div className="min-h-screen">
            <Header onOpenMenu={() => setVisibleMenu(true)} onOpenFriend={() => setVisibleFriend(true)} />
            <div className="flex h-[calc(100vh-66px)]">
                <div className="w-[300px] hidden md:block"></div>
                <div className="w-[300px] fixed bg-base-100 z-50 hidden md:block px-4 py-2 h-full border-r">
                    <SidebarMessage />
                </div>
                <div className="flex-1">{children}</div>
            </div>
            <DrawerMenu visible={visibleMenu} onClose={() => setVisibleMenu(false)} />
            <DrawMessage visible={visibleFriend} onClose={() => setVisibleFriend(false)} />
        </div>
    );
};

export default MessageLayout;
