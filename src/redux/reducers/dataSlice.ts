// src/store/dataSlice.ts
import { createSlice } from '@reduxjs/toolkit';

export type DataSource = {
    dataSource: 'crust-data' | 'nextjs-sitemap' | 'flutter-sitemap';
};

const initialState: DataSource = {
    dataSource: 'nextjs-sitemap', // Default value
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setDataSource: (state, action) => {
            state.dataSource = action.payload;
        },
    },
});

export const { setDataSource } = dataSlice.actions;
export default dataSlice.reducer;
