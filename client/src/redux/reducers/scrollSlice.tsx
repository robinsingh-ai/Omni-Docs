import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScrollState {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
    isAtBottom: boolean;
}

const initialState: ScrollState = {
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    isAtBottom: true,
};

const scrollSlice = createSlice({
    name: 'scroll',
    initialState,
    reducers: {
        updateScroll(state, action: PayloadAction<{ scrollTop: number; scrollHeight: number; clientHeight: number }>) {
            const { scrollTop, scrollHeight, clientHeight } = action.payload;
            state.scrollTop = scrollTop;
            state.scrollHeight = scrollHeight;
            state.clientHeight = clientHeight;
            state.isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px buffer
        },
    },
});

export const { updateScroll } = scrollSlice.actions;
export default scrollSlice.reducer;
