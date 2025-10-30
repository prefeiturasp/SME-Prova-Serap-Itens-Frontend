import { ResumoAlternativaDTO } from "./resumo-alternativa-dto";
import { VersaoDto } from "./versao-dto";

export interface ItemResumoVersaoDto {
  id: number;
  codigoItem: string;
  textoBase: string;
  enunciado: string;
  fonte: string;
  versaoItem: 0;
  quantidadeVersoes: number;
  versoesDisponiveis: VersaoDto[];
  alternativas: ResumoAlternativaDTO[];
}
