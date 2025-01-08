
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatSlice";

const store = configureStore({
  reducer: chatReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

