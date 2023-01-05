import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import Redacao from "./components/redacao";

import {
  useFinalizarRedacaoMutation,
  useIniciarRedacaoMutation,
  useRedacaoAtualQuery,
} from "../../../api/participanteApiSlice";
import { RootState } from "../../../store";
import { LoadingPage } from "../../components/loadingPage";

const ProvaOnlineSubpage = () => {
  const navigate = useNavigate();
  const dadosParticipante = useSelector((state: RootState) => state.participante.dados);

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

  return (
    <>
      <h2>Prova online</h2>

      {/* Se a redação não está iniciada... */}
      {redacaoAtualQuery.data === null && (
        <>
          <p>Ao iniciar a redação, você terá até duas horas para concluí-la.</p>
          <div>
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
    </>
  );
};

export default ProvaOnlineSubpage;
