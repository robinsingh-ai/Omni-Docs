
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatSlice";
import dataReducer from "./reducers/dataSlice";
import scrollReducer from "./reducers/scrollSlice";
import sidebarReducer from "./reducers/sidebarSlice";
import { authReducer } from "./reducers/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    data: dataReducer,
    scroll: scrollReducer,
    sidebar: sidebarReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

