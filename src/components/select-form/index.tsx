import { Form, FormItemProps, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect } from 'react';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import Select from '~/components/select';
import { validarCampoForm } from '~/utils/funcoes';
import './select-form.css';

interface SelectProps extends FormProps {
    label: string;
    nomeCampo: Campos;
    options: DefaultOptionType[];
    campoObrigatorio: boolean;
    labelInValue?: boolean;
    disabled?: boolean;
}

const SelectForm: React.FC<SelectProps> = ({
    form,
    options,
    nomeCampo,
    label,
    campoObrigatorio,
    labelInValue = false,
    disabled,
}) => {
    const campo = nomeCampo;
    const valorCampoForm = Form.useWatch(campo, form);
    const validacaoCampo = validarCampoForm(valorCampoForm);

    useEffect(() => {
        if (options?.length > 1 || options?.length == 1) {
            form?.resetFields([campo]);
            let newValue = null;
            if (options?.length === 1) {
                newValue = labelInValue ? options[0] : options[0].value;
            }
            form?.setFieldValue(campo, newValue);
        }
    }, [form, options, campo]);

    const customFormItemProps: FormItemProps = {};

    if (labelInValue) {
        customFormItemProps.getValueFromEvent = (_, value) => value;
    }

    const isSelectDisabled = () => {
        if (!campoObrigatorio) return false;
        return options?.length === 1 || options?.length === 0;
    };

    return (
        <Form.Item
            name={campo}
            label={label}
            rules={[{
                required: campoObrigatorio && validacaoCampo,
                message: 'Campo obrigatório'
            }]}
            {...customFormItemProps}
        >
            <Select
                labelInValue={labelInValue}
                options={options}
                className="select-custom"
                disabled={disabled ?? isSelectDisabled()}
                placeholder='Selecione'
                allowClear
                showSearch={false}
            />
        </Form.Item>
    );
};

export default SelectForm;
