import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const CardFeed = () => {
    return (
        <div className="avatar">
            <div className="w-24 rounded">
                <LazyLoadImage effect='blur' src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
        </div>
    );
};

export default CardFeed;
