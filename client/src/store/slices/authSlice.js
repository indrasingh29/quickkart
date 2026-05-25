import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/http.js";

export const login = createAsyncThunk("auth/login", async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
});

export const register = createAsyncThunk("auth/register", async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, loading: false },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher((action) => action.type.startsWith("auth/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith("auth/") && action.type.endsWith("/fulfilled"), (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addMatcher((action) => action.type.startsWith("auth/") && action.type.endsWith("/rejected"), (state) => {
        state.loading = false;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
