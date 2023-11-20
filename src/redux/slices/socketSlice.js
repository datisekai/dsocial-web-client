import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

const initialState = {
    socket: null,
    userActives: [],
};

export const socketSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        initSocket: (state) => {
            state.socket = io(import.meta.env.VITE_APP_SOCKET_URL);
        },
        setUserActives: (state, action) => {
            state.userActives = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { initSocket, setUserActives } = socketSlice.actions;

export default socketSlice.reducer;
