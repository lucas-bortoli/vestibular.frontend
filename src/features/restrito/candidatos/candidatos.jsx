import apiBaseUrl from "../../../api/baseUrl.js";

import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { useSelector } from "react-redux";
import { useListaParticipantesQuery } from "../../../api/restrito/slice";
import { useGetCursosQuery } from "../../../api/apiSlice.ts";
import { format } from "../../../utils.ts";
import { useAuthentication } from "../authHook";

import SharedStyles from "../restrito_shared.module.css";
import styles from "./candidatos.module.css";

const RestritoCandidatosPage = () => {
  const userToken = useSelector((state) => state.restrito.auth.token);

  const listaParticipantes = useListaParticipantesQuery({ token: userToken });
  const { data: cursosData } = useGetCursosQuery();

  const getCursoNome = (cursoId) => {
    let curso = Object.values(cursosData)
      .flat()
      .find((c) => c.cursoId === cursoId);

    if (!curso) return "";

    return `${curso.cursoNome} (${curso.campusNome})`;
  };

  /*
   * Baixa os participantes e as notas como uma planilha Excel.
   */
  const exportTable = async () => {
    console.log(apiBaseUrl, `${apiBaseUrl}/restrito/notas_export/xlsx`);
    const planilhaBlob = await fetch(`${apiBaseUrl}/restrito/notas_export/xlsx`, {
      headers: {
        authorization: userToken,
      },
    }).then((r) => r.blob());

    const a = document.createElement("a");
    a.download = "relação de candidatos.xlsx";
    a.href = URL.createObjectURL(planilhaBlob);
    a.click();
  };

  return (
    useAuthentication() && (
      <div>
        <h2>Candidatos</h2>
        <div className={styles.actionButtons}>
          <button className={SharedStyles.iconButton} onClick={exportTable}>
            <i className={[SharedStyles.icon, SharedStyles.exportTable].join(" ")}></i>
            Salvar como planilha Excel...
          </button>
        </div>
        <table className={SharedStyles.dataTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data de nascimento</th>
              <th>E-mail</th>
              <th>Tipo de prova</th>
              <th>Telefone</th>
              <th>Curso</th>
            </tr>
          </thead>
          <tbody>
            {listaParticipantes.isSuccess &&
              listaParticipantes.data.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{cpfValidator.format(p.cpf)}</td>
                  <td>{p.dataNascimento.split("-").reverse().join("/")}</td>
                  <td>{p.email}</td>
                  <td>{p.provaOnline ? "Online" : "Presencial"}</td>
                  <td>{format("(dd) ddddd-dddd", p.telefone)}</td>
                  <td>{cursosData && getCursoNome(p.cursoId)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  );
};

export default RestritoCandidatosPage;
