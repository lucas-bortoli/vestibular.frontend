export interface ParticipanteModel {
  /**
   * Id do participante
   */
  id: number;

  /**
   * Nome do participante
   */
  nome: string;

  /**
   * E-mail do participante
   */
  email: string;

  /**
   * Telefone do participante, sem formatação
   */
  telefone: string;

  /**
   * Data de nascimento no formato YYYY-MM-DD
   */
  dataNascimento: string;

  /**
   * CPF do participante, sem formatação
   */
  cpf: string;

  /**
   * Id do curso no qual o participante está inscrito
   */
  cursoId: number;

  /**
   * Indica se o participante está inscrito na prova online
   */
  provaOnline: boolean;
}

export interface CursoModel {
  /**
   * Id do curso
   */
  id: number;

  /**
   * Nome do curso
   * @example "Engenharia de Software"
   */
  nome: string;

  /**
   * Id do campus do curso
   */
  campusId: number;
}

/**
 * Uma união de cursos com campus.
 */
export interface CursoCampusJoin {
  cursoId: number;
  cursoNome: string;
  campusId: number;
  campusNome: string;
}
