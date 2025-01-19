
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatSlice";
import dataReducer from "./reducers/dataSlice";
import scrollReducer from "./reducers/scrollSlice";
const store = configureStore({
  reducer: {
    chat: chatReducer,
    data: dataReducer,
    scroll: scrollReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

