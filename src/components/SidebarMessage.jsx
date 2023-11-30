import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MessageService from '../services/MessageService';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import getImage from '../utils/getImage';
import { useSelector } from 'react-redux';
import { SocketContext } from '../contexts/SocketContext';
import { useMemo } from 'react';
const SidebarMessage = () => {
    const { data } = useQuery({ queryKey: ['my-messages'], queryFn: MessageService.getMyMessages });

    const [text, setText] = useState('');

    const { userActives } = useContext(SocketContext);

    const { id } = useParams();

    const getContent = (message) => {
        if (!message) return '';
        const { content, type } = message.last_message;
        if (type === 'image') return 'Đã gửi 1 ảnh';
        if (type === 'video') return 'Đã gửi 1 video';
        return content;
    };

    const dataDisplay = useMemo(() => {
        if (!text || (text && text.trim().length == 0)) return data;

        return data?.filter((item) => {
            const textSearch = `${item.user_send.name} ${item.user_send.orther_name || ''} ${item.user_send.email} ${
                item.last_message
            }`;
            return textSearch.toLowerCase().includes(text.toLowerCase());
        });
    }, [data, text]);

    return (
        <div>
            <h1 className="text-title">Tin nhắn</h1>
            <div className="mt-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tìm kiếm người liên hệ"
                    className="input input-bordered input-sm w-full max-w-xs"
                />
            </div>
            <div className="mt-4">
                {!dataDisplay || (dataDisplay?.length == 0 && <div>Không có tin nhắn</div>)}
                {dataDisplay?.map((item, index) => (
                    <Link to={`/message/${item.user_send.id}`} key={index}>
                        <div
                            key={index}
                            className={`flex py-2 items-center gap-2 relative cursor-pointer rounded px-2 ${
                                id == item.user_send.id ? 'bg-primary text-white' : ''
                            }`}
                        >
                            {/* {!item.last_message.is_seen &&  <div className="avatar online w-[50px] h-[50px] absolute right-5">
                            </div>} */}
                            <div
                                className={`avatar ${
                                    userActives.some((active) => active.id === item.user_send.id) ? 'online' : ''
                                }`}
                            >
                                <div className="w-[50px] rounded-full">
                                    <img src={getImage(item.user_send.avatar)} />
                                </div>
                            </div>
                            <div>
                                <h2 className="font-medium">{item.user_send.name}</h2>
                                <p>{getContent(item)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SidebarMessage;
