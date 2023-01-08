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

/**
 * Representa uma redação.
 */
export interface RedacaoModel {
  /**
   * O participante a quem essas redação pertence
   */
  participanteId: number;

  /**
   * O corpo dessa redação
   */
  corpo: string;

  /**
   * O timestamp em que a redação começou a ser escrita
   */
  inicioTimestamp: number;

  /**
   * O timestamp em que a redação foi finalizada
   */
  fimTimestamp: number;

  /**
   * Quanto tempo ainda resta na redação, para ser entrege
   */
  tempoRestante: number;

  /**
   * Indica se a redação está concluída, o sistema não deve aceitar atualizações se estiver
   */
  concluido: boolean;
}

/**
 * Representa as notas lançadas para dado participante.
 */
export interface NotasModel {
  /**
   * O participante a quem essas notas partencem.
   */
  participanteId: number;

  /**
   * Um vetor de notas, de 0 a 10.
   */
  notas: number[];
}

export interface ProcessoSeletivoConfigPartial {
  /**
   * Quando o processo seletivo está iniciado.
   * Só serão aceitas entregas de provas onlines depois desse período.
   */
  processoSeletivoInicioUnix: number;

  /**
   * Quando o processo seletivo está finalizado.
   * Só serão aceitas entregas de provas onlines antes desse período.
   */
  processoSeletivoFimUnix: number;

  /**
   * Quanto tempo há para a conclusão de uma redação
   */
  redacaoTempo: number;
}

export interface AttachmentOpaqueModel {
  id: string;
  nome: string;
  tamanho: number;
  mime: string;
  modificado: number;
}
