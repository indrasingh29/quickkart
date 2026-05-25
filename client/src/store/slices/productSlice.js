import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/http.js";

export const fetchProducts = createAsyncThunk("products/fetch", async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
});

export const fetchCategories = createAsyncThunk("products/categories", async () => {
  const { data } = await api.get("/products/categories");
  return data.categories;
});

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], categories: [], page: 1, pages: 1, loading: false, query: "" },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  }
});

export const { setQuery } = productSlice.actions;
export default productSlice.reducer;
