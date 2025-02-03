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

import chatReducer from "./reducers/chatSlice";
import dataReducer from "./reducers/dataSlice";
import scrollReducer from "./reducers/scrollSlice";
import sidebarReducer from "./reducers/sidebarSlice";
import authReducer from "./reducers/authSlice";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth']
};

const persistedReducer = persistReducer(persistConfig,
  combineReducers({
    auth: authReducer,
    chat: chatReducer,
    data: dataReducer,
    scroll: scrollReducer,
    sidebar: sidebarReducer,
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

persistor.subscribe(() => {
  console.log("Persistor state Update:", persistor.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };