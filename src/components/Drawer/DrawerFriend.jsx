import React from 'react';
import tabs from '../../data/tabs';
import { Link, NavLink } from 'react-router-dom';
import friends from '../../data/friends';
import CardFriend from '../Card/CardFriend';

const DrawerFriend = ({ visible, onClose }) => {
    return (
        <div className="drawer drawer-end">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" onChange={() => {}} checked={visible} />

            <div className="drawer-side z-[100]">
                <div onClick={onClose} aria-label="close sidebar" className="drawer-overlay"></div>
                <div className="menu p-4 z-50 w-80 min-h-full bg-base-200 ">
                    <div>
                        <div>
                            <input
                                type="text"
                                placeholder="Người liên hệ"
                                className="input input-bordered input-sm w-full max-w-xs"
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <h3 className="font-medium">Người liên hệ</h3>
                            <Link to={'/friend'}>
                                <button className="btn btn-ghost btn-xs normal-case">Xem tất cả</button>
                            </Link>
                        </div>
                        <ul className="mt-4 flex flex-col gap-y-2">
                            {friends.map((friend) => (
                                <CardFriend key={friend.id} {...friend} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawerFriend;
