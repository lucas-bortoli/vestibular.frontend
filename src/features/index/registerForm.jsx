import { useState } from "react";
import InputMask from "react-input-mask";
import ReactModal from "react-modal";
import "./forms.scss";

import { CursosSelect } from "./components/cursosSelect";

const RegisterForm = ({ switchForm }) => {
  const [secondStageVisible, setSecondStageVisible] = useState(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [curso, setCurso] = useState(1);

  const maximumDate = new Date().toISOString().split("T")[0];

  return (
    <div className="registerForm">
      <h2>Inscrever-se</h2>
      <div className="field">
        <label htmlFor="nome">Nome completo</label>
        <input type="text" id="nome" onChange={(ev) => setNome(ev.target.value)}></input>
      </div>
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
          onChange={(ev) => setNascimento(ev.target.value)}></input>
      </div>
      <div className="field">
        <label htmlFor="curso">1ª opção de curso</label>
        <CursosSelect id="curso" onChange={(ev) => setCurso(ev.target.value)} />
      </div>
      <button className="registerButton" onClick={() => setSecondStageVisible(true)}>
        Cadastrar
      </button>
      <hr />
      <button className="changeForm" onClick={() => switchForm()}>
        Já me inscrevi
      </button>
      <ReactModal
        isOpen={secondStageVisible}
        onRequestClose={() => setSecondStageVisible(false)}
        className="appModal"
        ariaHideApp={false}>
        <h2>Quase lá...</h2>
      </ReactModal>
    </div>
  );
};

export default RegisterForm;
