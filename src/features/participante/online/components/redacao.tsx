import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useAtualizarRedacaoMutation } from "../../../../api/participanteApiSlice";
import { RedacaoModel } from "../../../../api/types";
import { RootState } from "../../../../store";
import styles from "./redacao.module.css";

interface Props {
  /**
   * A quantidade máxima de caracteres no texto
   */
  maxLength: number;

  /**
   * O corpo mais recente da redação, salva no servidor
   */
  redacaoAtual: RedacaoModel;

  /**
   * Callback de submissão da redação
   */
  onSubmit: () => void;

  /**
   * Quanto tempo o candidato tem para concluir a redação
   */
  tempoTotal: number;
}

const RedacaoEditor = ({ maxLength, redacaoAtual, onSubmit, tempoTotal }: Props) => {
  const dadosParticipante = useSelector((state: RootState) => state.participante.dados);
  const [apiAtualizarRedacaoTrigger, apiAtualizarRedacao] = useAtualizarRedacaoMutation();

  const [_, setAtualizarTela] = useState(0);
  const tempoRestanteRef = useRef(tempoTotal);
  const corpoTexto = useRef(redacaoAtual.corpo);

  useEffect(() => {
    const timer = setInterval(() => {
      let serverTimeLastUpdate = redacaoAtual.fimTimestamp;
      let tempoRestante = redacaoAtual.tempoRestante;

      if (apiAtualizarRedacao.data) {
        serverTimeLastUpdate = apiAtualizarRedacao.data.fimTimestamp;
        tempoRestante = apiAtualizarRedacao.data.tempoRestante;
      }

      let timeSinceLastUpdate = Date.now() - serverTimeLastUpdate;

      tempoRestanteRef.current = tempoRestante - timeSinceLastUpdate;

      setAtualizarTela(Date.now());
    }, 500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      sincronizar();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const submitTimeout = setInterval(() => {
      console.log("Tempo restante: " + tempoRestanteRef.current);
      if (tempoRestanteRef.current < 1000) {
        console.log("Tempo esgotado!");
        entregarRedacao();
      }
    }, 1000);

    return () => clearInterval(submitTimeout);
  }, []);

  const abrirEdital = () => {
    window.open("/editalRedacao.pdf", "_blank", "width=640,height=720");
  };

  const sincronizar = async () => {
    console.log("Sync...");

    const r = await apiAtualizarRedacaoTrigger({
      cpf: dadosParticipante.cpf,
      nascimento: dadosParticipante.dataNascimento,
      corpo: corpoTexto.current,
    }).unwrap();

    tempoRestanteRef.current = r.tempoRestante;
  };

  const entregarRedacao = async () => {
    console.log("Entregando redação...");
    onSubmit();
  };

  const tempoRestanteString = () => {
    return new Date(Math.max(tempoRestanteRef.current || 0, 0))
      .toISOString()
      .split("T")[1]
      .slice(0, 8);
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.page}>
          <textarea
            placeholder="Escreva sua redação aqui..."
            spellCheck={false}
            onChange={(ev) => (corpoTexto.current = ev.target.value)}
            onBlur={() => sincronizar()}
            maxLength={maxLength}
            defaultValue={redacaoAtual.corpo}></textarea>
        </div>
        <div className={styles.info}>
          <span>{tempoRestanteString()}</span>
          <span>
            {corpoTexto.current.length}/{maxLength}
          </span>
        </div>
      </div>
      <div className={styles.actionBar}>
        <button className="iconButton" onClick={() => abrirEdital()}>
          <i className="document"></i> Visualizar tema da redação
        </button>
        <span className={styles.spacing}></span>
        <button className="iconButton light primary" onClick={() => entregarRedacao()}>
          <i className="sendTest"></i> Entregar redação
        </button>
      </div>
    </div>
  );
};

export default RedacaoEditor;
