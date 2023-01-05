import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

import baseUrl from "../baseUrl.js";
import { NotasModel, ParticipanteModel, RedacaoModel } from "../types.js";

interface RestritoAuth {
  /**
   * O token de autenticação retornado do endpoint de login. Usado para visualizar
   * e interagir com dados críticos da API.
   */
  token: string;
}

interface PutNotasArgs {
  /**
   * As notas a serem lançadas, de um ou mais participantes.
   */
  lancamentos: NotasModel[];
}

export const restritoApiSlice = createApi({
  reducerPath: "restritoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["auth", "notas", "notasObject", "participantes"],
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: ({ username, password }) => ({
        method: "POST",
        url: "/restrito/login",
        body: { username, password },
      }),
      invalidatesTags: ["auth", "participantes"],
    }),

    listaParticipantes: builder.query<ParticipanteModel[], RestritoAuth>({
      query: ({ token }) => ({
        url: "/restrito/participantes",
        headers: {
          authorization: token,
        },
      }),
      providesTags: ["participantes"],
    }),

    /**
     * Retorna uma lista de todas as notas lançadas no sistema
     */
    getAllNotas: builder.query<NotasModel[], RestritoAuth>({
      query: ({ token }) => ({
        url: "/restrito/notas",
        headers: {
          authorization: token,
        },
      }),
      providesTags: ["notas"],
    }),

    /**
     * Retorna um objeto de todas as notas lançadas no sistema.
     * Esse objeto tem suas chaves sendo o id do participante, enquanto os valores
     * são NotasModel.
     */
    getAllNotasObject: builder.query<{ [key: number]: NotasModel }, RestritoAuth>({
      query: ({ token }) => ({
        url: "/restrito/notas",
        headers: {
          authorization: token,
        },
      }),
      transformResponse: (response: NotasModel[]) => {
        const associative: { [key: number]: NotasModel } = {};

        for (const nota of response) {
          associative[nota.participanteId] = nota;
        }

        return associative;
      },
      providesTags: ["notasObject"],
    }),

    /**
     * Retorna uma nota específica de um participante.
     */
    getNota: builder.query<NotasModel, { participanteId: number } & RestritoAuth>({
      query: ({ participanteId, token }) => ({
        url: "/restrito/notas/" + participanteId,
        headers: {
          authorization: token,
        },
      }),
    }),

    putNotas: builder.mutation<true, PutNotasArgs & RestritoAuth>({
      query: ({ lancamentos, token }) => ({
        method: "POST",
        url: "/restrito/notas",
        body: lancamentos,
        headers: {
          authorization: token,
        },
      }),
      invalidatesTags: ["notasObject", "notas"],
    }),

    /**
     * Retorna a redação de um participante específico.
     */
    getRedacao: builder.query<RedacaoModel, { participanteId: number } & RestritoAuth>({
      query: ({ token, participanteId }) => ({
        url: "/restrito/redacao/" + participanteId,
        headers: {
          authorization: token,
        },
      }),
    }),
  }),
});

export const {
  useGetAllNotasObjectQuery,
  useGetAllNotasQuery,
  useGetNotaQuery,
  useGetRedacaoQuery,
  useListaParticipantesQuery,
  usePutNotasMutation,
  useUserLoginMutation,
} = restritoApiSlice;
