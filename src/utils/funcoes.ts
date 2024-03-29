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
    return valor == undefined || valor == null;
};

export const validarCampoArrayStringForm = (valor: string[]): boolean => {
    return !valor || valor == undefined || valor == null || valor?.length == 0;
};

export const ruleCampoObrigatorioForm = (valor: any): Rule[] => {
    return [
        {
            required: validarCampoForm(valor),
            message: 'Campo obrigatório',
        }
    ]
};

export const ruleCampoArrayStringObrigatorioForm = (valor: string[]): Rule[] => {
    return [
        {
            required: validarCampoArrayStringForm(valor),
            message: 'Campo obrigatório',
        }
    ]
};
