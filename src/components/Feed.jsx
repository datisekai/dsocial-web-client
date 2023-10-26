import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import CardFeed from './Card/CardFeed';
import { BsPlusLg } from 'react-icons/bs';

const Feed = () => {
    return (
        <div className="grid">
            <Swiper className="w-full" slidesPerView={'auto'} spaceBetween={8} grabCursor={true}>
                <SwiperSlide className="!w-auto">
                    <div className="w-24 h-24 rounded bg-gradient-to-b from-primary to-neutral flex items-center justify-center">
                        <span className="btn btn-sm btn-ghost text-base-100">
                            <BsPlusLg size={16} /> Tạo
                        </span>
                    </div>
                </SwiperSlide>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item,index) => (
                    <SwiperSlide key={index} className="!w-auto">
                        <CardFeed />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Feed;
