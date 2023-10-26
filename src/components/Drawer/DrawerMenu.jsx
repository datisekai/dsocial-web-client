import React from 'react';
import tabs from '../../data/tabs';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DrawerMenu = ({ visible, onClose }) => {
    const { user } = useSelector((state) => state.user);
    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" onChange={() => {}} checked={visible} />

            <div className="drawer-side z-[100]">
                <div onClick={onClose} aria-label="close sidebar" className="drawer-overlay"></div>
                <div className="menu p-4 w-80 min-h-full bg-base-200 ">
                    <div className="flex items-center gap-4">
                        <div className="avatar ">
                            <div className="w-12 rounded-full">
                                <img src={user?.avatar} />
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm trên DSocial"
                                className="input input-bordered input-sm w-full max-w-xs"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        {tabs.map((tab, index) => {
                            const ReactIcon = tab.icon;
                            return (
                                <NavLink key={index} to={tab.url}>
                                    <div className="flex drawer-menu px-4 space-x-4 justify-start cursor-pointer text-lg items-center py-4">
                                        <ReactIcon />
                                        <span>{tab.title}</span>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawerMenu;
