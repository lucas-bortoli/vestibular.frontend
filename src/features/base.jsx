import { Outlet, Link } from "react-router-dom";

// Assets
import LogoFaculdadesIndustria from "../assets/logo-faculdadesdaindustria.svg";
import LogoSistemaFiep from "../assets/logo-sistema-branca.svg";
import "./base.scss";

/**
 * A página base da aplicação. Contém o "frame" visto em todas as páginas.
 * Aqui, as subpáginas são renderizadas num container centralizado.
 */
const AppBasePage = () => {
  return (
    <>
      <div className="logos">
        <div className="images">
          <img
            className="facIndustria"
            src={LogoFaculdadesIndustria}
            alt="Logo Faculdades da Indústria"
          />
          <img className="sisFiep" src={LogoSistemaFiep} alt="Logo Sistema Fiep" />
        </div>
      </div>

      <div className="mainContainer">
        <Outlet />
      </div>

      <footer>
        <div className="socialMediaLinks">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/company/faculdades-da-ind%C3%BAstria"
            className="icon linkedin">
            LinkedIn
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.facebook.com/FaculdadesIndustria/"
            className="icon facebook">
            Facebook
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.instagram.com/faculdadesdaindustria/"
            className="icon instagram">
            Instagram
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.youtube.com/channel/UCPH3LNrwDcqYF1Pg5vvQ6aA"
            className="icon youtube">
            YouTube
          </a>
        </div>
        <div className="bottomLinks">
          <Link to="/restrito/login">Acesso restrito</Link>
          <a href="https://www.faculdadesdaindustria.org.br/politica-de-privacidade/">
            Política de Privacidade
          </a>
        </div>
      </footer>
    </>
  );
};

export default AppBasePage;
