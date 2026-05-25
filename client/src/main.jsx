import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { persistor, store } from "./store/store.js";
import { router } from "./router.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div className="screen-center">Loading QuickKart...</div>} persistor={persistor}>
        <Suspense fallback={<div className="screen-center">Loading...</div>}>
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </Suspense>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
