import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useListaParticipantesQuery, useGetCursosQuery } from "../../../api/apiSlice";
import { RedacaoViewModal } from "./components/redacaoViewModal/redacaoViewModal";
import { CampusFilterSelect } from "./components/campusFilterSelect";
import { NotasTable } from "./components/notasTable/notasTable";
import { useAuthentication } from "../authHook";
import { RootState } from "../../../store";

import sharedStyles from "../restrito_shared.module.css";
import styles from "./styles.module.css";

const RestritoNotasPage = () => {
  const userToken = useSelector((state: RootState) => state.restrito.auth.token);
  
  const participantesQuery = useListaParticipantesQuery({ token: userToken });
  const cursos = useGetCursosQuery();

  const [participantesVisiveis, setParticipantesVisiveis] = useState([]);
  const [redacaoViewOpen, setRedacaoViewOpen] = useState(false);
  const [campusIdFiltro, setCampusIdFiltro] = useState(-1);
  const [modalidadeFiltro, setModalidadeFiltro] = useState(-1);

  /**
   * Chamado quando uma linha na tabela de notas é clicada.
   */
  const handleTableClick = (participanteId: number) => {
    setRedacaoViewOpen(true);
  };

  useEffect(() => {
    if (cursos.isSuccess) {
      // Mudar o filtro para o estado inicial (-1 = todos os campus)
      setCampusIdFiltro(-1);
    }
  }, [cursos.isSuccess]);

  /**
   * Faz o filtro por campus e modalidade.
   */
  useEffect(() => {
    if (!cursos.isSuccess || !participantesQuery.isSuccess) return;

    const flatCursos = Object.values(cursos.data).flat();

    let participantes = participantesQuery.data.filter((participante) => {
      let curso = flatCursos.find((c) => c.cursoId === participante.cursoId);

      if (campusIdFiltro > -1 && curso.campusId !== campusIdFiltro) return false;
      if (modalidadeFiltro === 0 && !participante.provaOnline) return false;
      if (modalidadeFiltro === 1 && participante.provaOnline) return false;

      return true;
    });

    setParticipantesVisiveis(participantes);
  }, [modalidadeFiltro, campusIdFiltro]);

  return (
    useAuthentication() && <div>
      <h2>Lançamento de notas</h2>
      <p>Clique em um candidato para visualizar sua redação.</p>
      <div className={styles.actionBar}>
        <CampusFilterSelect onChange={(campusId) => setCampusIdFiltro(campusId)} />
        <select
          style={{ marginLeft: "0.5rem" }}
          onChange={(ev) => setModalidadeFiltro(parseInt(ev.target.value))}>
          <option value={-1}>Todas as modalidades</option>
          <option value={0}>Provas online</option>
          <option value={1}>Provas presenciais</option>
        </select>
        <span className={styles.actionBarSpacer}></span>
        <button className={sharedStyles.iconButton}>
          <i className={[sharedStyles.icon, sharedStyles.saveIcon].join(" ")}></i>
          Salvar notas
        </button>
      </div>
      <NotasTable
        participantes={participantesVisiveis}
        handleTableClick={(p) => handleTableClick(p)}
      />
      <RedacaoViewModal isOpen={redacaoViewOpen} onRequestClose={() => setRedacaoViewOpen(false)} />
    </div>
  );
};

export default RestritoNotasPage;
