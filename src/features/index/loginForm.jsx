import { useState } from "react";
import InputMask from "react-input-mask";
import { Link } from "react-router-dom";
import "./forms.scss";

const LoginForm = ({ switchForm }) => {
  const maximumDate = new Date().toISOString().split("T")[0];

  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");

  return (
    <div className="registerForm">
      <h2>Login</h2>
      <div className="field">
        <label htmlFor="cpf">CPF</label>
        <InputMask
          type="text"
          id="cpf"
          mask="999.999.999-99"
          maskChar=" "
          alwaysShowMask={true}
          onChange={(ev) => setCpf(ev.target.value)}></InputMask>
      </div>
      <div className="field">
        <label htmlFor="nascimento">Data de nascimento</label>
        <input
          type="date"
          id="nascimento"
          max={maximumDate}
          onChange={(ev) => ev.target.value}></input>
      </div>
      <Link to="/participante/perfil">
        <button className="registerButton">Entrar</button>
      </Link>
      <hr />
      <button className="changeForm back" onClick={() => switchForm()}>
        Não tenho inscrição
      </button>
    </div>
  );
};

export default LoginForm;
