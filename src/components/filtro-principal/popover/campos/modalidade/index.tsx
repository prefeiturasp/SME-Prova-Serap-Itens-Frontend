import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import Select from '~/components/select';
import filtroService from '~/services/filtro-service';

interface ModalidadeProps extends FormProps {
  setModalidades: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const Modalidade: React.FC<ModalidadeProps> = ({ form, setModalidades, options }) => {
  const nomeCampo = 'modalidade';

  const obterModalidade = useCallback(async () => {
    const resposta = await filtroService.obterModalidades();

    if (resposta?.length) {
      setModalidades(resposta);
      if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
    } else {
      setModalidades([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setModalidades]);

  useEffect(() => {
    obterModalidade();
  }, [obterModalidade]);

  return (
    <Form.Item name={nomeCampo}>
      <Select
        options={options}
        disabled={options?.length === 1}
        placeholder='Modalidade'
        allowClear
      />
    </Form.Item>
  );
};

export default React.memo(Modalidade);
