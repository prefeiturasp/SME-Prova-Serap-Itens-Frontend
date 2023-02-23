import { Form, FormProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';

import Select from '~/components/select';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { setItem } from '~/redux/modules/cadastro-item/item/actions';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { ItemProps } from '~/redux/modules/cadastro-item/item/reducers';

interface MatrizProps extends FormProps {
  setMatrizes: Dispatch<SetStateAction<DefaultOptionType[]>>;
  options: DefaultOptionType[];
}

const Matriz: React.FC<MatrizProps> = ({ form, setMatrizes, options }) => {
  const dispatch = useDispatch();

  const item = useSelector((state: AppState) => state.item);
  const matrizRedux = useSelector((state: AppState) => state.idMatriz);
  const nomeCampo = Campos.matriz;
  const matrizIdForm = Form.useWatch(Campos.matriz, form);
  const disciplina = Form.useWatch('disciplinas', form);

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
    if (options?.length > 1) form?.setFieldValue(nomeCampo, null);
  }, [form, options, nomeCampo]);

  useEffect(() => {
    const itemAtual: ItemProps = {
      ...item,
      matriz: matrizIdForm,
    };
    dispatch(setItem(itemAtual));
  }, [matrizIdForm, item, dispatch]);

  return (
    <Form.Item
      name={nomeCampo}
      label='Matriz'
      rules={[{ required: !!disciplina, message: 'Campo obrigatório' }]}
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
