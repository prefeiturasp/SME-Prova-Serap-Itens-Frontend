import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect } from 'react';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { Rule } from 'rc-field-form/lib/interface';
import Select from '~/components/select';

interface SelectProps extends FormProps {
    label: string;
    nomeCampo: Campos;
    options: DefaultOptionType[];
    rules?: Rule[];
}

const SelectForm: React.FC<SelectProps> = ({ form, options, nomeCampo, label, rules }) => {
    const campo = nomeCampo;

    useEffect(() => {
        if (options?.length > 1) form?.setFieldValue(campo, null);
    }, [form, options, campo]);

    return (
        <Form.Item
            name={campo}
            label={label}
            rules={rules}
        >
            <Select
                options={options}
                disabled={options?.length === 1}
                placeholder='Selecione'
                allowClear
                showSearch
            />
        </Form.Item>
    );
};

export default SelectForm;
