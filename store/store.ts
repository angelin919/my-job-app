import { configureStore } from '@reduxjs/toolkit';
import jobReducer from '../features/jobSlice';
import searchReducer from '../features/searchSlice';

export const store = configureStore({
  reducer: {
    jobs: jobReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;