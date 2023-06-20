import { DefaultOptionType } from 'antd/lib/select';
import { CheckboxOptionType } from 'antd/es/checkbox/Group';

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
}
