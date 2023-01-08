import apiBaseUrl from "../../../api/baseUrl";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";

import Redacao from "./components/redacao";
import {
  useFinalizarRedacaoMutation,
  useIniciarRedacaoMutation,
  useRedacaoAtualQuery,
} from "../../../api/participanteApiSlice";
import { RootState } from "../../../store";
import { LoadingPage } from "../../components/loadingPage";
import { useGetConfigQuery } from "../../../api/apiSlice";
import { msParaHumano } from "../../../utils";

const ProvaOnlineSubpage = () => {
  const navigate = useNavigate();
  const dadosParticipante = useSelector((state: RootState) => state.participante.dados);
  const configQuery = useGetConfigQuery();
  const redacaoAtualQuery = useRedacaoAtualQuery({
    cpf: dadosParticipante.cpf,
    nascimento: dadosParticipante.dataNascimento,
  });

  const [apiIniciarRedacao, apiIniciarRedacaoStatus] = useIniciarRedacaoMutation();
  const [apiConcluirRedacao, apiConcluirRedacaoStatus] = useFinalizarRedacaoMutation();

  useEffect(() => {
    if (!dadosParticipante.provaOnline) navigate("/participante/perfil");
  });

  /**
   * Chamado quando o usuário inicia a redação.
   */
  useEffect(() => {}, [apiIniciarRedacaoStatus.isSuccess, redacaoAtualQuery.isSuccess]);

  // Se não há um participante logado, sair da página
  if (!dadosParticipante.provaOnline) {
    return null;
  }

  // Se está carregando um request, aguardar...
  if (
    redacaoAtualQuery.isFetching ||
    apiIniciarRedacaoStatus.isLoading ||
    apiConcluirRedacaoStatus.isLoading
  ) {
    return <LoadingPage />;
  }

  const iniciarRedacao = async () => {
    await apiIniciarRedacao({
      cpf: dadosParticipante.cpf,
      nascimento: dadosParticipante.dataNascimento,
    }).unwrap();

    redacaoAtualQuery.refetch();
  };

  const concluirRedacao = async () => {
    if (apiConcluirRedacaoStatus.isUninitialized) {
      await apiConcluirRedacao({
        cpf: dadosParticipante.cpf,
        nascimento: dadosParticipante.dataNascimento,
      }).unwrap();

      redacaoAtualQuery.refetch();
    }
  };

  const dataHora = (d: number): string => {
    return new Date(d).toLocaleString("pt-BR");
  };

  const abrirEdital = () => {
    const url = apiBaseUrl + "/attachments/data/processo_seletivo_edital";
    window.open(url, "_blank", "width=640,height=720");
  };

  return (
    <>
      <h2>Prova online</h2>

      {/* Se a redação não está iniciada... */}
      {redacaoAtualQuery.data === null && !apiIniciarRedacaoStatus.isError && (
        <>
          <p>Ao iniciar a redação, você terá até duas horas para concluí-la.</p>
          {configQuery.isSuccess && (
            <div style={{ marginBottom: "1rem" }}>
              <p>Horários do processo seletivo:</p>
              <table>
                <thead />
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Início</td>
                    <td>{dataHora(configQuery.data.processoSeletivoInicioUnix)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Fim</td>
                    <td>{dataHora(configQuery.data.processoSeletivoFimUnix)}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: "1rem", fontWeight: "bold" }}>
                      Tempo para a entrega da redação
                    </td>
                    <td>{msParaHumano(configQuery.data.redacaoTempo)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={{ marginRight: "0.5rem" }} onClick={() => abrirEdital()}>
              Ver edital
            </button>
            <button className="primary" onClick={() => iniciarRedacao()}>
              Iniciar redação
            </button>
          </div>
        </>
      )}

      {/* Se a redação está em progresso... */}
      {redacaoAtualQuery.isSuccess &&
        redacaoAtualQuery.data &&
        !redacaoAtualQuery.data.concluido && (
          <>
            <Redacao
              tempoTotal={redacaoAtualQuery.data.tempoRestante}
              maxLength={720}
              redacaoAtual={redacaoAtualQuery.data}
              onSubmit={() => concluirRedacao()}></Redacao>
          </>
        )}

      {/* Se a redação está concluída... */}
      {redacaoAtualQuery.isSuccess &&
        redacaoAtualQuery.data &&
        redacaoAtualQuery.data.concluido && (
          <>
            <p>Sua redação está concluída.</p>
          </>
        )}

      {apiIniciarRedacaoStatus.isError && (apiIniciarRedacaoStatus.error as { data }).data && (
        <>
          {/* Mostrar mensagem do servidor */}
          <p>{((apiIniciarRedacaoStatus.error as { data }).data as Error).message}</p>
        </>
      )}
    </>
  );
};

export default ProvaOnlineSubpage;
