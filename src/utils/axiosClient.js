import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_URL,
});

const upload = axios.create({
    baseURL: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_UPLOAD_NAME}/image/upload`,
});

export const uploadCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_APP_UPLOAD_PRESET);
    const imageData = await upload.post('/', formData);
    return imageData.data.url;
};

export const uploadServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const result = await axiosClient.post('/upload', formData);

    return result.data;
};
export const uploadsServer = async (files) => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
    }

    const result = await axiosClient.post('/uploads', formData);

    return result.data;
};

axiosClient.interceptors.request.use((config) => {
    if (config.url?.indexOf('login') !== -1) {
        return config;
    }

    if (!config?.headers) {
        throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
    }

    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token.replace(/"/g, '')}`;
    }

    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log(error);
        if (error?.response?.status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
                localStorage.removeItem('token');
            }
        }
        return Promise.reject(error?.response?.data);
    },
);
