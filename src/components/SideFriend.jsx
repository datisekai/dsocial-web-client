import React from 'react';
import CardFriend from './Card/CardFriend';
import { Link } from 'react-router-dom';
import friends from '../data/friends';



const SideFriend = () => {
    return (
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
    );
};

export default SideFriend;
