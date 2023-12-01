import React, { useMemo, useState } from 'react';
import useQueryParams from '../hooks/useQueryParams';
import CardFriend from '../components/Card/CardFriend';
import friends from '../data/friends';
import CardPost from '../components/Card/CardPost';
import CardGroup from '../components/Card/CardGroup';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchServices from '../services/SearchService';
import PeopleList from '../components/PeopleList';
import PostList from '../components/PostList';
import GroupList from '../components/GroupList';
import FriendList from '../components/FriendList';
import { useNavigate } from 'react-router-dom';

const tabs = [
    {
        action: 'friend',
        title: 'Bạn bè',
    },
    {
        action: 'people',
        title: 'Mọi người',
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
    const queryParams = useQueryParams();

    const query = queryParams.get('query');
    const action = queryParams.get('tab') || 'friend'
    // const [action, setAction] = useState(tab);
    const navigate = useNavigate()

    return (
        <div className="px-4 py-2">
            {query && <h1>Kết quả tìm kiếm của "{query}"</h1>}
            <div className="flex items-center gap-2 flex-wrap mt-4">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(`?query=${query}&tab=${tab.action}`)}
                        className={`btn btn-sm normal-case ${tab.action == action ? 'btn-primary' : ''}`}
                    >
                        {tab.title} 
                    </button>
                ))}
            </div>

            {action == 'friend' && <FriendList query={query} />}

            {action == 'people' && <PeopleList query={query} />}

            {action == 'post' && <PostList query={query} />}

            {action == 'group' && <GroupList query={query} />}
        </div>
    );
};

export default Search;
