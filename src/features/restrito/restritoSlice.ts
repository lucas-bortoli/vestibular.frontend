import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotasModel } from "../../api/types";

interface RestritoState {
  isLoggedIn: boolean;
  auth: {
    userId: number;
    token: string;
    roles: string[];
    userName: string;
    nameOfUser: string;
  };
  notas: {
    // O instinto é usar um Map, mas a biblioteca Immer não deixa usar objetos
    // não serializáveis. Então, estou usando um objeto, onde as chaves são
    // os ids dos participantes, e os valores as notas.
    dirtyNotas: { [key: number]: NotasModel };
    dirtyNotasLength: number;
  };
}

const storedAuthState = JSON.parse(localStorage.getItem("authState"));
const storedIsLoggedInState = JSON.parse(localStorage.getItem("authIsLoggedIn"));

const initialState: RestritoState = {
  isLoggedIn: storedIsLoggedInState ?? false,
  auth: storedAuthState ?? {
    userId: -1,
    token: null,
    roles: [],
    userName: null,
    nameOfUser: null,
  },
  notas: {
    dirtyNotas: {},
    dirtyNotasLength: 0,
  },
};

const restritoSlice = createSlice({
  initialState,
  name: "restrito",
  reducers: {
    loginFinish: (state, action) => {
      state.isLoggedIn = true;
      state.auth.userId = action.payload.userId;
      state.auth.token = action.payload.token;
      state.auth.roles = action.payload.roles;
      state.auth.nameOfUser = action.payload.user.nome;
      state.auth.userName = action.payload.user.username;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.auth.userId = -1;
      state.auth.token = null;
      state.auth.roles = [];
      state.auth.nameOfUser = null;
      state.auth.userName = null;
    },

    /**
     * Quando uma nota é editada no painel de notas, ela é marcada como "dirty" - ou seja, notas que ainda
     * não foram salvas no banco de dados. Essa ação marca uma nota como dirty.
     */
    editNotas: (state, { payload }: PayloadAction<NotasModel>) => {
      // Verificar não há uma nota editada no objeto
      if (state.notas.dirtyNotas[payload.participanteId] === undefined) {
        state.notas.dirtyNotas[payload.participanteId] = payload;
        state.notas.dirtyNotasLength++;
      } else {
        state.notas.dirtyNotas[payload.participanteId] = payload;
      }
    },

    /**
     * Descarta alterações nas notas.
     */
    clearDirtyNotas: (state) => {
      state.notas.dirtyNotas = {};
      state.notas.dirtyNotasLength = 0;
    },
  },
});

export const { loginFinish, logout, editNotas, clearDirtyNotas } = restritoSlice.actions;
export const restritoReducer = restritoSlice.reducer;
export default restritoSlice;
