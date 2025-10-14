import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const accessChat = createAsyncThunk(
  "chats/accessChat",
  async (userId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    console.log("accessChat userId:", userId);
    console.log("user token:", token);

    if (token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("accessChat response:", response.data);
      return response.data;
    } catch (err) {
      console.error("accessChat error:", err.response?.data || err.message);
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
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(accessChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
        state.error = null;
      })
      .addCase(accessChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch chats";
      });
  },
});

export default chatSlice.reducer;
