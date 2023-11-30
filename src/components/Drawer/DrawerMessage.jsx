import { useQuery } from '@tanstack/react-query';
import React, { useContext, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SocketContext } from '../../contexts/SocketContext';
import MessageService from '../../services/MessageService';
import getImage from '../../utils/getImage';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const DrawMessage = ({ visible, onClose }) => {
    const { data } = useQuery({ queryKey: ['my-messages'], queryFn: () => MessageService.getMyMessages() });
    const { userActives } = useContext(SocketContext);

    const [text, setText] = useState('');
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
        <div className="drawer drawer-end">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" onChange={() => {}} checked={visible} />

            <div className="drawer-side z-[100]">
                <div onClick={onClose} aria-label="close sidebar" className="drawer-overlay"></div>
                <div className="menu p-4 z-50 w-80 min-h-full bg-base-200 ">
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
                                        className={`flex py-2 items-center gap-2 px-2 rounded cursor-pointer ${
                                            id == item.user_send.id ? 'bg-primary text-white' : ''
                                        }`}
                                    >
                                        <div
                                            className={`avatar ${
                                                userActives.some((active) => active.id === item.user_send.id)
                                                    ? 'online'
                                                    : ''
                                            }`}
                                        >
                                            <div className="w-[50px] rounded-full">
                                                <LazyLoadImage effect='blur' src={getImage(item.user_send.avatar)} />
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
                </div>
            </div>
        </div>
    );
};

export default DrawMessage;
