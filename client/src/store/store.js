import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice.js";
import cartReducer from "./slices/cartSlice.js";
import productReducer from "./slices/productSlice.js";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer
});

const persistedReducer = persistReducer(
  {
    key: "quickkart-client",
    storage,
    whitelist: ["auth", "cart"]
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);
