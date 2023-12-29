import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    auth: false,
    _id: '',
    username: '',
    email: '',
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { _id, email, username, auth } = action.payload;
            
            state._id = _id;
            state.email = email;
            state.username = username;
            state.auth = auth;
        },
        resetUser: (state, action) => {
            state._id = '';
            state.email = '';
            state.username = '';
            state.auth = false;
        }
    }
})

export const { setUser , resetUser } = userSlice.actions;

export default userSlice.reducer;