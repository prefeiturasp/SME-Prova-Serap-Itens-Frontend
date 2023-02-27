import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect } from 'react';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import Select from '~/components/select';
import { validarCampoForm } from '~/utils/funcoes';

interface SelectProps extends FormProps {
    label: string;
    nomeCampo: Campos;
    options: DefaultOptionType[];
    campoObrigatorio: boolean;
}

const SelectForm: React.FC<SelectProps> = ({
    form,
    options,
    nomeCampo,
    label,
    campoObrigatorio
}) => {
    const campo = nomeCampo;
    const valorCampoForm = Form.useWatch(campo, form);
    const validacaoCampo = validarCampoForm(valorCampoForm);

    useEffect(() => {
        if (options?.length > 1) {
            form?.resetFields([campo]);
            form?.setFieldValue(campo, null);
        }
        if (options?.length == 1) {
            form?.resetFields([campo]);
            form?.setFieldValue(campo, options[0].value);
        }
    }, [form, options, campo]);

    return (
        <Form.Item
            name={campo}
            label={label}
            rules={[{
                required: campoObrigatorio && validacaoCampo,
                message: 'Campo obrigatório'
            }]}
        >
            <Select
                options={options}
                disabled={options?.length === 1}
                placeholder='Selecione'
                allowClear
                showSearch={false}
            />
        </Form.Item>
    );
};

export default SelectForm;
