import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
      state.auth.userId = action.payload.userId;
      state.auth.token = action.payload.token;
      state.auth.roles = action.payload.roles;
      state.auth.nameOfUser = action.payload.user.nome;
      state.auth.userName = action.payload.user.username;
    },
  },
});

export const { loginFinish } = restritoSlice.actions;
export const restritoReducer = restritoSlice.reducer;
export default restritoSlice;
