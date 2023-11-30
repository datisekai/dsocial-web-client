import { useQueryClient } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react';
import DrawerMenu from '../components/Drawer/DrawerMenu';
import DrawMessage from '../components/Drawer/DrawerMessage';
import Header from '../components/Header';
import SidebarMessage from '../components/SidebarMessage';
import { SocketContext } from '../contexts/SocketContext';

const MessageLayout = ({ children }) => {
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleFriend, setVisibleFriend] = useState(false);
    const queryClient = useQueryClient();

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        if (socket && socket.current) {
            socket.current.on('get-new-message', onNewMessage);
            socket.current.on('get-recall-message', onRecallMessage);
        }
    }, [socket.current]);

    useEffect(() => {
        return () => {
            socket.current.off('get-new-message');
            socket.current.off('get-recall-message');
        };
    }, []);

    const onNewMessage = (data) => {

        new Notification(`[Dsocial] Bạn có tin nhắn mới`, {
            body: `${data.user_send.name}: ${data.content}`,
          });

        const oldMessages = queryClient.getQueryData(['message', `${data.author_id}`]) || [];

        queryClient.setQueryData(['message', `${data.author_id}`], [...oldMessages, data]);

        const oldMyMessage = queryClient.getQueryData(['my-messages']) || [];

        queryClient.setQueryData(
            ['my-messages'],
            oldMyMessage.map((item) => (item.user_send.id === data.author_id ? { ...item, last_message: data } : item)),
        );
    };

    const onRecallMessage = ({ receiveId, messageId, authorId }) => {
        const oldMessages = queryClient.getQueryData(['message', `${authorId}`]) || [];
        queryClient.setQueryData(
            ['message', `${authorId}`],
            oldMessages.map((item) =>
                item.id == messageId ? { ...item, content: 'Tin nhắn đã được thu hồi', is_active: false } : item,
            ),
        );

        const oldMyMessage = queryClient.getQueryData(['my-messages']) || [];
        

        queryClient.setQueryData(
            ['my-messages'],
            oldMyMessage.map((item) =>
                item.user_send.id == authorId && item.last_message.id <= messageId
                    ? {
                          ...item,
                          last_message: {
                              ...item.last_message,
                              is_active: false,
                              content: 'Tin nhắn đã được thu hồi',
                          },
                      }
                    : item,
            ),
        );
    };

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
