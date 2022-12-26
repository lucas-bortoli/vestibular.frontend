/**
 * store.js: a Redux Store do app.
 */

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { participanteApiSlice } from "./api/participanteApiSlice";
import { participanteReducer } from "./features/participante/participanteSlice";
import { restritoReducer } from "./features/restrito/restritoSlice";

export const store = configureStore({
  reducer: {
    participante: participanteReducer,
    restrito: restritoReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [participanteApiSlice.reducerPath]: participanteApiSlice.reducer,
  },
  middleware: (defaults) =>
    defaults().concat(apiSlice.middleware).concat(participanteApiSlice.middleware),
});
