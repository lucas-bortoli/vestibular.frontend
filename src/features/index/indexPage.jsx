import apiBaseUrl from "../../api/baseUrl";
import { useState } from "react";
import "./indexPage.scss";
import InformationFrame from "./infoFrame";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";

const IndexPage = () => {
  const [currentForm, setCurrentForm] = useState("register");

  return (
    <div className="indexPage">
      <div className="pane firstPane">
        {currentForm === "register" ? (
          <RegisterForm switchForm={() => setCurrentForm("login")} />
        ) : (
          <LoginForm switchForm={() => setCurrentForm("register")} />
        )}
      </div>
      <div className="pane secondPane">
        <h2>Informações</h2>
        <InformationFrame />
        <div className="attachments">
          <a target="_blank" href={apiBaseUrl + "/attachments/data/processo_seletivo_edital"}>
            <div className="attachedFile">Edital do processo seletivo</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
