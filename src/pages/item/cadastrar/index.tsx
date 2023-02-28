import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row, Input, Space, notification, Spin } from 'antd';
import AreaConhecimento from '~/components/configuracao-item/campos/area-conhecimento';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import Disciplina from '~/components/configuracao-item/campos/disciplina';
import NivelEnsino from '~/components/configuracao-item/campos/nivel-ensino';
import { DefaultOptionType } from 'antd/lib/select';
import Matriz from '~/components/configuracao-item/campos/matriz';
import ModeloMatriz from '~/components/configuracao-item/modelo-matriz';
import styled from 'styled-components';
import { Colors } from '~/styles/colors';
import { ItemDto } from '~/domain/dto/item-dto';
import configuracaoItemService from '~/services/configuracaoItem-service';
import './cadastroItemStyles.css';
import { Tab } from 'rc-tabs/lib/interface';
import { Tabs } from 'antd';
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
import ComponentesItem from '~/components/configuracao-item/tabs/tab-componentes-item';
import { Campos } from '~/domain/enums/campos-cadastro-item';

export const Container = styled.div`
  height: 30px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Title = styled.div`
  color: #595959;
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 30px;
  padding-left: 2rem;
  padding-right: 4rem;
  background: ${Colors.CinzaFundo};
`;

const ItemCadastro: React.FC = () => {
  const dispatch = useDispatch();
  const [carregando, setCarregando] = useState<boolean>(false);
  const item = useSelector((state: AppState) => state.item);
  const configuracaoItem = useSelector((state: AppState) => state.configuracaoItem);
  const componentesItem = useSelector((state: AppState) => state.componentesItem);
  const elaboracaoItem = useSelector((state: AppState) => state.elaboracaoItem);
  const matriz = useSelector((state: AppState) => state.matriz);
  const disciplina = useSelector((state: AppState) => state.disciplina);

  const [objTabConfiguracaoItem, setObjTabConfiguracaoItem] =
    useState<ConfiguracaoItemProps>(configuracaoItem);
  const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
  const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
  const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);

  const [modelomatriz, setModeloMatriz] = useState<string>(matriz.modelo);
  const [nivelEnsino, setNivelEnsino] = useState<string>(disciplina.nivelEnsino);

  const [form] = Form.useForm();

  const disciplinaidForm = Form.useWatch(Campos.disciplinas, form);
  const areaConhecimentoIdForm = Form.useWatch(Campos.areaConhecimento, form);
  const matrizIdForm = Form.useWatch(Campos.matriz, form);

  const [itemSalvar, setItemSalvar] = useState<ItemDto>({} as ItemDto);

  const bloquearSalvar =
    configuracaoItem.disciplina == undefined ||
    !configuracaoItem.disciplina ||
    !configuracaoItem.areaConhecimento ||
    configuracaoItem.areaConhecimento == undefined ||
    !configuracaoItem.matriz ||
    configuracaoItem.matriz == undefined ||
    componentesItem.competencia == undefined ||
    !componentesItem.competencia ||
    componentesItem.habilidade == undefined ||
    !componentesItem.habilidade ||
    componentesItem.anoMatriz == undefined ||
    !componentesItem.anoMatriz ||
    componentesItem.dificuldadeSugerida == undefined ||
    !componentesItem.dificuldadeSugerida ||
    componentesItem.discriminacao == undefined ||
    !componentesItem.discriminacao ||
    componentesItem.dificuldade == undefined ||
    !componentesItem.dificuldade ||
    componentesItem.acertoCasual == undefined ||
    !componentesItem.acertoCasual;

  const bloquearSalvarRascunho =
    configuracaoItem.disciplina == undefined ||
    !configuracaoItem.disciplina ||
    !configuracaoItem.areaConhecimento ||
    configuracaoItem.areaConhecimento == undefined ||
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
      codigoItem: configuracaoItem.codigo > 0 ? configuracaoItem.codigo : null,
      areaConhecimentoId: configuracaoItem.areaConhecimento,
      disciplinaId: configuracaoItem.disciplina,
      matrizId: configuracaoItem.matriz,
      competenciaId: componentesItem.competencia,
      habilidadeId: componentesItem.habilidade,
      anoMatrizId: componentesItem.anoMatriz,
      dificuldadeId: componentesItem.dificuldadeSugerida,
      discriminacao: componentesItem.discriminacao,
      dificuldade: componentesItem.dificuldade,
      acertoCasual: componentesItem.acertoCasual,
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
          const configuracaoItem: ConfiguracaoItemProps = {
            codigo: resp?.data?.codigoItem,
            areaConhecimento: resp?.data?.areaConhecimento,
            disciplina: resp?.data?.disciplina,
            matriz: resp?.data?.matriz,
          };
          const itemAtual: ItemProps = {
            ...item,
            id: id,
            configuracao: configuracaoItem,
          };
          dispatch(setItem(itemAtual));
        })
        .catch((err) => {
          console.log('Erro', err.message);
        });
      setCarregando(false);
    },
    [dispatch, item],
  );

  const inserirItem = useCallback(
    async (item: ItemDto) => {
      await configuracaoItemService
        .salvarItem(item)
        .then((resp) => {
          obterDadosItem(resp.data);
          mensagem('success', 'Sucesso', 'Item cadastrado com suesso');
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
          mensagem('success', 'Sucesso', 'Rascunho de item cadastrado com suesso');
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

  useEffect(() => {
    form.resetFields();
  }, [form, listaAreaConhecimento]);

  useEffect(() => {
    const novoObj: ConfiguracaoItemProps = {
      codigo: 0,
      areaConhecimento: areaConhecimentoIdForm,
      disciplina: disciplinaidForm,
      matriz: matrizIdForm,
    };
    setObjTabConfiguracaoItem(novoObj);
  }, [disciplinaidForm, areaConhecimentoIdForm, matrizIdForm]);

  useEffect(() => {
    dispatch(setConfiguracaoItem(objTabConfiguracaoItem));
  }, [objTabConfiguracaoItem, dispatch]);

  const contentTabConfiguracao: React.ReactNode = (
    <>
      <div id='tabConfiguracao'>
        <Row gutter={2}>
          <Col span={8}>
            <Form.Item label='Código'>
              <Input
                disabled={true}
                placeholder='Código Item'
                value={configuracaoItem?.codigo > 0 ? configuracaoItem.codigo : ''}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={8}>
            <AreaConhecimento
              form={form}
              options={listaAreaConhecimento}
              setArea={setListaAreaConhecimento}
            ></AreaConhecimento>
          </Col>
          <Col span={8}>
            <Disciplina
              form={form}
              options={listaDisciplinas}
              setDisciplinas={setListaDisciplinas}
            ></Disciplina>
          </Col>
          <Col span={8}>
            <Matriz form={form} options={listaMatriz} setMatrizes={setListaMatriz}></Matriz>
          </Col>
        </Row>
        <hr />
        <Row gutter={10}>
          <Col>
            <ModeloMatriz
              setModeloMatriz={setModeloMatriz}
              modelo={modelomatriz}
              form={form}
            ></ModeloMatriz>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col>
            <NivelEnsino
              setNivelEnsino={setNivelEnsino}
              nivelEnsino={nivelEnsino}
              form={form}
            ></NivelEnsino>
          </Col>
        </Row>
      </div>
    </>
  );

  const tabs: Array<Tab> = [
    { key: '1', label: 'Configuração', children: contentTabConfiguracao },
    {
      key: '2',
      label: 'Componentes do item',
      children: <ComponentesItem form={form} />,
    },
    { key: '3', label: 'Elaboração do item', children: <h1>Elaboração do item</h1> },
  ];

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
        >
          <Tabs className='margemTabs' defaultActiveKey='1' type='card' items={tabs} />
        </Form>
      </Spin>
    </>
  );
};

export default React.memo(ItemCadastro);
