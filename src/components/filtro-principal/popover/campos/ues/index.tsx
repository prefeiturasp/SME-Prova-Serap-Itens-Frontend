import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import Select from '~/components/select';
import filtroService from '~/services/filtro-service';

interface UeProps extends FormProps {
  setUes: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const Ue: React.FC<UeProps> = ({ form, setUes, options }) => {
  const nomeCampo = 'ue';

  const dre = Form.useWatch('dre', form);
  const modalidade = Form.useWatch('modalidade', form);

  const obterUe = useCallback(async () => {
    const resposta = await filtroService.obterUes(dre);

    if (resposta?.length) {
      setUes(resposta);
      if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
    } else {
      setUes([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setUes, dre]);

  useEffect(() => {
    if (dre) {
      obterUe();
    } else {
      setUes([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [setUes, dre, obterUe, form]);

  useEffect(() => {
    if (!modalidade && options?.length > 1) form?.setFieldValue(nomeCampo, null);
  }, [modalidade, form, options]);

  return (
    <Form.Item name={nomeCampo} rules={[{ required: !!modalidade, message: 'Campo obrigatório' }]}>
      <Select
        options={options}
        disabled={options?.length === 1}
        placeholder='Unidade Educacional (UE)'
        allowClear
        showSearch
      />
    </Form.Item>
  );
};

export default React.memo(Ue);
