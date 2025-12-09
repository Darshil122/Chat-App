import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

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
      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

//add user to group
export const addUserToGroup = createAsyncThunk(
  "chats/addUserToGroup",
  async ({chatId, uname},{rejectWithValue}) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try{
      //find userId by uname
      const userRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/user?search=${uname}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = userRes.data[0];
      if (!user) return rejectWithValue("User not found");

      //add user to group
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/groupadd`,
        { chatId, userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      // console.log(response.data.addUserToGroup);
      return response.data.addUserToGroup;
    }catch(err){
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

//remove user from group
export const removeUserFromGroup = createAsyncThunk(
  "chats/removeUserFromGroup",
  async ({ chatId, userId }, { rejectWithValue }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/groupremove`,
        { chatId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      return response.data.removedFromGroup;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove user from group"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chats: [],
    chat: null,
    selectedChat: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedChat(state, action){
      state.selectedChat = action.payload;
    },
  },
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
      // Rename group
      .addCase(renameGroup.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChat = action.payload;

        state.selectedChat = updatedChat;

        const index = state.chats.findIndex(
          (chat) => chat._id === updatedChat._id
        );
        if (index !== -1) {
          state.chats[index] = updatedChat;
        }
      })
      // Add user
      .addCase(addUserToGroup.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChat = action.payload;

        state.selectedChat = updatedChat;

        const index = state.chats.findIndex(
          (chat) => chat._id === updatedChat._id
        );

        if (index !== -1) {
          state.chats[index] = updatedChat;
        }
      })
      // Remove user
      .addCase(removeUserFromGroup.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChat = action.payload;

        state.selectedChat = updatedChat;

        const index = state.chats.findIndex(
          (chat) => chat._id === updatedChat._id
        );

        if (index !== -1) {
          state.chats[index] = updatedChat;
        }
      });
  },
});

export const { setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
