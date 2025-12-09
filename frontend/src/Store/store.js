import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import chatSlice from "../features/chatSlice";
import messageSlice from "../features/messageSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

// Persist ONLY user slice
const userPersistConfig = {
  key: "user",
  storage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userSlice), // persist only user
  chats: chatSlice, // NOT persisted
  messages: messageSlice, // NOT persisted
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
