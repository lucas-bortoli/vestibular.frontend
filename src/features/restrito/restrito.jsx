import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, NavLink, useLocation } from "react-router-dom";
import { logout } from "./restritoSlice";

const RestritoPageBase = () => {
  // Receber os parâmetros da url pelo React Router
  // /restrito/:page
  // Queremos pegar o parâmetro :page
  const location = useLocation();

  const nomeUsuario = useSelector((state) => state.restrito.auth.nameOfUser);
  const dispatch = useDispatch();

  return (
    <div className="indexPage restritoPage">
      {!location.pathname.endsWith("/login") ? (
        <div className="pane firstPane">
          <div className="header">
            <span className="userIcon admin" alt="ícone de usuário" />
            <span className="userName">{nomeUsuario}</span>
          </div>

          {/* Links da sidebar */}
          <div className="nav">
            <NavLink
              to="/restrito/candidatos"
              className={`link icon info ${({ isActive }) => isActive ?? "active"}`}>
              Lista de candidatos
            </NavLink>
            <NavLink
              to="/restrito/notas"
              className={`link icon prova ${({ isActive }) => isActive ?? "active"}`}>
              Lançamento de notas
            </NavLink>
            <NavLink
              to="/restrito/config"
              className={`link icon config ${({ isActive }) => isActive ?? "active"}`}>
              Dados do processo seletivo
            </NavLink>
            <Link to="/" onClick={() => dispatch(logout())} className="link icon logout">
              Sair
            </Link>
          </div>
        </div>
      ) : null}
      <div className="pane secondPane">
        <Outlet />
      </div>
    </div>
  );
};

export default RestritoPageBase;
