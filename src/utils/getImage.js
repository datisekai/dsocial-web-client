const HOST_IMAGE = import.meta.env.VITE_APP_SERVER_URL + '/uploads/';

const getImage = (image) => {
    if (image == null) {
        console.log('check1');
        return HOST_IMAGE + 'noCoverImage.png';
    }
    const isUrl = image.indexOf('https://ui-avatars.com/api/?name') === -1;
    if (!isUrl) {
        console.log('check2');
        return image;
    }
    console.log('check3');
    return HOST_IMAGE + image;
};

export default getImage;
