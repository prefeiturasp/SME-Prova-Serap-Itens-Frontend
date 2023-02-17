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
  
  
  interface MatrizPropsDispach extends FormProps {
    setModeloMatriz: Dispatch<SetStateAction<string>>;
  modelo: string
}
  
const ModeloMatriz: React.FC<MatrizPropsDispach> = ({ form, setModeloMatriz, modelo }) => {
  const nomeCampo = 'modeloMatriz';

  const matrizId = Form.useWatch('matriz', form);

  const obterModelomatriz= useCallback(async () => {
    console.log("USECALLBACKMATRIZ", matrizId)
    const resposta = await configuracaoItemService.obterModeloMatriz(matrizId);
    console.log("respostaMAtriz", resposta)
    if (resposta) {
        setModeloMatriz(resposta.data.modelo);
    }
      form?.setFieldValue(nomeCampo, null);
    }, [form, matrizId]);


  useEffect(() => {
    if (matrizId) {
        obterModelomatriz();
    } else {
        setModeloMatriz("");
      form?.setFieldValue(nomeCampo, null);
    }
  }, [matrizId, obterModelomatriz, form]);


  return (
    <Form.Item label="Modelo Matriz">
    <strong> {modelo}  <label/> </strong>
    </Form.Item>
  );
};

export default ModeloMatriz;
