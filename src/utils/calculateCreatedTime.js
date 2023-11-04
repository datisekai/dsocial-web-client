const calculateCreatedTime = (timeCreated) => {
    let periods = {
        năm: 365 * 30 * 24 * 60 * 60 * 1000,
        tháng: 30 * 24 * 60 * 60 * 1000,
        tuần: 7 * 24 * 60 * 60 * 1000,
        ngày: 24 * 60 * 60 * 1000,
        giờ: 60 * 60 * 1000,
        phút: 60 * 1000,
    };

    let diff = Date.now() - +timeCreated;

    for (const key in periods) {
        if (diff >= periods[key]) {
            let result = Math.floor(diff / periods[key]);
            return `${result} ${key} trước`;
        }
    }

    return 'Ngay bây giờ';
};
export default calculateCreatedTime;
