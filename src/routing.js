import { Routes, Route, HashRouter } from "react-router-dom";

// Páginas e rotas
import AppBasePage from "./features/base.jsx";
import IndexPage from "./features/index/indexPage.jsx";
import ParticipantePage from "./features/participante/participante.jsx";
import ParticipantePerfilPage from "./features/participante/perfil/perfil.jsx";
import RestritoPageBase from "./features/restrito/restrito.jsx";
import RestritoLoginPage from "./features/restrito/login/login.jsx";
import RestritoCandidatosPage from "./features/restrito/candidatos/candidatos.jsx";
import ParticipanteRedacaoSubpage from "./features/participante/redacao/provaOnline";
import RestritoNotasPage from "./features/restrito/notas/notas";
import RestritoConfigPage from "./features/restrito/config/configPage";
import RestritoFilesPage from "./features/restrito/files/filesPage";

/**
 * Faz o roteamento das páginas da aplicação com o React-Router
 */
export const AppRouting = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppBasePage />}>
          <Route index element={<IndexPage />} />
          <Route path="participante" element={<ParticipantePage />}>
            <Route path="perfil" element={<ParticipantePerfilPage />} />
            <Route path="online" element={<ParticipanteRedacaoSubpage />} />
          </Route>
          <Route path="restrito" element={<RestritoPageBase />}>
            <Route path="login" element={<RestritoLoginPage />} />
            <Route path="candidatos" element={<RestritoCandidatosPage />} />
            <Route path="notas" element={<RestritoNotasPage />} />
            <Route path="config" element={<RestritoConfigPage />} />
            <Route path="arquivos" element={<RestritoFilesPage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};
