import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import Select from '~/components/select';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { Campos } from '~/domain/enums/campos-cadastro-item';

interface AreaConhecimentoProps extends FormProps {
  setArea: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const AreaConhecimento: React.FC<AreaConhecimentoProps> = ({ form, setArea, options }) => {
  const nomeCampo = Campos.areaConhecimento;
  const area = Form.useWatch(nomeCampo, form);

  const obterArea = useCallback(async () => {
    const resposta = await configuracaoItemService.obterAreaConhecimento();

    if (resposta?.length) {
      setArea(resposta);
      if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
    } else {
      setArea([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setArea, nomeCampo]);

  useEffect(() => {
    obterArea();
  }, [obterArea]);

  useEffect(() => {
    if (options?.length > 1 || options?.length == 1) {
      form?.resetFields([nomeCampo]);
      form?.setFieldValue(nomeCampo, options?.length == 1 ? options[0].value : null);
    }
  }, [form, options, nomeCampo]);


  return (
    <Form.Item
      name={nomeCampo}
      label='Área de conhecimento'
      rules={[
        {
          required: (!area || area == undefined || area == null),
          message: 'Campo obrigatório',
        }]}
    >
      <Select
        options={options}
        disabled={options?.length === 1}
        placeholder='Selecione...'
        showSearch
        allowClear
      />
    </Form.Item>
  );
};

export default React.memo(AreaConhecimento);
