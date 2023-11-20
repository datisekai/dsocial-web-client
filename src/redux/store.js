import { configureStore } from '@reduxjs/toolkit';
import { userSlice, socketSlice } from './slices';

export const store = configureStore({
    reducer: {
        user: userSlice,
        socket: socketSlice,
    },
});
