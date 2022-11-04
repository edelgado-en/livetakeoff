import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import * as api from '../apiService';

const initialState: any = {
    stats: {
        purchase_order: '',
        comments_count: 0,
        photos_count: 0
    }
}

export const fetchJobStats = createAsyncThunk(
    'user/fetchStats',

    async (jobId: number, thunkAPI) => {
        const { data } : any = await api.getJobStats(jobId);

        return data;
    }
)

export const JobStatsSlice = createSlice({
    name: 'jobstats',
    initialState,
    reducers: {
        resetCommentsCount: (state) => {
            state.stats.comments_count = 0
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchJobStats.pending, (state, aciton) => {

        })
        .addCase(fetchJobStats.fulfilled, (state, action) => {
            state.stats = action.payload
        })
    }

});

export const {
    resetCommentsCount
} = JobStatsSlice.actions

export const selectJobStats = (state: RootState) => state.jobStats.stats

export default JobStatsSlice.reducer;