import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CardPost from './Card/CardPost';
import SearchServices from '../services/SearchService';
import useInfiniteLoad from '../hooks/useInfiniteLoad';

const PostList = ({ query }) => {
    const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteLoad(SearchServices.searchPosts, 'postSearch', null, query);

    return (
        <>
          {isLoading ? <div>Loading...</div> :   <div>
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
                        data.map((item, index) => (
                            <div className="mt-4" key={index}>
                                <CardPost key={item.id} nameQuery={'postSearch'} post={item} />
                            </div>
                        ))
                    ) : (
                        <div>Không có bài viết nào</div>
                    )}
                </InfiniteScroll>
            </div>}
        </>
    );
};

export default PostList;
