import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appReducer from "./reducers/appSlice";
import scrollReducer from "./reducers/scrollSlice";
import sidebarReducer from "./reducers/sidebarSlice";
import authReducer from "./reducers/authSlice";
import chatReducer from "./reducers/chatSlice";
import userChatsSlice from "./reducers/userChatsSlice";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'sidebar'],
};

const persistedReducer = persistReducer(persistConfig,
  combineReducers({
    auth: authReducer,
    chat: chatReducer,
    app: appReducer,
    scroll: scrollReducer,
    sidebar: sidebarReducer,
    userChats: userChatsSlice
  })
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };