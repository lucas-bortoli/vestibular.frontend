import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import Redacao from "./components/redacao.jsx";

const ProvaOnlineSubpage = () => {
  const navigate = useNavigate();
  const dadosParticipante = useSelector((state) => state.participante.dados);

  useEffect(() => {
    if (!dadosParticipante.provaOnline) navigate("/participante/perfil");
  });

  // Se não há um participante logado, sair da página
  if (!dadosParticipante.provaOnline) {
    return null;
  }

  return (
    <>
      <h2>Prova online</h2>
      <Redacao></Redacao>
    </>
  );
};

export default ProvaOnlineSubpage;
