import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetCursosQuery } from "../../../api/apiSlice.ts";
import { format } from "../../../utils";
import "./perfil.scss";

const ParticipantePerfilPage = () => {
  const dadosParticipante = useSelector((state) => state.participante.dados);

  const { data: cursosData } = useGetCursosQuery();

  return (
    <>
      <h2>Perfil</h2>
      <div className="perfilInfo">
        <span className="info">Nome completo</span>
        <span className="value">{dadosParticipante.nome}</span>
      </div>
      <div className="perfilInfo">
        <span className="info">Data de nascimento</span>
        <span className="value">
          {dadosParticipante.dataNascimento.split("-").reverse().join("/")}
        </span>
      </div>
      <div className="perfilInfo">
        <span className="info">Documento — CPF</span>
        <span className="value">
          {cpfValidator
            .format(dadosParticipante.cpf)
            .replace(/\d.\d{3}.\d{3}-\d{1}/, "*.***.***-*")}
        </span>
      </div>
      <div className="perfilInfo">
        <span className="info">E-mail</span>
        <span className="value">{dadosParticipante.email}</span>
      </div>
      <div className="perfilInfo">
        <span className="info">Telefone</span>
        <span className="value">{format("(dd) ddd**-**dd", dadosParticipante.telefone)}</span>
      </div>
      <div className="perfilInfo">
        <span className="info">Curso selecionado</span>
        <span className="value">
          {cursosData &&
            (() => {
              let curso = Object.values(cursosData)
                .flat()
                .find((c) => c.cursoId === dadosParticipante.cursoId);

              return `${curso.cursoNome} (${curso.campusNome})`;
            })()}
          <br />
          {dadosParticipante.provaOnline ? "Prova online" : "Prova presencial - concurso de bolsas"}
        </span>
      </div>
    </>
  );
};

export default ParticipantePerfilPage;
