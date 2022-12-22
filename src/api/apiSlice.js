import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  tagTypes: ["cursos", "auth", "participantes"],
  endpoints: (builder) => ({
    /**
     * Busca uma lista de cursos.
     */
    getCursos: builder.query({
      query: () => "/curso/list",
      providesTags: ["cursos"],
      transformResponse: (response) => {
        const groups = {};

        for (const curso of response) {
          if (!groups[curso.campusNome]) {
            groups[curso.campusNome] = [];
          }

          groups[curso.campusNome].push(curso);
        }

        return groups;
      },
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
  }),
});

export const { useGetCursosQuery, useUserLoginMutation, useListaParticipantesQuery } = apiSlice;
