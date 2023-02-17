import React , { Dispatch, SetStateAction, useCallback, useEffect }   from "react";
import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import Select from '~/components/select';
import configuracaoItemService from '~/services/configuracaoItem-service';

interface AreaConhecimentoProps extends FormProps {
  setArea: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const AreaConhecimento: React.FC<AreaConhecimentoProps> = ({ form, setArea, options }) => {
  const nomeCampo = 'AreaConhecimento';

  const obterArea = useCallback(async () => {
    const resposta = await configuracaoItemService.obterAreaConhecimento();

    if (resposta?.length) {
      setArea(resposta);
      console.log(resposta);
      if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
    } else {
      setArea([]);
      form?.setFieldValue(nomeCampo, null);
    }
  }, [form, setArea]);

  useEffect(() => {
    obterArea();
  }, [obterArea]);

  useEffect(() => {
    if (options?.length > 1) form?.setFieldValue(nomeCampo, null);
  }, [form, options]);


  return (
    <Form.Item name={nomeCampo} label="Area Conhecimento">
      <Select
        options={options}
        disabled={options?.length === 1}
        placeholder='Selecione...'
        showSearch
        allowClear
      />
    </Form.Item>
  );
};

export  default AreaConhecimento;



