import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import Select from '~/components/select';
import configuracaoItemService from '~/services/configuracaoItem-service';

interface DisciplinaProps extends FormProps {
  setDisciplinas: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const Disciplina: React.FC<DisciplinaProps> = ({ form, setDisciplinas, options }) => {
  const nomeCampo = 'disciplinas';

  const area = Form.useWatch('AreaConhecimento', form);

  const obterDisciplinas = useCallback(async () => {
    const resposta = await configuracaoItemService.obterDisciplinas(area);

    if (resposta?.length) {
        setDisciplinas(resposta);
      if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
    } else {
        setDisciplinas([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setDisciplinas, Disciplina]);

  useEffect(() => {
    if (area) {
        obterDisciplinas();
    } else {
        setDisciplinas([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [setDisciplinas, area, obterDisciplinas, form]);

  useEffect(() => {
    if (options?.length > 1) form?.setFieldValue(nomeCampo, null);
  }, [form, options]);

  return (
    <Form.Item name={nomeCampo} rules={[{ required: !!area, message: 'Campo obrigatório' }]}>
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

export default Disciplina;
