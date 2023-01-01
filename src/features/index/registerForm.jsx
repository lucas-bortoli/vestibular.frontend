import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import InputMask from "react-input-mask";
import ReactModal from "react-modal";
import Joi from "joi";

import { useCadastrarParticipanteMutation } from "../../api/participanteApiSlice";
import { loginFinish } from "../participante/participanteSlice.ts";
import { CursosSelect } from "./components/cursosSelect";

import "./forms.scss";

const RegisterForm = ({ switchForm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [triggerRegister, registerStatus] = useCadastrarParticipanteMutation();

  const [secondStageVisible, setSecondStageVisible] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState(<></>);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [curso, setCurso] = useState(1);
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [modalidade, setModalidade] = useState("");

  const maximumDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Precisamos colocar em condições, pois o callback do effect é
    // chamado na primeira renderização do componente
    if (registerStatus.isError) {
      console.error(registerStatus.error);
      setAlertTitle("A inscrição não teve êxito");

      if (registerStatus.error.data?.message?.includes("UNIQUE")) {
        setAlertContent(<p>Você já está cadastrado neste processo seletivo.</p>);
      } else {
        setAlertContent(<p>Encontramos um problema ao realizar a inscrição.</p>);
      }

      setAlertVisible(true);
      return;
    } else if (registerStatus.isSuccess) {
      // O registro ocorreu com sucesso
      console.log("Participante register OK");
      dispatch(loginFinish(registerStatus.data));
      navigate("/participante/perfil");
    }
  }, [registerStatus.isSuccess, registerStatus.isError]);

  /**
   * Faz a validação da primeira parte das inputs (aquelas visíveis na página de index).
   * Se a validação passar, abre o modal para a segunda parte das inputs.
   */
  const submitPrimeiroEstagio = () => {
    const validation = Joi.object({
      nome: Joi.string()
        .min(4)
        .max(64)
        .required()
        .error(() => new Error("O nome dado é inválido.")),
      cpf: Joi.string()
        .replace(/[^\d]/g, "")
        .custom((value, helpers) => {
          if (!cpfValidator.isValid(value)) {
            return helpers.error("any.invalid");
          }

          return true;
        })
        .required()
        .error(() => new Error("O CPF dado é inválido.")),
      nascimento: Joi.date()
        .less(new Date())
        .required()
        .error(() => new Error("A data de nascimento dada é inválida.")),
    });

    const validationResult = validation.validate({ nome, cpf, nascimento });

    // Mostrar erro de validação
    if (validationResult.error) {
      setAlertTitle("Dados inválidos");
      setAlertContent(<p>{validationResult.error.message}</p>);
      setAlertVisible(true);
      return;
    }

    // Abrir modal para as inputs adicionais
    setSecondStageVisible(true);
  };

  /**
   * Faz a validação do segundo conjunto de inputs (aquelas do modal). Se passar,
   * faz a requisição na API para o registro.
   */
  const submitSegundoEstagio = () => {
    const validation = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .error(() => new Error("O e-mail dado é inválido.")),
      telefone: Joi.string()
        .replace(/[^\d]/g, "")
        .length(11)
        .required()
        .error(() => new Error("O número de telefone dado é inválido.")),
    });

    const validationResult = validation.validate({ email, telefone });

    if (validationResult.error) {
      setAlertTitle("Dados inválidos");
      setAlertContent(<p>{validationResult.error.message}</p>);
      setAlertVisible(true);
      return;
    }

    // Chamar a API de registro
    triggerRegister({ nome, cpf, nascimento, curso, email, telefone, modalidade });
  };

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
      <button className="registerButton" onClick={() => submitPrimeiroEstagio()}>
        Continuar
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
        <div className="modal-content">
          <h2 className="modal-title">Quase lá...</h2>
          <p>
            Só precisamos de mais algumas informações para confirmar a inscrição no processo
            seletivo.
          </p>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" onChange={(ev) => setEmail(ev.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="telefone">Telefone</label>
            <InputMask
              mask="(99) 99999-9999"
              maskChar=" "
              alwaysShowMask={true}
              id="telefone"
              onChange={(ev) => setTelefone(ev.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="modalidade">Modalidade de prova</label>
            <select id="modalidade" onChange={(ev) => setModalidade(ev.target.value)}>
              <option value="presencial">Presencial - concurso de bolsas</option>
              <option value="online">Online</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={() => setSecondStageVisible(false)}>Cancelar</button>
          <button className="primary" onClick={() => submitSegundoEstagio()}>
            Concluir minha inscrição
          </button>
        </div>
      </ReactModal>
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
      <ReactModal isOpen={registerStatus.isLoading} className="appModal" ariaHideApp={false}>
        <div className="modal-content">
          <h2>Aguarde...</h2>
          <p>Estamos finalizando sua inscrição.</p>
        </div>
      </ReactModal>
    </div>
  );
};

export default RegisterForm;
