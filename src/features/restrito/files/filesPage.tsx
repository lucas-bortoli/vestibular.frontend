import React from "react";
import { useAuthentication } from "../authHook";
import FileInput from "./components/FileInput";

import style from "./style.module.css";

const RestritoFilesPage = () => {
  return (
    useAuthentication() && (
      <div>
        <h2>Arquivos do processo seletivo</h2>
        <div className={style.field}>
          <h4>Informações gerais sobre o processo seletivo (HTML)</h4>
          <p>
            Mostrado na tela inicial da aplicação, ao lado dos formulários de registro e login de
            participantes.
          </p>
          <p>
            <strong>Dica</strong>: É possível usar o Microsoft Word para a escrita desse arquivo,
            basta exportar o documento no formato <strong>.html</strong>.
          </p>
          <FileInput allowedExtensions={["html"]} fileId="index" mimeType="application/html" />
        </div>
        <div className={style.field}>
          <h4>Edital do processo seletivo (PDF)</h4>
          <p>
            Mostrado na tela inicial da aplicação, embaixo do painel de
            <em> Informações gerais sobre o processo seletivo</em>.
          </p>
          <FileInput
            allowedExtensions={["pdf"]}
            fileId="processo_seletivo_edital"
            mimeType="application/pdf"
          />
        </div>
        <div className={style.field}>
          <h4>Edital da redação (PDF)</h4>
          <p>
            Disponibilizado para os candidatos quando iniciam a redação online. Deve conter
            informações sobre o tema do texto e outras instruções relevantes.
          </p>
          <FileInput
            allowedExtensions={["pdf"]}
            fileId="redacao_edital"
            mimeType="application/pdf"
          />
        </div>
      </div>
    )
  );
};

export default RestritoFilesPage;
