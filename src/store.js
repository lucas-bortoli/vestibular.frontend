/**
 * store.js: a Redux Store do app.
 */

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { restritoReducer } from "./features/restrito/restritoSlice";

export const store = configureStore({
  reducer: {
    restrito: restritoReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (defaults) => defaults().concat(apiSlice.middleware),
});
