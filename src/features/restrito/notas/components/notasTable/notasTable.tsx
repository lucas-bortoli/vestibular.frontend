import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useState } from "react";
import ReactModal from "react-modal";

import { useGetCursosQuery } from "../../../../../api/apiSlice";
import { useGetAllNotasObjectQuery, usePutNotasMutation } from "../../../../../api/restrito/slice";
import { CursoCampusJoin, ParticipanteModel } from "../../../../../api/types.js";
import { RootState } from "../../../../../store";
import { clearDirtyNotas, editNotas } from "../../../restritoSlice";
import { plural } from "../../../../../utils";
import sharedStyles from "../../../restrito_shared.module.css";
import styles from "./styles.module.css";

interface Props {
  participantes?: ParticipanteModel[];
  handleTableClick?: (participanteId: number) => void;
}

export const NotasTable = ({ participantes, handleTableClick }: Props) => {
  const dispatch = useDispatch();

  const userToken = useSelector((state: RootState) => state.restrito.auth.token);
  const dirtyNotas = useSelector((state: RootState) => state.restrito.notas.dirtyNotas);
  const dirtyNotasLength = useSelector((state: RootState) => state.restrito.notas.dirtyNotasLength);

  const [apiSaveNotas, apiSaveNotasStatus] = usePutNotasMutation();
  const notasObjQuery = useGetAllNotasObjectQuery({ token: userToken });

  const cursos = useGetCursosQuery();

  const [participanteClicadoId, setParticipanteClicadoId] = useState(-1);

  const tableRef = useRef<HTMLTableElement>();
  const selectedRowRef = useRef<HTMLTableRowElement>();

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
      if ((event.target as Element).tagName === "INPUT") return;

      const el = (event.target as Element).closest("[participanteid]");
      if (el) {
        const participanteId = el.getAttribute("participanteid");
        handleTableClick(parseInt(participanteId));

        setParticipanteClicadoId(parseInt(participanteId));
      }
    }
  };

  const clearEdits = () => {
    const table = tableRef.current;

    // Alterar os valores das inputs para as notas originais (não editadas)
    table.querySelectorAll("tr").forEach((row) => {
      const participanteId = parseInt(row.getAttribute("participanteid"));
      const { notas } = notasObjQuery.data[participanteId] || { notas: [0, 0, 0] };

      if (notas) {
        const inputs = row.querySelectorAll("input");

        // Alterar o valor de cada input da linha
        inputs.forEach((input, index) => {
          if (!input.classList.contains("sum")) {
            // Só editar os inputs de nota
            input.value = (notas[index] || 0).toString();
          } else {
            // Corrigir soma de notas (agora as inputs estão diferentes!)
            input.value = notas.reduce((a, b) => a + b).toString();
          }
        });
      }
    });

    // Limpar dados do redux
    dispatch(clearDirtyNotas());
  };

  /**
   * Chamado quando uma célula de input é focada.
   * Destaca a linha inteira com uma classe CSS.
   */
  const onCellFocus = (event: React.FocusEvent) => {
    const input = event.target as HTMLInputElement;

    selectedRowRef.current = input.parentElement.parentElement as HTMLTableRowElement;
    selectedRowRef.current.classList.add(sharedStyles.dataTableSelecionado);
  };

  /**
   * Chamado quando uma célula de input perde o foco.
   * Destaca a linha inteira com uma classe CSS, e soma todas as inputs
   * da linha.
   */
  const onCellBlur = (event: React.FocusEvent) => {
    // Remover classe de destaque
    if (selectedRowRef.current) {
      // Remover estilo de seleção
      selectedRowRef.current.classList.remove(sharedStyles.dataTableSelecionado);
    }

    selectedRowRef.current = null;
  };

  const onCellEdit = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value) || 0;

    input.value = "" + Math.max(0, Math.min(value, 100));

    // Atualizar soma de notas nessa linha
    const row = input.parentElement.parentElement as HTMLTableRowElement;
    const editableCells = Array.from(row.querySelectorAll("input:not(.sum)")) as HTMLInputElement[];
    const sumCell = row.querySelector("input.sum") as HTMLInputElement;

    sumCell.value = editableCells
      .map((c) => parseInt(c.value))
      .reduce((a, b) => a + b)
      .toString();

    // "sujar" notas
    const participanteId = parseInt(row.getAttribute("participanteid"));
    const notas = editableCells.map((c) => parseInt(c.value));

    dispatch(
      editNotas({
        participanteId,
        notas,
      })
    );
  };

  const saveNotas = async () => {
    if (dirtyNotasLength === 0) return;

    await apiSaveNotas({ token: userToken, lancamentos: Object.values(dirtyNotas) }).unwrap();
    dispatch(clearDirtyNotas());
  };

  return (
    <>
      <table className={sharedStyles.dataTable} ref={tableRef}>
        <thead>
          <tr>
            <th>#</th>
            <th>Data de nascimento</th>
            <th>Tipo de prova</th>
            <th style={{ width: "50%" }}>Curso</th>
            <th>Redação</th>
            <th>Matemática</th>
            <th>Português</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {participantes &&
            notasObjQuery.data &&
            participantes.map((p) => {
              // Mostrar notas padrões (0, 0, 0) se o participante não tiver notas lançadas aindas
              const { notas } = dirtyNotas[p.id] ||
                notasObjQuery.data[p.id] || {
                  participanteId: p.id,
                  notas: [0, 0, 0],
                };

              return (
                <tr
                  {...{ participanteid: p.id }}
                  key={p.id}
                  className={[
                    participanteClicadoId === p.id ? sharedStyles.dataTableSelecionado : "",
                    dirtyNotas[p.id] ? styles.dirtyNota : "",
                  ].join(" ")}
                  onClick={onTableClick}>
                  <td>{p.id}</td>
                  <td>{p.dataNascimento.split("-").reverse().join("/")}</td>
                  <td>{p.provaOnline ? "Online" : "Presencial"}</td>
                  <td>{getCursoNome(p.cursoId)}</td>
                  <td>
                    <input
                      type="number"
                      max="100"
                      min="0"
                      step={5}
                      defaultValue={notas[0] ?? 0}
                      placeholder="0"
                      onFocus={onCellFocus}
                      onBlur={onCellBlur}
                      onChange={onCellEdit}
                    />
                  </td>
                  <td>
                    {!p.provaOnline && (
                      <input
                        type="number"
                        max="100"
                        min="0"
                        step={5}
                        defaultValue={notas[1] ?? 0}
                        placeholder="0"
                        onFocus={onCellFocus}
                        onBlur={onCellBlur}
                        onChange={onCellEdit}
                      />
                    )}
                  </td>
                  <td>
                    {!p.provaOnline && (
                      <input
                        type="number"
                        max="100"
                        min="0"
                        step={5}
                        defaultValue={notas[2] ?? 0}
                        placeholder="0"
                        onFocus={onCellFocus}
                        onBlur={onCellBlur}
                        onChange={onCellEdit}
                      />
                    )}
                  </td>
                  <td>
                    <input
                      className="sum"
                      readOnly
                      disabled
                      type="number"
                      max="10"
                      min="0"
                      defaultValue={notas.reduce((a, b) => a + b)}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className={styles.discardBar}>
        {dirtyNotasLength > 0 && (
          <strong className={styles.dirtyNota}>
            {plural(
              dirtyNotasLength,
              "Uma nota ainda não foi salva.",
              dirtyNotasLength + " notas ainda não foram salvas."
            )}
          </strong>
        )}
        <span className={styles.discardBarSpacer}></span>
        <button onClick={() => clearEdits()} disabled={dirtyNotasLength === 0}>
          Descartar mudanças
        </button>
        <button
          disabled={dirtyNotasLength === 0}
          className={sharedStyles.iconButton + " primary"}
          onClick={() => saveNotas()}>
          <i className={[sharedStyles.icon, sharedStyles.saveIcon].join(" ")}></i>
          Salvar notas
        </button>
      </div>
      <ReactModal isOpen={apiSaveNotasStatus.isLoading} className="appModal" ariaHideApp={false}>
        <div className="modal-content">
          <h2>Aguarde...</h2>
          <p>Estamos salvando as notas...</p>
        </div>
      </ReactModal>
    </>
  );
};
