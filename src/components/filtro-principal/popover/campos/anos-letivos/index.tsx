import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import Select from '~/components/select';
import filtroService from '~/services/filtro-service';

interface AnosLetivosProps extends FormProps {
  options: DefaultOptionType[];
  setAnosLetivos: Dispatch<SetStateAction<DefaultOptionType[]>>;
}

const AnosLetivos: React.FC<AnosLetivosProps> = ({ form, options, setAnosLetivos }) => {
  const nomeCampo = 'anoLetivo';

  const obterAnosLetivos = useCallback(async () => {
    const resposta = await filtroService.obterAnosLetivos();
    if (resposta?.length) {
      setAnosLetivos(resposta);
      if (!form?.getFieldValue(nomeCampo)) {
        form?.setFieldValue(nomeCampo, resposta[0].value);
      }
    } else {
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setAnosLetivos]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  return (
    <Form.Item name={nomeCampo}>
      <Select options={options} disabled={options?.length === 1} />
    </Form.Item>
  );
};

export default React.memo(AnosLetivos);
