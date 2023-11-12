import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const useInfiniteLoad = (getData, queryKey) => {
    const {
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
        isFetchingNextPage,
        isFetchingPreviousPage,
        data,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: ({ pageParam = 1 }) => getData({ pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = lastPage.pagination.next_page || null;
            if (nextPage) return +nextPage;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            const prevPage = lastPage.pagination.prev_page || null;
            if (prevPage) return +prevPage;
        },
    });

    const dataAllPages = useMemo(() => {
        if (!data) return [];
        return data.pages.reduce((pre, cur) => [...pre, ...cur.data], []);
    }, [data]);

    return { fetchNextPage, hasNextPage, data: dataAllPages, isFetchingNextPage, fetchPreviousPage };
};

export default useInfiniteLoad;
