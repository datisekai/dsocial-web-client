import React, { useContext, useMemo, useState } from 'react';
import CardFriend from './Card/CardFriend';
import { Link } from 'react-router-dom';
import friends from '../data/friends';
import { SocketContext } from '../contexts/SocketContext';
import { useDebounce } from 'usehooks-ts';
import { useSelector } from 'react-redux';

const SideFriend = () => {
    const [text, setText] = useState('');
    const debouncedValue = useDebounce(text, 500);
    const { userActives } = useContext(SocketContext);
    const {friends} = useSelector(state => state.user)

    const userFilters = useMemo(() => {
        const friendIds = friends.map(item => item.id)
        const userFriends = userActives.filter(item => friendIds.includes(item.id))
        if (!debouncedValue) {
            return userFriends;
        }

        return userFriends.filter(item => {
            const textSearch = `${item.name} ${item.orther_name || ''} ${item.email}`
            return textSearch.toLowerCase().includes(debouncedValue.toLowerCase())
        })
    },[debouncedValue, userActives, friends])

    return (
        <div>
            <div className="mt-4 flex items-center justify-between">
                <h3 className="font-medium">Người liên hệ</h3>
                <Link to={'/friend'}>
                    <button className="btn btn-ghost btn-xs normal-case">Xem tất cả</button>
                </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-y-2">
                {userFilters.map((friend) => (
                    <CardFriend isMessage={true} key={friend.id} {...friend} />
                ))}
            </ul>
            {userFilters.length == 0 && <div className="text-sm">Chưa có bạn bè online</div>}
        </div>
    );
};

export default SideFriend;
