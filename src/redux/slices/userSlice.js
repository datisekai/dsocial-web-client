import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
};
export const userSlice = createSlice({
    // action creator
    name: 'user',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },

        removeTokenAndUser: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
        setTokenAndUser: (state, action) => {
            const { user = null, token = null } = action.payload;
            state.user = user;
            state.token = token;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setToken, setUser, removeTokenAndUser, setTokenAndUser } = userSlice.actions;

export default userSlice.reducer;
