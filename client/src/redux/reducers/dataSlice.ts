// src/store/dataSlice.ts
import { createSlice } from '@reduxjs/toolkit';

export type DataSource = 'crust_data' | 'nextjs' | 'flutter';

const initialState: { dataSource: DataSource } = {
    dataSource: 'nextjs',
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
