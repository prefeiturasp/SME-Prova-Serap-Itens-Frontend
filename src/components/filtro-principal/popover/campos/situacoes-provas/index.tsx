import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import Select from '~/components/select';
import filtroService from '~/services/filtro-service';

interface SituacoesProvasProps extends FormProps {
  setSituacoesProvas: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const SituacoesProvas: React.FC<SituacoesProvasProps> = ({ form, setSituacoesProvas, options }) => {
  const nomeCampo = 'situacaoProva';

  const obterSituacoes = useCallback(async () => {
    const resposta = await filtroService.obterSituacoes();

    if (resposta?.length) {
      setSituacoesProvas(resposta);
      if (!form?.getFieldValue(nomeCampo)) {
        form?.setFieldValue(nomeCampo, resposta[0].value);
      }
    } else {
      setSituacoesProvas([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setSituacoesProvas]);

  useEffect(() => {
    obterSituacoes();
  }, [obterSituacoes]);

  return (
    <Form.Item name={nomeCampo}>
      <Select options={options} disabled={options?.length === 1} />
    </Form.Item>
  );
};

export default React.memo(SituacoesProvas);
