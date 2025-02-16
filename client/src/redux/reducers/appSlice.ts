// src/store/dataSlice.ts
import { Agent, LLM_Model } from 'src/utils/Constants';
import { createSlice } from '@reduxjs/toolkit';

const initialState: { agent: Agent, model: LLM_Model, chatId?: string } = {
    agent: 'nextjs',
    model: 'llama3.1',
    chatId: undefined,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAgent: (state, action) => {
            state.agent = action.payload;
        },
        setModel: (state, action) => {
            state.model = action.payload;
        },
        setChatId: (state, action) => {
            state.chatId = action.payload;
        },
        resetAppSlice: (state) => {
            state.agent = 'nextjs';
            state.model = 'llama3.1';
            state.chatId = undefined;
        }
    },
});

export const { setAgent, setModel, setChatId } = appSlice.actions;
export default appSlice.reducer;
