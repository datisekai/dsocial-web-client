import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
const useInfiniteLoad = (getData, queryKey, propsId, keySearch) => {
    const { user } = useSelector((state) => state.user);
    const {
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
        isFetchingNextPage,
        isFetchingPreviousPage,
        data,
        isFetching,
    } = useInfiniteQuery({
        queryKey: [queryKey, keySearch],
        queryFn: ({
            pageParam = 1,
            id = propsId === null ? user.id : propsId,
            q = keySearch === null ? '' : keySearch,
        }) => getData({ pageParam, id, q }),
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = lastPage.pagination.next_page || null;
            if (nextPage) return +nextPage;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            const prevPage = firstPage.pagination.prev_page || null;
            if (prevPage) return +prevPage;
        },
    });

    const dataAllPages = useMemo(() => {
        if (!data) return [];
        return data.pages.reduce((pre, cur) => [...pre, ...cur.data], []);
    }, [data]);
    console.log(dataAllPages);
    // console.log(groupId);
    return {
        fetchNextPage,
        hasNextPage,
        data: dataAllPages,
        isFetchingNextPage,
        fetchPreviousPage,
        isFetchingPreviousPage,
        hasPreviousPage,
        isFetching,
    };
};

export default useInfiniteLoad;
