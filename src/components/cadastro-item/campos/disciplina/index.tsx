import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import Select from '~/components/select';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { Campos } from '~/domain/enums/campos-cadastro-item';

interface DisciplinaProps extends FormProps {
  setDisciplinas: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const Disciplina: React.FC<DisciplinaProps> = ({ form, setDisciplinas, options }) => {
  const nomeCampo = Campos.disciplinas;

  const area = Form.useWatch('AreaConhecimento', form);
  const disciplinaForm = Form.useWatch(nomeCampo, form);
  const obterDisciplinas = useCallback(async () => {

    const resposta = await configuracaoItemService.obterDisciplinas(area);

    if (resposta?.length) {
      setDisciplinas(resposta);
      if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
    } else {
      setDisciplinas([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setDisciplinas, area]);

  useEffect(() => {
    if (area) {
      obterDisciplinas();
    } else {
      setDisciplinas([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [setDisciplinas, area, obterDisciplinas, form]);

  useEffect(() => {
    if (options?.length > 1 || options?.length == 1) {
      form?.resetFields([nomeCampo]);
      form?.setFieldValue(nomeCampo, options?.length == 1 ? options[0].value : null);
    }
  }, [form, options, nomeCampo]);

  return (
    <Form.Item
      name={nomeCampo}
      label="Componente curricular"
      rules={[{ required: (!disciplinaForm || disciplinaForm == undefined || disciplinaForm == null), message: 'Campo obrigatório' }]}
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

export default Disciplina;
