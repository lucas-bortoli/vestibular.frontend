import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "./baseUrl.js";
import { CursoCampusJoin } from "./types.js";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["cursos", "campus", "auth", "notas", "participantes"],
  endpoints: (builder) => ({
    /**
     * Busca uma lista de cursos.
     */
    getCursos: builder.query<{ [key: string]: CursoCampusJoin[] }, void>({
      query: () => "/curso/list",
      providesTags: ["cursos"],
      transformResponse: (response) => {
        const groups = {};

        for (const curso of response as CursoCampusJoin[]) {
          if (!groups[curso.campusNome]) {
            groups[curso.campusNome] = [];
          }

          groups[curso.campusNome].push(curso);
        }

        return groups;
      },
    }),

    getCampus: builder.query({
      query: () => "/curso/listCampus",
      providesTags: ["campus"],
    }),

    userLogin: builder.mutation({
      query: ({ username, password }) => ({
        method: "POST",
        url: "/restrito/login",
        body: { username, password },
      }),
      invalidatesTags: ["auth", "participantes"],
    }),

    listaParticipantes: builder.query({
      query: ({ token }) => ({
        url: "/restrito/participantes",
        headers: {
          authorization: token,
        },
      }),
      providesTags: ["participantes"],
    }),

    getAllNotas: builder.query({
      query: ({ token }) => ({
        url: "/restrito/notas",
        headers: {
          authorization: token,
        },
      }),
      providesTags: ["notas"],
    }),
  }),
});

export const {
  useGetCursosQuery,
  useGetAllNotasQuery,
  useGetCampusQuery,
  useUserLoginMutation,
  useListaParticipantesQuery,
} = apiSlice;
