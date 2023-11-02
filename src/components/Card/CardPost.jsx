import React, { useState } from 'react';

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
    {
        src: 'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg',
    },
    {
        src: 'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg',
    },
];

const CardPost = ({ group }) => {
    const countViewImage = 6;
    const [isShowFullImage, setIsShowFullImage] = useState(false);

    return (
        <div className="p-4 bg-base-200 rounded w-full">
            <div className="flex items-center gap-2">
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
                <div>
                    {group && <p className="font-medium">Tên nhóm</p>}
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

            <div className="mt-2 ">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(isShowFullImage ? images : [...images].splice(0, countViewImage)).map((image, index) => (
                        <img src={image.src} key={index} className="w-full h-full" />
                    ))}
                </div>
                {images.length > 5 ? (
                    <button
                        onClick={() => setIsShowFullImage(!isShowFullImage)}
                        className="btn btn-sm md:btn-md btn-ghost mt-2"
                    >
                        {!isShowFullImage ? 'Xem thêm' : 'Thu gọn'}
                    </button>
                ) : (
                    <p>No</p>
                )}
            </div>
        </div>
    );
};

export default CardPost;
