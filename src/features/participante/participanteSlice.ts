import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParticipanteModel } from "../../api/types.js";

interface ParticipanteState {
  dados: {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    provaOnline: boolean;
    telefone: string;
    cursoId: number;
  };
}

/**
 * O estado inicial da página de participantes.
 * Esse objeto especifica os campos disponíveis através da API de
 * useSelector() do Redux Toolkit.
 */
const initialState: ParticipanteState = {
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
    /**
     * Ação que conclui o login de um participante.
     * @param action Os dados do participante atualmente logado.
     */
    loginFinish: (state, action: PayloadAction<ParticipanteModel>) => {
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
