import React from 'react';
import { Gallery } from 'react-grid-gallery';

const images = [
    {
        src: 'https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg',
    },
    {
        src: 'https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg',
    },
    {
        src: 'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg',
    },
    {
        src: 'https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg',
    },
    {
        src: 'https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg',
    },
    {
        src: 'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg',
    },
];
const CardPost = () => {
    return (
        <div className="p-4 bg-base-200 rounded">
            <div className="flex items-center gap-2">
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
                <div>
                    <p className="font-medium">Tên nhóm</p>
                    <div className="text-sm space-x-2">
                        <span>Datisekai</span>
                        <span>·</span>
                        <span>8 giờ</span>
                    </div>
                </div>
            </div>
            <article className="prose lg:prose-xl mt-2">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem impedit repellat reprehenderit iure
                ipsam totam odit et consequuntur aut quia nam atque, assumenda inventore quibusdam possimus, harum
                aspernatur eum vero?
            </article>

           <div className='mt-2'>
           <Gallery images={images} />
           </div>
        </div>
    );
};

export default CardPost;
