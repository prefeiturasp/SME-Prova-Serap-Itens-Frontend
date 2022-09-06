export interface AlunoTurmaDto {
  nomeEstudante: string;
  fezDownload: boolean;
  inicioProva?: Date;
  fimProva?: Date;
  tempoMedio?: number;
  questoesRespondidas?: number;
}
