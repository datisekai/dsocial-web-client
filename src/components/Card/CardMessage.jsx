import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import calculateCreatedTime from '../../utils/calculateCreatedTime';
import getImage, { getVideo } from '../../utils/getImage';

const CardMessage = ({ data }) => {
    const { user } = useSelector((state) => state.user);

    const typeChat = useMemo(() => {
        if (data.user_send.id === user.id) return 'chat-end';
        return 'chat-start';
    }, [data, user]);

    return (
        <div className={`chat ${typeChat}`}>
            <div className="chat-image avatar">
                <div className="w-12 rounded-full">
                    <img src={getImage(data.user_send.avatar)} />
                </div>
            </div>
            <div className="chat-header">
                {data.user_send.name}
                <time className="text-xs opacity-50 ml-2">{calculateCreatedTime(data.created_at)}</time>
            </div>
            <div className="chat-bubble">
                {data.type == 'text' && <p>{data.content}</p>}
                {data.type == 'image' && <img src={getImage(data.content)} />}
                {data.type == 'video' && <img src={getVideo(data.content)} />}
            </div>
            {user?.id == data.user_send.id && (
                <div className="chat-footer opacity-50">{data.is_seen ? 'Đã xem' : 'Đã gửi'}</div>
            )}
        </div>
    );
};

export default CardMessage;
