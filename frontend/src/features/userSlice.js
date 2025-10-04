import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userInfo = createAsyncThunk(
  "user/userInfo",
  async (id, { rejectWithValue }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data.user;
      //   console.log("fetched user from userSlice", result);
      return result;
    } else {
      return rejectWithValue("No token found");
    }
  }
);

export const searchUsers = createAsyncThunk(
  "user/serachUsers",
  async (query, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/user?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    //   console.log("search users response", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search users"
      );
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userProfile: null,
    searchResults:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(userInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
