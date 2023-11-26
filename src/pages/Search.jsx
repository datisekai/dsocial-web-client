import React, { useMemo, useState } from 'react';
import useQueryParams from '../hooks/useQueryParams';
import CardFriend from '../components/Card/CardFriend';
import friends from '../data/friends';
import CardPost from '../components/Card/CardPost';
import CardGroup from '../components/Card/CardGroup';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchServices from '../services/SearchService';

const tabs = [
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
    const query = useQueryParams();

    const [action, setAction] = useState(tabs[0].action);
    const {
        data: dataPeople,
        isFetchingNextPage: isLoadingPeople,
        hasNextPage: hasNextpagedataPeople,
        fetchNextPage: fetchNextPagePeople,
    } = useInfiniteLoad(SearchServices.searchPeople, 'peopleSearch', null, query.get('query'));
    const {
        data: dataGroup,
        isFetchingNextPage: isLoadingdataGroup,
        hasNextPage: hasNextpagedataGroup,
        fetchNextPage: fetchNextPagedataGroup,
    } = useInfiniteLoad(SearchServices.searchGroups, 'groupSearch', null, query.get('query'));
    const {
        data: dataPost,
        isFetchingNextPage: isLoadingdataPost,
        hasNextPage: hasNextpagedataPost,
        fetchNextPage: fetchNextPagedataPost,
    } = useInfiniteLoad(SearchServices.searchPosts, 'postSearch', null, query.get('query'));

    return (
        <div className="px-4 py-2">
            <h1>Kết quả tìm kiếm của "{query.get('query')}"</h1>
            <div className="flex items-center gap-2 flex-wrap mt-4">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setAction(tab.action)}
                        className={`btn btn-sm normal-case ${tab.action == action ? 'btn-primary' : ''}`}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            {action == 'people' && !isLoadingPeople && (
                <InfiniteScroll
                    dataLength={dataPeople.length}
                    next={fetchNextPagePeople}
                    hasMore={hasNextpagedataPeople}
                    className="mt-8"
                    loader={
                        <div className="my-2 flex justify-center">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    }
                >
                    {dataPeople.length > 0 ? (
                        dataPeople.map((item, index) => (
                            <div className="mt-4" key={index}>
                                <CardFriend key={item.id} disableOnline={true} {...item} />
                            </div>
                        ))
                    ) : (
                        <div>Không có người dùng nào</div>
                    )}
                </InfiniteScroll>
            )}

            {action == 'post' && !isLoadingdataPost && (
                <InfiniteScroll
                    dataLength={dataPost.length}
                    next={fetchNextPagedataPost}
                    hasMore={hasNextpagedataPost}
                    className="mt-8"
                    loader={
                        <div className="my-2 flex justify-center">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    }
                >
                    {dataPost.length > 0 ? (
                        dataPost.map((item, index) => (
                            <div className="mt-4" key={index}>
                                <CardPost key={item.id} nameQuery={'postSearch'} post={item} />
                            </div>
                        ))
                    ) : (
                        <div>Không có bài viết nào</div>
                    )}
                </InfiniteScroll>
            )}

            {action == 'group' && !isLoadingdataGroup && (
                <InfiniteScroll
                    dataLength={dataGroup.length}
                    next={fetchNextPagedataGroup}
                    hasMore={hasNextpagedataGroup}
                    className="mt-8"
                    loader={
                        <div className="my-2 flex justify-center">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    }
                >
                    {dataGroup.length > 0 ? (
                        dataGroup.map((item) => (
                            <div className="mt-4" key={item.id}>
                                <CardGroup key={item.id} group={item} isJoin={item.is_joined} />
                            </div>
                        ))
                    ) : (
                        <div>Không có nhóm nào</div>
                    )}
                </InfiniteScroll>
            )}
        </div>
    );
};

export default Search;
