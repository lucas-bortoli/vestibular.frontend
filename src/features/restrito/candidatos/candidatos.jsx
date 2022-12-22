import { useSelector } from "react-redux";
import { useListaParticipantesQuery } from "../../../api/apiSlice.js";

import SharedStyles from "../restrito_shared.module.css";

const RestritoCandidatosPage = () => {
  const userToken = useSelector((state) => state.restrito.auth.token);

  const listaParticipantes = useListaParticipantesQuery({ token: userToken });

  return (
    <div>
      <h2>Candidatos</h2>
      <table className={SharedStyles.dataTable}>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>CPF</th>
          <th>Data de nascimento</th>
          <th>E-mail</th>
          <th>Prova online</th>
          <th>Telefone</th>
          <th>Curso</th>
        </tr>
        {listaParticipantes.isSuccess &&
          listaParticipantes.data.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>{p.cpf}</td>
              <td>{p.dataNascimento}</td>
              <td>{p.email}</td>
              <td>{"" + p.provaOnline}</td>
              <td>{p.telefone}</td>
              <td>{p.cursoId}</td>
            </tr>
          ))}
      </table>
    </div>
  );
};

export default RestritoCandidatosPage;
