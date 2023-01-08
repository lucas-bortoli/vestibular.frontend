import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { timestampToDate, timestampToTime } from "../../../utils";
import { usePutConfigMutation } from "../../../api/restrito/slice";
import { RootState } from "../../../store";
import { useAuthentication } from "../authHook";

import sharedStyle from "../restrito_shared.module.css";
import style from "./style.module.css";
import { useGetConfigQuery } from "../../../api/apiSlice";

const RestritoConfigPage = () => {
  const token = useSelector((state: RootState) => state.restrito.auth.token);
  const configQuery = useGetConfigQuery();
  const [doConfigMutation, configMutationStatus] = usePutConfigMutation();

  const [inicioDate, setInicioDate] = useState(timestampToDate(Date.now()) as string);
  const [inicioTime, setInicioTime] = useState(timestampToTime(Date.now()) as string);
  const [fimDate, setFimDate] = useState(timestampToDate(Date.now()) as string);
  const [fimTime, setFimTime] = useState(timestampToTime(Date.now()) as string);
  const [dirty, setDirty] = useState(false);
  const [reset, setReset] = useState(0);

  const [redacaoTempo, setRedacaoTempo] = useState(120);

  const saveConfig = () => {
    const [ano, mes, dia] = inicioDate.split("-").map((v) => parseInt(v));
    const [hora, minuto] = inicioTime.split(":").map((v) => parseInt(v));
    const [anoFim, mesFim, diaFim] = fimDate.split("-").map((v) => parseInt(v));
    const [horaFim, minutoFim] = fimTime.split(":").map((v) => parseInt(v));

    const inicio = new Date();
    const fim = new Date();

    inicio.setFullYear(ano, mes - 1, dia);
    inicio.setHours(hora, minuto, 0);

    fim.setFullYear(anoFim, mesFim - 1, diaFim);
    fim.setHours(horaFim, minutoFim, 0);

    if (fim < inicio) {
      console.log("O horário de fim do processo seletivo é inválido.");
    }

    console.log(inicio);
    console.log(fim);
    console.log("");

    // Atualizar configuração no servidor
    doConfigMutation({
      token,
      processoSeletivoInicioUnix: inicio.valueOf(),
      processoSeletivoFimUnix: fim.valueOf(),
      redacaoTempo: redacaoTempo * 60 * 1000,
    })
      .unwrap()
      .then(() => {
        setDirty(false);
        configQuery.refetch();
      });
  };

  useEffect(() => {
    if (configQuery.isSuccess) {
      const inicio = new Date(configQuery.data.processoSeletivoInicioUnix);
      const fim = new Date(configQuery.data.processoSeletivoFimUnix);

      setInicioDate(timestampToDate(inicio));
      setInicioTime(timestampToTime(inicio));
      setFimDate(timestampToDate(fim));
      setFimTime(timestampToTime(fim));
      setRedacaoTempo(Math.floor(configQuery.data.redacaoTempo / 60 / 1000));
      setDirty(false);
    }
  }, [configQuery.isSuccess, reset]);

  return (
    useAuthentication() && (
      <div>
        <h2>Processo seletivo</h2>
        <div className={style.field}>
          <h4>Data e hora do processo seletivo</h4>
          <p>Os horários são referentes ao seu fuso horário local.</p>
          <div className={style.dateTimeRow}>
            <input
              type="date"
              value={inicioDate}
              onChange={(ev) => {
                setInicioDate(ev.target.value);
                setDirty(true);
              }}></input>
            <input
              type="time"
              value={inicioTime}
              onChange={(ev) => {
                setInicioTime(ev.target.value);
                setDirty(true);
              }}></input>{" "}
            <span>até</span>
            <input
              type="date"
              value={fimDate}
              onChange={(ev) => {
                setFimDate(ev.target.value);
                setDirty(true);
              }}></input>
            <input
              type="time"
              value={fimTime}
              onChange={(ev) => {
                setFimTime(ev.target.value);
                setDirty(true);
              }}></input>
          </div>
        </div>
        <div className={style.field}>
          <h4>Tempo limite de entrega da redação online</h4>
          <p>
            Define quantos minutos corridos um candidato tem para concluir sua redação, a partir do
            momento que é iniciada.
          </p>
          <input
            type="number"
            step={5}
            min={5}
            max={480}
            value={redacaoTempo}
            onChange={(ev) => {
              setRedacaoTempo(parseInt(ev.target.value));
              setDirty(true);
            }}
            style={{ textAlign: "right" }}
          />{" "}
          minutos
        </div>
        <div className={sharedStyle.actionBar}>
          {dirty && <span>Há configurações não salvas!</span>}
          <span className={sharedStyle.actionBarSpacer}></span>
          <button
            style={{ marginRight: "0.5rem" }}
            onClick={() => setReset(reset + 1)}
            disabled={configMutationStatus.isLoading || configQuery.isFetching || !dirty}>
            Descartar mudanças
          </button>
          <button
            className={["primary", sharedStyle.iconButton].join(" ")}
            onClick={() => saveConfig()}
            disabled={configMutationStatus.isLoading || configQuery.isFetching || !dirty}>
            <i className={[sharedStyle.icon, sharedStyle.saveIcon].join(" ")}></i>
            Salvar configurações
          </button>
        </div>
      </div>
    )
  );
};

export default RestritoConfigPage;
