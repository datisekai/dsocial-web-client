const HOST_IMAGE = import.meta.env.VITE_APP_SERVER_URL + '/uploads/';

const getImage = (image) => {
    if (image == null) return HOST_IMAGE + 'noCoverImage.png';
    const isUrl = image.indexOf('https://ui-avatars.com/api/?name') === -1;
    if (!isUrl) {
        return image;
    }
    return HOST_IMAGE + image;
};

export default getImage;
