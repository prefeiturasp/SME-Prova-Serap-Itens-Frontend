import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import Select from '~/components/select';
import configuracaoItemService from '~/services/configuracaoItem-service';

interface MatrizProps extends FormProps {
    setMatrizes: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const Matriz: React.FC<MatrizProps> = ({ form, setMatrizes, options }) => {
  const nomeCampo = 'matriz';

  const disciplina = Form.useWatch('disciplinas', form);

  const obterMatrizes = useCallback(async () => {  
    const resposta = await configuracaoItemService.obterMatriz(disciplina);
    if (resposta?.length) {
        setMatrizes(resposta);
      if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
    } else {
        setMatrizes([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setMatrizes, disciplina]);

  useEffect(() => {
    if (disciplina) {
        obterMatrizes();
    } else {
        setMatrizes([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [setMatrizes, disciplina, obterMatrizes, form]);

  useEffect(() => {
    if (options?.length > 1) form?.setFieldValue(nomeCampo, null);
  }, [form, options]);

  return (
    <Form.Item name={nomeCampo} label="Matriz" rules={[{ required: !!disciplina, message: 'Campo obrigatório' }]}>
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

export default Matriz;
