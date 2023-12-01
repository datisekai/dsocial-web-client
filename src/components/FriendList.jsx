import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CardFriend from './Card/CardFriend';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import SearchServices from '../services/SearchService';

const FriendList = ({ query }) => {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteLoad(
        SearchServices.searchFriends,
        'friendSearch',
        null,
        query,
    );

    return (
        <div>
            {' '}
            <InfiniteScroll
                dataLength={data}
                next={fetchNextPage}
                hasMore={hasNextPage}
                className="mt-8"
                loader={
                    <div className="my-2 flex justify-center">
                        <span className="loading loading-dots loading-md"></span>
                    </div>
                }
            >
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <div className="mt-4" key={index}>
                            <CardFriend key={item.id} disableOnline={true} {...item} />
                        </div>
                    ))
                ) : (
                    <div>Không có bạn bè nào</div>
                )}
            </InfiniteScroll>
        </div>
    );
};

export default FriendList;
