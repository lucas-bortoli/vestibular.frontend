import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useListaParticipantesQuery, useGetCursosQuery } from "../../../api/apiSlice.js";
import ReactModal from "react-modal";

import SharedStyles from "../restrito_shared.module.css";
import styles from "./styles.module.css";

const RestritoNotasPage = () => {
  const userToken = useSelector((state) => state.restrito.auth.token);

  const participantes = useListaParticipantesQuery({ token: userToken });
  const cursos = useGetCursosQuery();

  const [participantesVisiveis, setParticipantesVisiveis] = useState([]);
  const [redacaoViewOpen, setRedacaoViewOpen] = useState(false);

  const getCursoNome = (cursoId) => {
    let curso = Object.values(cursos.data)
      .flat()
      .find((c) => c.cursoId === cursoId);

    if (!curso) return "";

    return `${curso.cursoNome} (${curso.campusNome})`;
  };

  const handleTableClick = (event) => {
    if (event.target.nodeName === "INPUT") return;
    setRedacaoViewOpen(true);
  };

  const changeCampusFilter = (campusId) => {
    if (!cursos.isSuccess || !participantes.isSuccess) return;

    if (campusId === -1) {
      // Todos os participantes são visíveis neste caso
      setParticipantesVisiveis(participantes.data);
      return;
    }

    const flatCursos = Object.values(cursos.data).flat();

    setParticipantesVisiveis(
      participantes.data.filter((participante) => {
        let participanteCursoId = participante.cursoId;
        let curso = flatCursos.find((c) => c.cursoId === participanteCursoId);

        if (!curso || curso.campusId !== campusId) return false;

        return true;
      })
    );
  };

  useEffect(() => {
    if (cursos.isSuccess) {
      // Mudar o filtro para o estado inicial (-1 = todos os campus)
      changeCampusFilter(-1);
    }
  }, [cursos.isSuccess]);

  return (
    <div>
      <h2>Lançamento de notas</h2>
      <p>Clique em um candidato para visualizar sua redação.</p>
      <select onChange={(ev) => changeCampusFilter(parseInt(ev.target.value))}>
        <option value={-1}>Todos os campus</option>

        {cursos.isSuccess &&
          Object.keys(cursos.data).map((campusNome) => (
            <option value={cursos.data[campusNome][0].campusId}>{campusNome}</option>
          ))}
      </select>
      <br />
      <br />
      <table className={SharedStyles.dataTable}>
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
        {participantes.isSuccess &&
          participantesVisiveis.map((p) => (
            <tr key={p.id} onClick={handleTableClick}>
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
      </table>
      <ReactModal
        isOpen={redacaoViewOpen}
        onRequestClose={() => setRedacaoViewOpen(false)}
        className="appModal"
        ariaHideApp={false}>
        <div className="modal-content">
          <h2 className="modal-title">Redação</h2>
          <div className={styles.pageWrapper}>
            <div className={styles.page}>
              <textarea spellCheck={true} readOnly={true} maxLength={720}></textarea>
            </div>
            <br />
            <span>201 caracteres</span>
            <span>Prova realizada em 00:32:10</span>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={() => setRedacaoViewOpen(false)} className="primary">
            OK
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default RestritoNotasPage;
