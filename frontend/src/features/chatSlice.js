import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//access or create chat between logged in user and selected user
export const accessChat = createAsyncThunk(
  "chats/accessChat",
  async (userId, { rejectWithValue }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("access chat response", response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

//fetch all chats for logged in user
export const fetchChat = createAsyncThunk(
  "chats/fetchChat",
  async (_, { rejectWithValue }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("fetched chats from chatSlice", data);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

//Create group chat
export const createGroupChat = createAsyncThunk(
  "chats/createGroupChat",
  async ({ name, users }, { rejectWithValue }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/group`,
        {
          name,
          users: JSON.stringify(users),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

//Rename group
export const renameGroup = createAsyncThunk(
  "chats/renameGroup",
  async ({ chatId, chatName }, { rejectWithValue }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/rename`,
        { chatId, chatName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chats: [],
    chat: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Access chat
      .addCase(accessChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        state.loading = false;
        const newChat = action.payload;
        const chatExists = state.chats.find((chat) => chat._id === newChat._id);
        if (!chatExists) {
          state.chats.push(newChat);
        }
        state.chat = newChat;
        state.error = null;
      })
      .addCase(accessChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to access chat";
      })

      // Fetch all chats
      .addCase(fetchChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
        state.error = null;
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch chats";
      })
      // Create group chat
      .addCase(createGroupChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.push(action.payload);
        state.error = null;
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create group chat";
      })
      // Rename group chat
      .addCase(renameGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renameGroup.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChat = action.payload;
        const index = state.chats.findIndex((chat) => chat._id === updatedChat._id);
        if (index !== -1) {
          state.chats[index] = updatedChat;
        }
        state.error = null;
      })
      .addCase(renameGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to rename group chat";
      });
  },
});

export default chatSlice.reducer;
