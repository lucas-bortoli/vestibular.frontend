import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import baseUrl from "./baseUrl";

export const participanteApiSlice = createApi({
  reducerPath: "apiParticipante",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["participantes"],
  endpoints: (builder) => ({
    cadastrarParticipante: builder.mutation({
      query: ({ nome, cpf, nascimento, curso, email, telefone, modalidade }) => ({
        method: "POST",
        url: "/participante/register",
        body: {
          nome,
          email,
          telefone: telefone.replace(/[^\d]/g, ""),
          dataNascimento: nascimento,
          cpf: cpf.replace(/[^\d]/g, ""),
          cursoId: curso,
          provaOnline: modalidade === "online",
        },
      }),
      invalidatesTags: ["participantes"],
    }),

    loginParticipante: builder.mutation({
      query: ({ cpf, nascimento }) => ({
        method: "POST",
        url: "/participante/login",
        body: {
          cpf,
          birthDate: nascimento,
        },
      }),
      invalidatesTags: ["participantes"],
    }),
  }),
});

export const { useCadastrarParticipanteMutation, useLoginParticipanteMutation } =
  participanteApiSlice;
