import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import * as api from './apiService';

const initialState: any = {
    user: {}
}

export const fetchUser = createAsyncThunk(
    'user/fetchUser',

    async (_, thunkAPI) => {

        const { data } : any = await api.getUsetDetails();

        return data;
    }
)

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state, aciton) => {

        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload
        })
    }

});


export const selectUser = (state: RootState) => state.user.user

export default UserSlice.reducer;