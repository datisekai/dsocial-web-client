import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import FriendServices from '../../services/FriendService';

const initialState = {
    user: null,
    token: null,
    friends: [],
};

export const reloadMyFriend = createAsyncThunk('/my-friend', async () => {
    const res = await FriendServices.getMyFriend();
    return res.data;
});

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
    extraReducers: (builder) => {
        builder.addCase(reloadMyFriend.fulfilled, (state, action) => {
            state.friends = action.payload;
        });
    },
});

// Action creators are generated for each case reducer function
export const { setToken, setUser, removeTokenAndUser, setTokenAndUser } = userSlice.actions;

export default userSlice.reducer;
