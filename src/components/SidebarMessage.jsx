import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import MessageService from '../services/MessageService';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import getImage from '../utils/getImage';
import { useSelector } from 'react-redux';
import { SocketContext } from '../contexts/SocketContext';
import { useMemo } from 'react';

function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

function isVideo(url) {
    return /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/.test(url);
}
const SidebarMessage = () => {
    const { data, fetchNextPage, isFetching } = useInfiniteLoad(MessageService.getMyMessages, 'my-messages');
    const { userActives } = useContext(SocketContext);

    const getContent = (message) => {
        if (!message) return '';
        if (isImage(message.last_message)) return 'Đã gửi 1 ảnh';
        if (isVideo(message.last_message)) return 'Đã gửi 1 video';
        return message.last_message;
    };

    return (
        <div>
            <h1 className="text-title">Tin nhắn</h1>
            <div className="mt-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm tin nhắn"
                    className="input input-bordered input-sm w-full max-w-xs"
                />
            </div>
            <div className="mt-4">
                {!data || (data?.length == 0 && <div>Không có tin nhắn</div>)}
                {data?.map((item, index) => (
                    <Link to={`/message/${item.user_send.id}`} key={index}>
                        <div key={index} className="flex py-2 items-center gap-2 cursor-pointer">
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
