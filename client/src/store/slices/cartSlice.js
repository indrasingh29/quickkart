import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/http.js";

export const syncCart = createAsyncThunk("cart/sync", async () => {
  const { data } = await api.get("/cart");
  return data;
});

export const updateCartItem = createAsyncThunk("cart/updateItem", async ({ productId, quantity }) => {
  const { data } = await api.post("/cart/items", { productId, quantity });
  return data;
});

export const applyCoupon = createAsyncThunk("cart/applyCoupon", async (code) => {
  const { data } = await api.post("/cart/coupon", { code });
  return data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: { items: [] }, totals: { subtotal: 0, deliveryFee: 0, discount: 0, total: 0 }, loading: false },
  reducers: {
    resetCart: (state) => {
      state.cart = { items: [] };
      state.totals = { subtotal: 0, deliveryFee: 0, discount: 0, total: 0 };
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher((action) => action.type.startsWith("cart/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"), (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.totals = action.payload.totals;
      })
      .addMatcher((action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"), (state) => {
        state.loading = false;
      });
  }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
