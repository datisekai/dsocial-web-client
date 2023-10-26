import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import {FaUserFriends} from 'react-icons/fa'

const Header = ({onOpenMenu, onOpenFriend}) => {
    return (
       <>
        <header id="header" className="px-4 left-0 right-0 fixed z-50 py-2 bg-primary flex justify-between">
            <div className=" md:hidden block">
                <div onClick={onOpenMenu} className="btn btn-ghost text-base-100">
                    <HiOutlineMenuAlt1 size={25} />
                </div>
            </div>
            <div className='flex-1 flex justify-center'>
                <Link to={'/'}>
                    <div className="flex items-center ">
                        <img className="w-[50px]" src="/logo.png" />
                        <span className="text-base-100 text-xl">#DSocial</span>
                    </div>
                </Link>
            </div>
            <div className=" md:hidden flex justify-end">
                <div onClick={onOpenFriend} className="btn btn-ghost text-base-100">
                    <FaUserFriends size={25} />
                </div>
            </div>
        </header>
        <div className='h-[66px]'></div>
        </>
    );
};

export default Header;
