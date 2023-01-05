import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useUserLoginMutation } from "../../../api/restrito/slice";

import styles from "./login.module.css";
import { loginFinish } from "../restritoSlice";

const RestritoLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  // Função da API responsável pelo login de usuários
  const [doLogin, loginResult] = useUserLoginMutation();

  const navigate = useNavigate();

  // Despachar ação de loginFinish quando o request de login funcionar
  useEffect(() => {
    if (loginResult.isSuccess) {
      console.log("Login OK!");
      dispatch(loginFinish(loginResult.data));
      navigate("/restrito/candidatos");
    } else if (loginResult.isError) {
      console.error("Login error!");
    }
    // eslint-disable-next-line
  }, [loginResult.status]);

  return (
    <div className={styles.page}>
      <div className={styles.loginWrapper}>
        <h2 className={styles.title}>Acesso restrito</h2>
        <div className={styles.field}>
          <label>Usuário</label>
          <input type="text" onChange={(ev) => setUsername(ev.target.value)} />
        </div>
        <div className={styles.field}>
          <label>Senha</label>
          <input type="password" onChange={(ev) => setPassword(ev.target.value)} />
        </div>
        {loginResult.isLoading && (
          <div className={styles.field}>
            <p className={styles.loginStatus}>Aguarde...</p>
          </div>
        )}
        {loginResult.isError && (
          <div className={styles.field}>
            <p className={styles.loginError}>
              O login falhou. Verifique se os dados estão corretos.
            </p>
          </div>
        )}
        <div className={styles.buttonBar}>
          <Link to="/">
            <button className={styles.backButton}>Voltar</button>
          </Link>
          <button className={styles.loginButton} onClick={() => doLogin({ username, password })}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestritoLoginPage;
