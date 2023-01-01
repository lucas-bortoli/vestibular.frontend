import React from "react";

import { useGetCursosQuery } from "../../../../../api/apiSlice";
import { CursoCampusJoin, ParticipanteModel } from "../../../../../api/types.js";
import sharedStyles from "../../../restrito_shared.module.css";

interface Props {
  participantes?: ParticipanteModel[],
  handleTableClick?: (participanteId: number) => void
}

export const NotasTable = ({ participantes, handleTableClick }: Props) => {
  const cursos = useGetCursosQuery();
  
  /**
   * Retorna o nome e o campus de um curso, pelo seu id.
   */
  const getCursoNome = (cursoId) => {
    let curso = Object.values(cursos.data as { [key: string]: CursoCampusJoin[] })
      .flat()
      .find((c) => c.cursoId === cursoId);

    if (!curso) return "";

    return `${curso.cursoNome} (${curso.campusNome})`;
  };

  const onTableClick = (event: React.MouseEvent) => {
    if (handleTableClick) {
      const el = (event.target as Element).closest("[participanteid]");
      if (el) {
        const participanteId = el.getAttribute("participanteid");
        handleTableClick(parseInt(participanteId));
      }
    }
  }

  return (
    <table className={sharedStyles.dataTable}>
      <thead>
        <tr>
          <th>#</th>
          <th>Data de nascimento</th>
          <th>Tipo de prova</th>
          <th style={{ width: "50%" }}>Curso</th>
          <th>Nota 1</th>
          <th>Nota 2</th>
          <th>Nota 3</th>
          <th>Média de notas</th>
        </tr>
      </thead>
      <tbody>
        {participantes &&
          participantes.map((p) => (
            <tr {...{"participanteId": p.id }} key={p.id} onClick={onTableClick}>
              <td>{p.id}</td>
              <td>{p.dataNascimento.split("-").reverse().join("/")}</td>
              <td>{p.provaOnline ? "Online" : "Presencial"}</td>
              <td>{getCursoNome(p.cursoId)}</td>
              <td>
                <input type="number" max="10" min="0" defaultValue={0} />
              </td>
              <td>
                <input type="number" max="10" min="0" defaultValue={0} />
              </td>
              <td>
                <input type="number" max="10" min="0" defaultValue={0} />
              </td>
              <td>
                <input readOnly disabled type="number" max="10" min="0" defaultValue={0} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
