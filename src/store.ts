import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { participanteApiSlice } from "./api/participanteApiSlice";
import { participanteReducer } from "./features/participante/participanteSlice";
import { restritoApiSlice } from "./api/restrito/slice";
import { restritoReducer } from "./features/restrito/restritoSlice";

/**
 * A Redux Store do app.
 */
export const store = configureStore({
  reducer: {
    participante: participanteReducer,
    restrito: restritoReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [participanteApiSlice.reducerPath]: participanteApiSlice.reducer,
    [restritoApiSlice.reducerPath]: restritoApiSlice.reducer,
  },
  middleware: (defaults) =>
    defaults()
      .concat(apiSlice.middleware)
      .concat(participanteApiSlice.middleware)
      .concat(restritoApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
