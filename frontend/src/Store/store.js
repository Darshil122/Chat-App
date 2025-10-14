import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import chatSlice from "../features/chatSlice";

export const store = configureStore({
    reducer:{
        user: userSlice,
        chat: chatSlice,
    },
});