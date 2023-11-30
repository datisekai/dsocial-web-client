import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import calculateCreatedTime from '../../utils/calculateCreatedTime';
import getImage, { getVideo } from '../../utils/getImage';
import useHandleMessage from '../../hooks/useHandleMessage';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const CardMessage = ({ data }) => {
    const { user } = useSelector((state) => state.user);

    const typeChat = useMemo(() => {
        if (data.user_send.id === user.id) return 'chat-end';
        return 'chat-start';
    }, [data, user]);

    const { id } = useParams();

    const { handleRecallMessage } = useHandleMessage({ receiveId: id });

    return (
        <div className={`chat ${typeChat}`}>
            <div className="chat-image avatar">
                <div className="w-12 rounded-full">
                    <LazyLoadImage effect="blur" src={getImage(data.user_send.avatar)} />
                </div>
            </div>
            <div className="chat-header">
                {data.user_send.name}
                <time className="text-xs opacity-50 ml-2">{calculateCreatedTime(data.created_at)}</time>
            </div>
            <div className="chat-bubble relative">
                {!data.is_active && <p>{data.content}</p>}
                {data.type == 'text' && data.is_active && <p>{data.content}</p>}
                {data.type == 'image' && data.is_active && <LazyLoadImage effect="blur" src={getImage(data.content)} />}
                {data.type == 'video' && data.is_active && (
                    <video controls>
                        <source src={getVideo(data.content)} type="video/mp4" />
                    </video>
                )}
            </div>
            {user?.id == data.user_send.id && (
                <div className="chat-footer opacity-50 flex gap-2">
                    {data.is_active && (
                        <div className="link link-hover" onClick={() => handleRecallMessage(data.id)}>
                            Thu hồi
                        </div>
                    )}
                    {/* <div>{data.is_seen ? 'Đã xem' : 'Đã gửi'}</div> */}
                </div>
            )}
        </div>
    );
};

export default CardMessage;
