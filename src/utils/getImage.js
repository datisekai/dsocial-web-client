const HOST_IMAGE = import.meta.env.VITE_APP_SERVER_URL + '/uploads/';

const noImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';

const getImage = (image) => {
    if (image == null) return noImage;
    const isUrl = image.indexOf('https://ui-avatars.com/api/?name') === -1;
    if (!isUrl) {
        return image;
    }
    return HOST_IMAGE + image;
};

export const getVideo = (video) => {
    return HOST_IMAGE + video;
};

export default getImage;
