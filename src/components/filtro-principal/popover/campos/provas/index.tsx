import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import Select from '~/components/select';
import filtroService from '~/services/filtro-service';

interface ProvasProps extends FormProps {
  setProvas: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const Provas: React.FC<ProvasProps> = ({ form, setProvas, options }) => {
  const nomeCampo = 'prova';

  const anoLetivo = Form.useWatch('anoLetivo', form);
  const situacaoProva = Form.useWatch('situacaoProva', form);

  const obterProvas = useCallback(async () => {
    const resposta = await filtroService.obterProvas(anoLetivo, situacaoProva);

    if (resposta?.length) {
      setProvas(resposta);
      if (resposta.length === 1) form?.setFieldValue(nomeCampo, [resposta[0].value]);
    } else {
      setProvas([]);
      form?.setFieldValue(nomeCampo, []);
    }
  }, [form, setProvas, anoLetivo, situacaoProva]);

  useEffect(() => {
    if (anoLetivo && situacaoProva) {
      obterProvas();
    } else {
      setProvas([]);
      form?.setFieldValue(nomeCampo, []);
    }
  }, [form, obterProvas, setProvas, anoLetivo, situacaoProva]);

  return (
    <Form.Item name={nomeCampo}>
      <Select
        options={options}
        disabled={options?.length === 1}
        placeholder='Prova'
        allowClear
        showSearch
        mode='multiple'
        maxTagCount='responsive'
      />
    </Form.Item>
  );
};

export default React.memo(Provas);
