import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React from 'react';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import Select from '~/components/select';
import { validarCampoForm } from '~/utils/funcoes';

interface SelectProps extends FormProps {
    options: DefaultOptionType[];
}

const TipoItem: React.FC<SelectProps> = ({
    form,
    options,
}) => {
    const campo = Campos.tipoItem;
    const valorCampoForm = Form.useWatch(campo, form);
    const validacaoCampo = validarCampoForm(valorCampoForm);

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
                disabled={options?.length === 1}
                placeholder='Selecione'
                allowClear
                showSearch={false}
            />
        </Form.Item>
    );
};

export default TipoItem;
