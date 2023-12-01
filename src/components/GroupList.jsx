import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CardGroup from './Card/CardGroup';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import SearchServices from '../services/SearchService';

const GroupList = ({ query }) => {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteLoad(
        SearchServices.searchGroups,
        'groupSearch',
        null,
        query,
    );

    return (
        <>
            <div>
                <InfiniteScroll
                    dataLength={data.length}
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
                        data.map((item) => (
                            <div className="mt-4" key={item.id}>
                                <CardGroup key={item.id} group={item} isJoin={item.is_joined} />
                            </div>
                        ))
                    ) : (
                        <div>Không có nhóm nào</div>
                    )}
                </InfiniteScroll>
            </div>
        </>
    );
};

export default GroupList;
