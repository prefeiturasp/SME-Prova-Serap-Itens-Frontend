import { DefaultOptionType } from 'antd/lib/select';
import { CheckboxOptionType } from 'antd/es/checkbox/Group';
import type { Rule } from 'node_modules/rc-field-form/lib/interface';

export const converterListaParaCheckboxOption = (lista?: DefaultOptionType[]) => {
    if (!lista || lista?.length == 0 || lista == null || lista == undefined)
        return [];
    const retorno = lista.map((item) => {
        return { value: item.value, label: item.label } as CheckboxOptionType
    });
    return retorno;
};

export const validarCampoForm = (valor: any): boolean => {
    return !valor || valor == undefined || valor == null;
};

export const ruleCampoObrigatorioForm = (valor: any): Rule[] => {
    return [
        {
            required: validarCampoForm(valor),
            message: 'Campo obrigatório',
        }
    ]
};

export const tiposItem =
    [
        { value: 1, label: 'Dicotômico' },
        { value: 2, label: 'Politômico' },
    ] as DefaultOptionType[];

export const mockAssuntos =
    [
        { value: 1, label: 'Objeto de Conhecimento' },
        { value: 2, label: 'Resolução de Problema' },
        { value: 3, label: 'Ciências' },
        { value: 4, label: 'Ciências Humanas' },
        { value: 5, label: 'Educação Físisca' },
    ] as DefaultOptionType[];

export const mockSubAssuntos =
    [
        { value: 38, label: 'aspectos gráficos' },
        { value: 39, label: 'aspectos semânticos e lexicais' },
        { value: 41, label: 'capacidades de apreciação e réplica do leitor em relação ao texto.' },
        { value: 42, label: 'capacidades de compreensão de texto' },
    ] as DefaultOptionType[];

export const mockSituacoesItem =
    [
        { value: 1, label: 'Ativo' },
        { value: 2, label: 'Inativo' },
        { value: 3, label: 'Pendente' },
        { value: 4, label: 'Rascunho' },
    ] as DefaultOptionType[];

export const mockQuantidadeAlternativas =
    [
        { value: 22, label: 'Múltipla escolha 10 alternativas' },
        { value: 23, label: 'Múltipla escolha 4 alternativas' },
        { value: 24, label: 'Múltipla escolha 3 alternativas' },
        { value: 25, label: 'Múltipla escolha 2 alternativas' },
        { value: 26, label: 'Múltipla escolha 5 alternativas' },
        { value: 27, label: 'Múltipla escolha 6 alternativas' },
        { value: 28, label: 'Múltipla escolha 7 alternativas' },
        { value: 29, label: 'Múltipla escolha 8 alternativas' },
        { value: 30, label: 'Múltipla escolha 9 alternativas' },
    ] as DefaultOptionType[];
