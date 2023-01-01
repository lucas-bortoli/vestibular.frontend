import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";

/**
 * Hook que exige o login para a renderização da subpágina.
 * Se o usuário não está autenticado, ele é redirecionado para a página de índice.
 * @param roles Especifica os roles que o usuário deve possuir.
 */
export const useAuthentication = (requiredRoles: string[] = []) => {
  const loggedIn = useSelector((state: RootState) => state.restrito.isLoggedIn);
  const userRoles = useSelector((state: RootState) => state.restrito.auth.roles);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);

  for (const role of requiredRoles) {
    // Se o usuário não possui um dos roles exigidos, rejeitar operação
    if (!userRoles.includes(role)) {
      return false;
    }
  }

  return loggedIn;
};
