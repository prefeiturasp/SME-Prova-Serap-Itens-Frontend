import { Form, FormItemProps, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect } from 'react';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import Select from '~/components/select';
import { validarCampoForm } from '~/utils/funcoes';
import './select-form.css';

interface SelectProps extends FormProps {
    label: string;
    nomeCampo: Campos | (string | number)[];
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
        const valorAtual = form?.getFieldValue(campo);

        // Se não há opções, limpa o campo
        if (!options?.length) {
            form?.setFieldValue(campo, null);
            return;
        }

        // Se só há uma opção e o campo está vazio, preenche automaticamente
        if (options.length === 1 && !valorAtual) {
            const novoValor = labelInValue ? options[0] : options[0].value;
            form?.setFieldValue(campo, novoValor);
            return;
        }

        // Se o valor atual não está mais entre as opções, limpa
        const valoresDisponiveis = options.map((opt) =>
            labelInValue ? opt as DefaultOptionType : opt.value as string | number
        );

        const existe = valoresDisponiveis.some((opt) => {
            if (labelInValue && typeof opt === 'object') {
                return opt.value === valorAtual?.value;
            }
            return opt === valorAtual;
        });


        if (!existe) {
            form?.setFieldValue(campo, null);
        }
    }, [options, campo, form, labelInValue]);

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
            name={nomeCampo}
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
