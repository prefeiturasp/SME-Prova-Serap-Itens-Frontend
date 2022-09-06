import { AlunoTurmaDto } from './aluno-turma-dto';

export interface ResumoGeralProvaDto {
  provaId: number;
  tituloProva: string;
  totalAlunos: number;
  provasIniciadas: number;
  provasNaoFinalizadas: number;
  tempoMedio: number;
  provasFinalizadas: number;
  pencentualRealizado: number;
  detalheProva: AlunoTurmaDto;
}
