import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React from 'react';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import Select from '~/components/select';
import { validarCampoForm } from '~/utils/funcoes';

interface SelectProps extends FormProps {
    options: DefaultOptionType[];
    disabled?: boolean;
    campoObrigatorio?: boolean;
    nomeCampo: Campos | (string | number)[];
}

const TipoItem: React.FC<SelectProps> = ({
    form,
    options,
    disabled,
    campoObrigatorio,
    nomeCampo,
}) => {
    const campo = nomeCampo;
    const valorCampoForm = Form.useWatch(campo, form);
    const validacaoCampo = validarCampoForm(valorCampoForm);

    const isSelectDisabled = () => {
        if (!campoObrigatorio) return false;
        return !options || options.length === 0 || options.length === 1;
    };

    return (
        <Form.Item
            name={campo}
            label={'Tipo de item'}
            rules={[{
                required: validacaoCampo,
                message: 'Campo obrigatório'
            }]}
        >
            <Select
                options={options}
                value={form?.getFieldValue(campo)}
                onChange={(v) => form?.setFieldValue(campo, v)}   
                placeholder='Selecione'
                allowClear
                showSearch={false}
                disabled={disabled ?? isSelectDisabled()}
            />
        </Form.Item>
    );
};

export default TipoItem;
