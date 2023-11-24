import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import useInfiniteLoad from '../../hooks/useInfiniteLoad';
import MessageService from '../../services/MessageService';
import { SocketContext } from '../../contexts/SocketContext';
import getImage from '../../utils/getImage';

const DrawMessage = ({ visible, onClose }) => {
    const { data, fetchNextPage, isFetching } = useInfiniteLoad(MessageService.getMyMessages, 'my-messages');
    const { userActives } = useContext(SocketContext);

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
                                                userActives.some((active) => active.id === item.user_send.id)
                                                    ? 'online'
                                                    : ''
                                            }`}
                                        >
                                            <div className="w-[50px] rounded-full">
                                                <img src={getImage(item.user_send.avatar)} />
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="font-medium">{item.user_send.name}</h2>
                                            <p>{item.last_message}</p>
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
