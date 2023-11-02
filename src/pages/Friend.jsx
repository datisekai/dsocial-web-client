import React from 'react';
import { Link } from 'react-router-dom';
import useQueryParams from '../hooks/useQueryParams';

const tabs = [
    {
        title: 'Bạn bè',
    },
    {
        title: 'Lời mời kết bạn',
        action: 'request',
    },
];

const Friend = () => {
    const query = useQueryParams();

    return (
        <div className="flex flex-col md:flex-row  px-4 py-2">
            <ul className="w-full border-r md:w-[150px] flex flex-row md:flex-col">
                {tabs.map((tab, index) => {
                    return (
                        <Link key={index} to={`/friend${tab?.action ? '?action=' + tab.action : ''}`}>
                            <li className={`p-2`}>
                                <span
                                    className={`${query.get('action') == tab?.action ? 'border-b border-primary' : ''}`}
                                >
                                    {tab.title}
                                </span>
                            </li>
                        </Link>
                    );
                })}
            </ul>
            <div className="flex-1 md:px-4">
                {query.get('action') === 'request' ? (
                    <>
                        <h1 className="text-primary font-bold">Lời mời kết bạn</h1>
                        <div className="mt-4 space-y-2">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            className="rounded-full w-[70px] h-[70px]"
                                            src="https://dummyimage.com/200x200.gif"
                                            alt=""
                                        />
                                        <h2 className="font-bold">Thành Đạt</h2>
                                    </div>
                                    <div className="flex gap-2 mt-2 md:mt-0 flex-col md:flex-row">
                                        <button className="btn btn-primary btn-sm md:btn-md">Chấp nhận</button>
                                        <button className="btn btn-sm md:btn-md">Xóa</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-primary font-bold">Bạn bè</h1>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between ">
                                <div className="flex items-center gap-2">
                                    <img
                                        className="rounded-full w-[70px] h-[70px]"
                                        src="https://dummyimage.com/200x200.gif"
                                        alt=""
                                    />
                                    <h2 className="font-bold">Thành Đạt</h2>
                                </div>
                                <button className="btn btn-sm md:btn-md">Hủy bạn bè</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Friend;
