import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import chatSlice from "../features/chatSlice";
import messageSlice from "../features/messageSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  user: userSlice,
  chats: chatSlice,
  messages: messageSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
