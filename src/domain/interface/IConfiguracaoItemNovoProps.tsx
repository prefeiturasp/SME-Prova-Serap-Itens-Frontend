export interface ConfiguracaoItemNovoProps {
    codigo: string;
    areaConhecimento: number | null;
    disciplina: number | null;
    matriz: number | null;
    competencia: number | null;
    habilidade: number | null;
    anoMatriz: number | null;
    assunto: number | null;
    subAssunto: number | null;
    situacaoItem: number | null;
    tipoItem: number | null;
    quantidadeAlternativas: number | null;
    dificuldadeSugerida: number | null;
    discriminacao: number | null;
    dificuldade: number | null;
    nivelItem: number | null;
    acertoCasual: number | null;
    palavrasChave: string[];
    parametroBTransformado?: number | null;
    mediaDesvioPadrao?: boolean | null;
    sentencaDescritora?: string;
    observacao?: string;
}
