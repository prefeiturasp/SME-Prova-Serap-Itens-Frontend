export interface VersaoDto {
  id: number;
  codigoItem: string;
  versaoItem: number;
  dataCriacao: string;
  situacaoItem: number;
  provas?: string[];
}