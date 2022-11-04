import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../routes/userProfile/userSlice'
import jobStatsReducer from '../routes/job/jobStats/jobStatsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    jobStats: jobStatsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
