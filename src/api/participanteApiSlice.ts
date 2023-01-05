import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import baseUrl from "./baseUrl";
import { ParticipanteModel, RedacaoModel } from "./types";

interface RegisterQueryArgs {
  nome: string;
  cpf: string;
  nascimento: string;
  curso: number;
  email: string;
  telefone: string;
  modalidade: "online" | "presencial";
}

interface AuthenticatedArgs {
  /**
   * O CPF do participante atual, sem pontuação
   */
  cpf: string;

  /**
   * A data de nascimento do participante atual, formato YYYY-MM-DD
   */
  nascimento: string;
}

interface RedacaoAtualizarArgs extends AuthenticatedArgs {
  /**
   * O corpo do texto
   */
  corpo: string;
}

/**
 * Transforma os campos de CPF e data de nascimento para serem
 * usados como header nos requests da API de participantes.
 * Não é uma medida de segurança, mas sim busca evitar problemas
 * de encoding com caracteres potencialmente proibidos num header HTTP.
 */
const tokenParticipante = (cpf: string, nascimento: string) => {
  /**
   * Dois campos em base64, juntos por ":"
   * ```
   * btoa("78249442474") + ":" + btoa("2023-01-01")
   * -> "NzgyNDk0NDI0NzQ=:MjAyMy0wMS0wMQ=="
   * ```
   */

  return btoa(cpf) + ":" + btoa(nascimento);
};

export const participanteApiSlice = createApi({
  reducerPath: "apiParticipante",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["participantes"],
  endpoints: (builder) => ({
    /**
     * Request para o cadastro de um participante.
     * Retorna o objeto Participante cadastrado.
     */
    cadastrarParticipante: builder.mutation<ParticipanteModel, RegisterQueryArgs>({
      query: (queryArgs) => ({
        method: "POST",
        url: "/participante/register",
        body: {
          nome: queryArgs.nome,
          email: queryArgs.email,
          telefone: queryArgs.telefone.replace(/[^\d]/g, ""),
          dataNascimento: queryArgs.nascimento,
          cpf: queryArgs.cpf.replace(/[^\d]/g, ""),
          cursoId: queryArgs.curso,
          provaOnline: queryArgs.modalidade === "online",
        },
      }),
      invalidatesTags: ["participantes"],
    }),

    /**
     * Request para o login de um participante.
     * Retorna um objeto Participante.
     */
    loginParticipante: builder.mutation<ParticipanteModel, AuthenticatedArgs>({
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

    /**
     * Dá o início a uma redação
     */
    iniciarRedacao: builder.mutation<RedacaoModel, AuthenticatedArgs>({
      query: ({ cpf, nascimento }) => ({
        method: "POST",
        url: "/participante/redacao/iniciar",
        headers: {
          "x-authorization": tokenParticipante(cpf, nascimento),
        },
      }),
    }),

    /**
     * Chamado pelo cliente periodicamente conforme a redação está sendo escrita.
     * Contém o corpo atual da redação. Esse método atualiza o "fimTimestamp" da redação,
     * mesmo que ela não esteja concluída.
     */
    atualizarRedacao: builder.mutation<RedacaoModel, RedacaoAtualizarArgs>({
      query: ({ cpf, nascimento, corpo }) => ({
        method: "POST",
        url: "/participante/redacao/atualizar",
        body: {
          corpo,
        },
        headers: {
          "x-authorization": tokenParticipante(cpf, nascimento),
        },
      }),
    }),

    /**
     * Conclui uma redação em progresso. Isso impede a redação de ser escrita.
     */
    finalizarRedacao: builder.mutation<RedacaoModel, AuthenticatedArgs>({
      query: ({ cpf, nascimento }) => ({
        method: "POST",
        url: "/participante/redacao/concluir",
        headers: {
          "x-authorization": tokenParticipante(cpf, nascimento),
        },
      }),
    }),

    /**
     * Busca a redação atual do participante.
     */
    redacaoAtual: builder.query<RedacaoModel | null, AuthenticatedArgs>({
      keepUnusedDataFor: 0,
      query: ({ cpf, nascimento }) => ({
        method: "GET",
        url: "/participante/redacao/atual",
        headers: {
          "x-authorization": tokenParticipante(cpf, nascimento),
        },
      }),
    }),
  }),
});

export const {
  useIniciarRedacaoMutation,
  useAtualizarRedacaoMutation,
  useFinalizarRedacaoMutation,
  useRedacaoAtualQuery,
  useCadastrarParticipanteMutation,
  useLoginParticipanteMutation,
} = participanteApiSlice;
