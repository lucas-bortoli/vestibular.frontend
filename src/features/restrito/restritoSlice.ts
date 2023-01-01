import { createSlice } from "@reduxjs/toolkit";

interface RestritoState {
  isLoggedIn: boolean;
  auth: {
    userId: number;
    token: string;
    roles: string[];
    userName: string;
    nameOfUser: string;
  };
}

const initialState: RestritoState = {
  isLoggedIn: false,
  auth: {
    userId: -1,
    token: null,
    roles: [],
    userName: null,
    nameOfUser: null,
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
  },
});

export const { loginFinish, logout } = restritoSlice.actions;
export const restritoReducer = restritoSlice.reducer;
export default restritoSlice;
