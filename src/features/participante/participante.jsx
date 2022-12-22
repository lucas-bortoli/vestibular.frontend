import "./participante.scss";
import { Link, NavLink, Outlet } from "react-router-dom";

const ParticipantePage = () => {
  return (
    <div className="indexPage">
      <div className="pane firstPane">
        <div className="header">
          <span className="userIcon" alt="ícone de usuário" />
          <span className="userName">Lucas</span>
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
