import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "./baseUrl.js";
import { AttachmentOpaqueModel, CursoCampusJoin, ProcessoSeletivoConfigPartial } from "./types.js";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["cursos", "campus"],
  endpoints: (builder) => ({
    /**
     * Busca uma lista de cursos.
     */
    getCursos: builder.query<{ [key: string]: CursoCampusJoin[] }, void>({
      query: () => "/processoSeletivo/curso/list",
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
      query: () => "/processoSeletivo/campus/list",
      providesTags: ["campus"],
    }),

    /**
     * Retorna os metadados de um attachment.
     */
    getAttachmentOpaque: builder.query<AttachmentOpaqueModel, { id: string }>({
      query: ({ id }) => ({
        url: "/attachments/opaque/" + id,
      }),
    }),

    /**
     * Retorna as configurações do processo seletivo atual.
     */
    getConfig: builder.query<ProcessoSeletivoConfigPartial, void>({
      query: () => ({
        url: "/processoSeletivo/config",
      }),
    }),
  }),
});

export const {
  useGetCursosQuery,
  useGetCampusQuery,
  useGetAttachmentOpaqueQuery,
  useGetConfigQuery,
} = apiSlice;
