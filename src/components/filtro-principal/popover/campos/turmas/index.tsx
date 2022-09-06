import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import Select from '~/components/select';
import filtroService from '~/services/filtro-service';

interface TurmasProps extends FormProps {
  setTurmas: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const Turmas: React.FC<TurmasProps> = ({ form, setTurmas, options }) => {
  const nomeCampo = 'turma';

  const anoLetivo = Form.useWatch('anoLetivo', form);
  const modalidade = Form.useWatch('modalidade', form);
  const anoEscolar = Form.useWatch('anoEscolar', form);
  const ue = Form.useWatch('ue', form);

  const obterTurmas = useCallback(async () => {
    const resposta = await filtroService.obterTurmas(anoLetivo, ue, modalidade, anoEscolar);

    if (resposta?.length) {
      setTurmas(resposta);
      if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
    } else {
      setTurmas([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setTurmas, anoLetivo, ue, modalidade, anoEscolar]);

  useEffect(() => {
    if (anoLetivo && ue && modalidade && anoEscolar) {
      obterTurmas();
    } else {
      setTurmas([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [obterTurmas, setTurmas, form, anoLetivo, ue, modalidade, anoEscolar]);

  return (
    <Form.Item name={nomeCampo} rules={[{ required: !!modalidade, message: 'Campo obrigatório' }]}>
      <Select
        options={options}
        disabled={options?.length === 1}
        placeholder='Turma'
        allowClear
        showSearch
      />
    </Form.Item>
  );
};

export default React.memo(Turmas);
