import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row, Space, notification, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { ItemDto } from '~/domain/dto/item-dto';
import configuracaoItemService from '~/services/configuracaoItem-service';
import './cadastroItemStyles.css';
import {
  setItem,
  setConfiguracaoItem,
  setComponentesItem,
  setElaboracaoItem,
} from '~/redux/modules/cadastro-item/item/actions';
import {
  ItemProps,
  ConfiguracaoItemProps,
  ComponentesItemProps,
  ElaboracaoItemProps,
} from '~/redux/modules/cadastro-item/item/reducers';
import { Title } from '~/components/cadastro-item/elementos';
import TabForm from '~/components/cadastro-item/tab-form';
import { DadosIniciais } from '~/domain/enums/campos-cadastro-item';
import { validarCampoForm, validarCampoArrayStringForm } from '~/utils/funcoes';

const ItemCadastro: React.FC = () => {
  const dispatch = useDispatch();
  const [carregando, setCarregando] = useState<boolean>(false);
  const item = useSelector((state: AppState) => state.item);
  const configuracaoItem = useSelector((state: AppState) => state.configuracaoItem);
  const componentesItem = useSelector((state: AppState) => state.componentesItem);
  const elaboracaoItem = useSelector((state: AppState) => state.elaboracaoItem);

  const [objTabConfiguracaoItem, setObjTabConfiguracaoItem] =
    useState<ConfiguracaoItemProps>(configuracaoItem);

  const [form] = Form.useForm();
  const initialValuesForm = {
    infoEstatisticasDiscriminacao: '',
    infoEstatisticasDificuldade: '',
    infoEstatisticasAcertoCasual: '',
    parametroBTransformado: '',
    tipoItem: DadosIniciais.tipoItemIdPadrao,
  };

  const [itemSalvar, setItemSalvar] = useState<ItemDto>({} as ItemDto);

  const bloquearSalvar =
    validarCampoForm(configuracaoItem.disciplina) ||
    validarCampoForm(configuracaoItem.areaConhecimento) ||
    validarCampoForm(configuracaoItem.matriz) ||
    validarCampoForm(componentesItem.competencia) ||
    validarCampoForm(componentesItem.habilidade) ||
    validarCampoForm(componentesItem.anoMatriz) ||
    validarCampoForm(componentesItem.dificuldadeSugerida) ||
    validarCampoForm(componentesItem.situacaoItem) ||
    validarCampoForm(componentesItem.quantidadeAlternativas) ||
    validarCampoArrayStringForm(componentesItem.palavrasChave ?? []);

  const bloquearSalvarRascunho =
    validarCampoForm(configuracaoItem.disciplina) ||
    validarCampoForm(configuracaoItem.areaConhecimento) ||
    !bloquearSalvar;

  const [bloquearBtnSalvar, setBloquearBtnSalvar] = useState<boolean>(bloquearSalvar);
  const [bloquearBtnSalvarRascunho, setBloquearBtnSalvarRascunho] =
    useState<boolean>(bloquearSalvarRascunho);

  useEffect(() => {
    setBloquearBtnSalvar(bloquearSalvar);
    setBloquearBtnSalvarRascunho(bloquearSalvarRascunho);
  }, [bloquearSalvar, bloquearSalvarRascunho]);

  type tipoMsg = 'success' | 'info' | 'warning' | 'error';
  const [api, contextHolder] = notification.useNotification();
  const mensagem = useCallback(
    async (tipo: tipoMsg, titulo: string, msg: string) => {
      api[tipo]({ message: titulo, description: msg });
    },
    [api],
  );

  const voltar = () => {
    setCarregando(true);
    const itemAtual: ItemProps = {
      id: 0,
      configuracao: {} as ConfiguracaoItemProps,
      componentes: {} as ComponentesItemProps,
      elaboracao: {} as ElaboracaoItemProps,
    };
    dispatch(setItem(itemAtual));
    dispatch(setConfiguracaoItem({} as ConfiguracaoItemProps));
    dispatch(setComponentesItem({} as ComponentesItemProps));
    dispatch(setElaboracaoItem({} as ElaboracaoItemProps));
    setItemSalvar({} as ItemDto);
    form.resetFields();
    setCarregando(false);
  };

  const gerarItemSalvar = useCallback(() => {
    const dto: ItemDto = {
      id: item.id,
      codigoItem: configuracaoItem.codigo,
      areaConhecimentoId: configuracaoItem.areaConhecimento,
      disciplinaId: configuracaoItem.disciplina,
      matrizId: configuracaoItem.matriz,
      competenciaId: componentesItem.competencia,
      habilidadeId: componentesItem.habilidade,
      anoMatrizId: componentesItem.anoMatriz,
      assuntoId: componentesItem.assunto,
      subAssuntoId: componentesItem.subAssunto,
      situacao: componentesItem.situacaoItem,
      tipo: componentesItem.tipoItem,
      quantidadeAlternativasId: componentesItem.quantidadeAlternativas,
      dificuldadeSugeridaId: componentesItem.dificuldadeSugerida,
      discriminacao: componentesItem.discriminacao !== '' ? componentesItem.discriminacao : null,
      dificuldade: componentesItem.dificuldade !== '' ? componentesItem.dificuldade : null,
      acertoCasual: componentesItem.acertoCasual !== '' ? componentesItem.acertoCasual : null,
      palavrasChave: componentesItem.palavrasChave,
      parametroBTransformado: componentesItem.parametroBTransformado  !== '' ? componentesItem.parametroBTransformado  : null ,
      mediaEhDesvio: componentesItem.mediaDesvioPadrao,
      observacao: componentesItem.observacao,
      textoBase: elaboracaoItem?.textoBase ?? '',
    };
    setItemSalvar(dto);
  }, [item, configuracaoItem, componentesItem, elaboracaoItem]);

  const dadosItemSalvar = useMemo(() => gerarItemSalvar(), [gerarItemSalvar]);

  const obterDadosItem = useCallback(
    async (id: number) => {
      setCarregando(true);
      await configuracaoItemService
        .obterItem(id)
        .then((resp) => {
          const configuracaoItemRetorno: ConfiguracaoItemProps = {
            ...objTabConfiguracaoItem, 
                      codigo: resp?.data?.codigoItem,
                  };
                  const itemAtual: ItemProps = { ...item,
                                                  id: id,
                                  configuracao: configuracaoItemRetorno, };
                                  setObjTabConfiguracaoItem(configuracaoItemRetorno); 
                                  dispatch(setConfiguracaoItem(configuracaoItemRetorno)); 
                  dispatch(setItem(itemAtual));
        })
        .catch((err) => {
          console.log('Erro', err.message);
        });
      setCarregando(false);
    },
    [dispatch, item, objTabConfiguracaoItem],
  );

  const inserirItem = useCallback(
    async (item: ItemDto) => {
      await configuracaoItemService
        .salvarItem(item)
        .then((resp) => {
          obterDadosItem(resp.data);
          mensagem('success', 'Sucesso', 'Item cadastrado com sucesso');
        })
        .catch((err) => {
          console.log('Erro', err.message);
          mensagem('error', 'Erro', 'ocorreu um erro ao cadastrar o item');
        });
    },
    [mensagem, obterDadosItem],
  );

  const inserirRascunhoItem = useCallback(
    async (item: ItemDto) => {
      await configuracaoItemService
        .salvarRascunhoItem(item)
        .then((resp) => {
          obterDadosItem(resp.data);
          mensagem('success', 'Sucesso', 'Rascunho de item cadastrado com sucesso');
        })
        .catch((err) => {
          console.log('Erro', err.message);
          mensagem('error', 'Erro', 'ocorreu um erro ao cadastrar o rascunho');
        });
    },
    [mensagem, obterDadosItem],
  );

  const salvarItem = useCallback(async () => {
    setCarregando(true);
    dadosItemSalvar;
    if (item?.id > 0) {
      mensagem('info', 'Atenção', `Item já cadastrado, id:${item.id}`);
    } else {
      if (!bloquearBtnSalvar) {
        await inserirItem(itemSalvar);
      } else {
        await inserirRascunhoItem(itemSalvar);
      }
    }
    setCarregando(false);
  }, [
    item.id,
    itemSalvar,
    bloquearBtnSalvar,
    mensagem,
    inserirItem,
    inserirRascunhoItem,
    dadosItemSalvar,
  ]);

  return (
    <>
      <Spin size='small' spinning={carregando}>
        {contextHolder}
        <Title>
          <Row gutter={2}>
            <Col span={12}>
              <h1>Cadastrar novo item</h1>
            </Col>
            <Col span={12}>
              <Space wrap className='botoesCadastro'>
                <Button onClick={voltar}>Voltar</Button>
                <Button type='primary' onClick={salvarItem} disabled={bloquearBtnSalvarRascunho}>
                  Salvar rascunho
                </Button>
                <Button type='primary' onClick={salvarItem} disabled={bloquearBtnSalvar}>
                  Salvar
                </Button>
              </Space>
            </Col>
          </Row>
        </Title>

        <Form
          className='form'
          form={form}
          layout='vertical'
          autoComplete='off'
          initialValues={initialValuesForm}
        >
          <TabForm form={form} />
        </Form>
      </Spin>
    </>
  );
};

export default React.memo(ItemCadastro);
