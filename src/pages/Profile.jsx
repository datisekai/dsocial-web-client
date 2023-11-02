import React from 'react';
import { FaRegAddressCard } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import CardPost from '../components/Card/CardPost';
import { Link } from 'react-router-dom';

const Profile = () => {
    return (
        <div>
            <div className="relative">
                <img
                    className="w-full h-auto aspect-video md:aspect-auto md:h-[250px] object-cover "
                    src="https://images.unsplash.com/photo-1682685797661-9e0c87f59c60?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D"
                />

                <div className="absolute px-4 bottom-[-40px] left-0 right-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            className="rounded-full w-[80px] h-[80px] border-primary border-2"
                            src="http://fakeimg.pl/50x50?font=lobster"
                            alt=""
                        />
                        <div className="">
                            <h1 className="font-bold text-primary">Thành Đạt</h1>
                            <p className="text-[#828486]">(datisekai)</p>
                        </div>
                    </div>

                    <Link to={'/profile/edit'}>
                        <button className="btn btn-sm md:btn-md btn-primary">Chỉnh sửa</button>
                    </Link>
                </div>
            </div>

            <div className="mt-[62px] px-4">
                <div className="bg-[#f5f5f5] p-4 space-y-2">
                    <h2 className="font-bold">Giới thiệu</h2>
                    <p>"Change before you're forced to change!"</p>
                    <div className="flex items-center gap-2">
                        <LiaBirthdayCakeSolid size={22} /> <span>03/01/2002</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRegAddressCard size={22} /> <span>Tân Bình, TP.HCM</span>
                    </div>
                </div>

                <div className="bg-[#f5f5f5] p-4 space-y-2 mt-4">
                    <h2 className="font-bold">Bài viết</h2>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                        <CardPost key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
