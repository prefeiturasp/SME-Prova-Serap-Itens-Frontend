import { Form, FormProps } from 'antd';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import configuracaoItemService from '~/services/configuracaoItem-service';

export interface MatrizObj {
  id: number,
  legadoId: number,
  descricao: string,
  modelo: string,
  disciplinaId: number
}


interface NivelEnsinoPropsDispach extends FormProps {
  setNivelEnsino: Dispatch<SetStateAction<string>>;
  nivelEnsino: string
}

const NivelEnsino: React.FC<NivelEnsinoPropsDispach> = ({ form, setNivelEnsino, nivelEnsino }) => {
  const nomeCampo = 'nivelEnsino';

  const disciplinaId = Form.useWatch('disciplinas', form);

  const obterNivelEnsinoDisciplina = useCallback(async () => {
    const resposta = await configuracaoItemService.obterNivelEnsino(disciplinaId);
    if (resposta) {
      setNivelEnsino(resposta.data.nivelEnsino);
    }
    form?.setFieldValue(nomeCampo, null);
  }, [form, disciplinaId]);


  useEffect(() => {
    if (disciplinaId) {
      obterNivelEnsinoDisciplina();
    } else {
      setNivelEnsino("");
      form?.setFieldValue(nomeCampo, null);
    }
  }, [disciplinaId, obterNivelEnsinoDisciplina, form]);

  return (
    <Form.Item label="Nível Ensino">
      <strong> {nivelEnsino}</strong>
    </Form.Item>
  );
};

export default NivelEnsino;
