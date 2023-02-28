import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import Select from '~/components/select';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { Campos } from '~/domain/enums/campos-cadastro-item';

interface MatrizProps extends FormProps {
  setMatrizes: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const Matriz: React.FC<MatrizProps> = ({ form, setMatrizes, options }) => {
  const nomeCampo = Campos.matriz;
  const disciplina = Form.useWatch(Campos.disciplinas, form);
  const matrizForm = Form.useWatch(nomeCampo, form);

  const obterMatrizes = useCallback(async () => {
    const resposta = await configuracaoItemService.obterMatriz(disciplina);
    if (resposta?.length) {
      setMatrizes(resposta);
      if (resposta.length === 1) {
        form?.setFieldValue(nomeCampo, resposta[0].value);
      }
    } else {
      setMatrizes([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setMatrizes, disciplina, nomeCampo]);

  useEffect(() => {
    if (disciplina) {
      obterMatrizes();
    } else {
      setMatrizes([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [setMatrizes, disciplina, obterMatrizes, form, nomeCampo]);

  useEffect(() => {
    if (options?.length > 1 || options?.length == 1) {
      form?.resetFields([nomeCampo]);
      form?.setFieldValue(nomeCampo, options?.length == 1 ? options[0].value : null);
    }
  }, [form, options, nomeCampo]);

  return (
    <Form.Item
      name={nomeCampo}
      label='Matriz de avaliação'
      rules={[
        {
          required: !matrizForm || matrizForm == undefined || matrizForm == null,
          message: 'Campo obrigatório',
        },
      ]}
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

export default Matriz;
