import React, { useState } from 'react';
import useQueryParams from '../hooks/useQueryParams';
import CardFriend from '../components/Card/CardFriend';
import friends from '../data/friends';
import CardPost from '../components/Card/CardPost';
import CardGroup from '../components/Card/CardGroup';

const tabs = [
    {
        action: 'friend',
        title: 'Bạn bè',
    },
    {
        action: 'group',
        title: 'Nhóm',
    },
    {
        action: 'post',
        title: 'Bài viết',
    },
];
const Search = () => {
    const query = useQueryParams();

    const [action, setAction] = useState(tabs[0].action);

    return (
        <div className="px-4 py-2">
            <h1>Kết quả tìm kiếm của "{query.get('query')}"</h1>
            <div className="flex items-center gap-2 flex-wrap mt-4">
                {tabs.map((tab, index) => (
                    <button
                        onClick={() => setAction(tab.action)}
                        className={`btn btn-sm normal-case ${tab.action == action ? 'btn-primary' : ''}`}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            {action == 'friend' && (
                <div className="mt-8">
                    {friends.map((friend) => (
                        <div className="mt-4">
                            {' '}
                            <CardFriend key={friend.id} {...friend} />
                        </div>
                    ))}
                </div>
            )}

            {/* {action == 'post' && (
                <div className="mt-8">
                    {friends.map((friend) => (
                        <div className="mt-4">
                            {' '}
                            <CardPost />
                        </div>
                    ))}
                </div>
            )} */}

            {/* {action == 'group' && (
                <div className="mt-8">
                    {friends.map((friend) => (
                        <div className="mt-4">
                            {' '}
                            <CardGroup />
                        </div>
                    ))}
                </div>
            )} */}
        </div>
    );
};

export default Search;
