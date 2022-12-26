import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ReactModal from "react-modal";

import { useLoginParticipanteMutation } from "../../api/participanteApiSlice";
import "./forms.scss";
import { loginFinish } from "../participante/participanteSlice";

const LoginForm = ({ switchForm }) => {
  const maximumDate = new Date().toISOString().split("T")[0];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState(<></>);

  const [doApiLogin, loginStatus] = useLoginParticipanteMutation();

  useEffect(() => {
    if (loginStatus.isSuccess) {
      // O login funcionou
      console.log("Participante login OK", loginStatus.data);

      dispatch(loginFinish(loginStatus.data));
      navigate("/participante/perfil");
    } else if (loginStatus.isError) {
      // Houve um erro
      console.error("Falha no login com CPF " + cpf + " e nascimento " + nascimento);
      console.error(loginStatus.error);

      setAlertTitle("O login falhou");
      setAlertContent("Verifique se os dados digitados estão corretos.");
      setAlertVisible(true);
    }
  }, [loginStatus.isSuccess, loginStatus.error]);

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
          onChange={(ev) => setNascimento(ev.target.value)}></input>
      </div>
      <button className="registerButton" onClick={() => doApiLogin({ cpf, nascimento })}>
        Entrar
      </button>
      <hr />
      <button className="changeForm back" onClick={() => switchForm()}>
        Não tenho inscrição
      </button>

      <ReactModal
        isOpen={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
        className="appModal"
        ariaHideApp={false}>
        <div className="modal-content">
          {alertTitle && <h2 className="modal-title">{alertTitle}</h2>}
          {alertContent}
        </div>
        <div className="modal-footer">
          <button onClick={() => setAlertVisible(false)} className="primary">
            OK
          </button>
        </div>
      </ReactModal>
      <ReactModal isOpen={loginStatus.isLoading} className="appModal" ariaHideApp={false}>
        <div className="modal-content">
          <h2>Aguarde...</h2>
          <p>Estamos acessando sua inscrição...</p>
        </div>
      </ReactModal>
    </div>
  );
};

export default LoginForm;
