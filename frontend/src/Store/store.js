import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import chatSlice from "../features/chatSlice";
import messageSlice from "../features/messageSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    chats: chatSlice,
    messages: messageSlice,
  },
});