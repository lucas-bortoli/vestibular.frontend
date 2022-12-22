import "./perfil.scss";

const ParticipantePerfilPage = () => {
  return (
    <>
      <h2>Perfil</h2>
      <div className="perfilInfo">
        <span className="info">Nome completo</span>
        <span className="value">Lucas Vinicius de Bortoli Santos</span>
      </div>
      <div className="perfilInfo">
        <span className="info">Data de nascimento</span>
        <span className="value">12/03/2003</span>
      </div>
      <div className="perfilInfo">
        <span className="info">Documento</span>
        <span className="value">076.637.283-94</span>
      </div>
      <div className="perfilInfo">
        <span className="info">E-mail</span>
        <span className="value">lucasbortolisantos@gmail.com</span>
      </div>
      <div className="perfilInfo">
        <span className="info">Telefone</span>
        <span className="value">(43) 99927-1022</span>
      </div>
      <div className="perfilInfo">
        <span className="info">Curso selecionado</span>
        <span className="value">
          Engenharia de Software (Londrina)
          <br />
          Prova presencial - concurso de bolsas
        </span>
      </div>
      <p>Caso as informações acimas estejam incorretas, entre em contato conosco.</p>
    </>
  );
};

export default ParticipantePerfilPage;
