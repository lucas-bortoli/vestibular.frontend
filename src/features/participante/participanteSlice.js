import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dados: {
    id: -1,
    nome: "",
    cpf: "",
    dataNascimento: "0-0-0",
    email: "",
    provaOnline: false,
    telefone: "",
    cursoId: -1,
  },
};

const participanteSlice = createSlice({
  initialState,
  name: "participante",
  reducers: {
    loginFinish: (state, action) => {
      state.dados.id = action.payload.id;
      state.dados.nome = action.payload.nome;
      state.dados.cpf = action.payload.cpf;
      state.dados.dataNascimento = action.payload.dataNascimento;
      state.dados.email = action.payload.email;
      state.dados.provaOnline = action.payload.provaOnline;
      state.dados.telefone = action.payload.telefone;
      state.dados.cursoId = action.payload.cursoId;
    },
  },
});

export const { loginFinish } = participanteSlice.actions;
export const participanteReducer = participanteSlice.reducer;
export default participanteSlice;
