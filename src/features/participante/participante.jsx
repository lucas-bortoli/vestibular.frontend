import "./participante.scss";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const ParticipantePage = () => {
  const navigate = useNavigate();
  const dadosParticipante = useSelector((state) => state.participante.dados);

  useEffect(() => {
    if (!dadosParticipante.cpf) navigate("/");
  });

  // Se não há um participante logado, sair da página
  if (!dadosParticipante.cpf) {
    return null;
  }

  return (
    <div className="indexPage">
      <div className="pane firstPane">
        <div className="header">
          <span className="userIcon" alt="ícone de usuário" />
          <span className="userName">{dadosParticipante.nome.split(" ")[0]}</span>
        </div>

        {/* Links da sidebar */}
        <div className="nav">
          <NavLink
            to="/participante/perfil"
            className={({ isActive }) => `link icon info ${isActive ? "active" : ""}`}>
            Perfil
          </NavLink>
          <NavLink
            to="/participante/online"
            onClick={(ev) => {
              if (dadosParticipante.provaOnline) return;
              ev.preventDefault();
              ev.stopPropagation();
            }}
            aria-disabled={!dadosParticipante.provaOnline}
            className={({ isActive }) => `link icon prova ${isActive ? "active" : ""}`}>
            Prova online
          </NavLink>
          <Link to="/" className="link icon logout">
            Sair
          </Link>
        </div>
      </div>
      <div className="pane secondPane">
        <Outlet />
      </div>
    </div>
  );
};

export default ParticipantePage;
