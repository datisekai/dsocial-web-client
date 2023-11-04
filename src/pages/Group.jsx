import React from 'react';
import useQueryParams from '../hooks/useQueryParams';
import { Link } from 'react-router-dom';
import { kFormatter } from '../utils/common';
import CardGroup from '../components/Card/CardGroup';

const tabs = [
    {
        action: '',
        title: 'Nhóm đã tham gia',
    },
    {
        action: 'all',
        title: 'Tất cả nhóm',
    },
    {
        action: 'my-group',
        title: 'Nhóm của tôi',
    },
];

const groups = [
    {
        name: 'Cooking group',
        members: 20000,
        id: 1,
    },
    {
        name: 'Cooking group',
        members: 20000,
        id: 1,
    },
    {
        name: 'Cooking group',
        members: 20000,
        id: 1,
    },
    {
        name: 'Cooking group',
        members: 20000,
        id: 1,
    },
    {
        name: 'Cooking group',
        members: 20000,
        id: 1,
    },
];

const Group = () => {
    const query = useQueryParams();

    const action = query.get('action') || '';

    return (
        <div className="px-4 py-2">
            <div className="flex items-center justify-between">
                <h1 className="text-primary font-bold">Nhóm</h1>
                <button className="btn btn-primary btn-sm md:btn-md">Tạo nhóm</button>
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-4">
                {tabs.map((tab, index) => (
                    <Link to={tab.action ? `/group?action=${tab.action}` : '/group'}>
                        <button
                            className={`btn btn-sm normal-case ${tab.action == action ? 'btn-primary' : ''}`}
                            key={index}
                        >
                            {tab.title}
                        </button>
                    </Link>
                ))}
            </div>

            <div className='mt-4'>
                <input
                    type="text"
                    placeholder="Tìm kiếm nhóm"
                    className="input input-bordered w-full max-w-xs"
                />
            </div>

            <div className='mt-4 space-y-2'>
                {groups.map((group) => (
                    <CardGroup key={group.id} group={group}/>
                ))}
            </div>
        </div>
    );
};

export default Group;
