import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Input, Layout, Space, notification, Spin } from 'antd';
import AreaConhecimento from '~/components/configuracao-item/campos/area-conhecimento';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import Disciplina from '~/components/configuracao-item/campos/disciplina';
import NivelEnsino from '~/components/configuracao-item/campos/nivel-ensino';
import { DefaultOptionType } from 'antd/lib/select';
import Matriz from '~/components/configuracao-item/campos/matriz';
import ModeloMatriz from '~/components/configuracao-item/modelo-matriz';
import Header from '~/components/header'
import styled from 'styled-components';
import { Colors } from '~/styles/colors';
import { ItemDto } from '~/domain/dto/item-dto';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { Tabs } from 'antd';
import './cadastroItemStyles.css';
import { Tab } from 'rc-tabs/lib/interface';
import { setItem } from '~/redux/modules/cadastro-item/item/actions';
import { ItemProps } from '~/redux/modules/cadastro-item/item/reducers';

const Titulo = styled(Layout.Header)`
  padding: 10;
  color: #595959;
  font-weight: 500;
  font-size: 20px;
  justify-content: flex-start;
  z-index: 1;
  width: 100%;
  height: 150px;
  background: ${Colors.CinzaFundo};
`;

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
  background: ${Colors.CinzaFundo};
`;

const ItemCadastro: React.FC = () => {
  const dispatch = useDispatch();
  const [carregando, setCarregando] = useState<boolean>(false);
  const item = useSelector((state: AppState) => state.item);
  const matriz = useSelector((state: AppState) => state.matriz);
  const disciplina = useSelector((state: AppState) => state.disciplina);

  const [objAreaConhecimento, setArea] = useState<DefaultOptionType[]>(item.listaAreaConhecimentos);
  const [objDisciplina, setDisciplinas] = useState<DefaultOptionType[]>(item.listaDisciplinas);
  const [objMatriz, setMatriz] = useState<DefaultOptionType[]>(item.listaMatriz);
  const [modelomatriz, setModeloMatriz] = useState<string>(matriz.modelo);
  const [nivelEnsino, setNivelEnsino] = useState<string>(disciplina.nivelEnsino);

  const [form] = Form.useForm();

  const disciplinaid = Form.useWatch('disciplinas', form);
  const areaConhecimentoId = Form.useWatch('AreaConhecimento', form);
  const matrizId = Form.useWatch('matriz', form);

  const [abaAtiva, setAbaAtiva] = useState<string>('1');

  const initBloquearBtnSalvar: boolean =
    disciplinaid == undefined ||
    !disciplinaid ||
    !areaConhecimentoId ||
    areaConhecimentoId == undefined ||
    !matrizId ||
    matrizId == undefined;

  const initBloquearBtnSalvarRascunho: boolean =
    disciplinaid == undefined ||
    !disciplinaid ||
    !areaConhecimentoId ||
    areaConhecimentoId == undefined ||
    !initBloquearBtnSalvar;

  const [bloquearBtnSalvar, setBloquearBtnSalvar] = useState<boolean>(initBloquearBtnSalvar);
  const [bloquearBtnSalvarRascunho, setBloquearBtnSalvarRascunho] = useState<boolean>(
    initBloquearBtnSalvarRascunho,
  );

  useEffect(() => {
    setBloquearBtnSalvar(initBloquearBtnSalvar);
    setBloquearBtnSalvarRascunho(initBloquearBtnSalvarRascunho);
  }, [initBloquearBtnSalvar, initBloquearBtnSalvarRascunho]);

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
      codigo: 0,
      areaConhecimento: null,
      disciplina: null,
      matriz: null,
      listaAreaConhecimentos: item.listaAreaConhecimentos,
      listaDisciplinas: item.listaDisciplinas,
      listaMatriz: item.listaMatriz,
    };
    dispatch(setItem(itemAtual));
    form.resetFields();
    setCarregando(false);
  };

  const itemSalvar: ItemDto = {
    id: item.id,
    codigoItem: item.codigo,
    areaConhecimentoId: areaConhecimentoId,
    disciplinaId: disciplinaid,
    matrizId: matrizId,
  };

  const salvarItem = useCallback(async () => {
    setCarregando(true);
    console.log(itemSalvar);
    if (item.id) {
      mensagem('info', 'Atenção', `Item já cadastrado, id:${item.id}`);
    } else {
      if (!bloquearBtnSalvar) {
        inserirItem(itemSalvar);
      } else {
        inserirRascunhoItem(itemSalvar);
      }
    }
    setCarregando(false);
  }, [item.id, itemSalvar, bloquearBtnSalvar, mensagem]);

  const inserirItem = useCallback(
    (item: ItemDto) => {
      configuracaoItemService
        .salvarItem(item)
        .then((resp) => {
          console.log('sucesso', resp.data);
          obterDadosItem(resp.data);
          mensagem('success', 'Sucesso', 'Item cadastrado com suesso');
        })
        .catch((err) => {
          console.log('Erro', err.message);
          mensagem('error', 'Erro', 'ocorreu um erro ao cadastrar o item');
        });
    },
    [mensagem],
  );

  const inserirRascunhoItem = useCallback(
    (item: ItemDto) => {
      configuracaoItemService
        .salvarRascunhoItem(item)
        .then((resp) => {
          console.log('sucesso', resp.data);
          obterDadosItem(resp.data);
          mensagem('success', 'Sucesso', 'Rascunho de item cadastrado com suesso');
        })
        .catch((err) => {
          console.log('Erro', err.message);
          mensagem('error', 'Erro', 'ocorreu um erro ao cadastrar o rascunho');
        });
    },
    [mensagem],
  );

  const obterDadosItem = useCallback(
    (id: number) => {
      setCarregando(true);
      configuracaoItemService
        .obterItem(id)
        .then((resp) => {
          const itemAtual: ItemProps = {
            id: id,
            codigo: resp?.data?.codigoItem,
            areaConhecimento: item.areaConhecimento,
            disciplina: item.disciplina,
            matriz: item.matriz,
            listaAreaConhecimentos: item.listaAreaConhecimentos,
            listaDisciplinas: item.listaDisciplinas,
            listaMatriz: item.listaMatriz,
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

  useEffect(() => {
    form.resetFields();
  }, [form, objAreaConhecimento]);

  const tabs: Array<Tab> = [
    { key: '1', label: 'Configuração' },
    { key: '2', label: 'Componentes do item' },
    { key: '3', label: 'Elaboração do item' },
  ];

  const onChange = (key: string) => {
    setAbaAtiva(key);
  };

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

        <Tabs type='card' onChange={onChange} items={tabs} />

        <Form
          form={form}
          layout='vertical'
          initialValues={{
            AreaConhecimento: objAreaConhecimento,
          }}
          autoComplete='off'
        >
          <div id='tab-1' className={abaAtiva === '1' ? 'abaAtiva' : 'abaInativa'}>
            <Row gutter={2}>
              <Col span={8}>
                <Form.Item label='Código'>
                  <Input
                    disabled={true}
                    placeholder='Código Item'
                    value={item.codigo > 0 ? item.codigo : ''}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={8}>
                <AreaConhecimento
                  form={form}
                  options={objAreaConhecimento}
                  setArea={setArea}
                ></AreaConhecimento>
              </Col>
              <Col span={8}>
                <Disciplina
                  form={form}
                  options={objDisciplina}
                  setDisciplinas={setDisciplinas}
                ></Disciplina>
              </Col>
              <Col span={8}>
                <Matriz form={form} options={objMatriz} setMatrizes={setMatriz}></Matriz>
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

          <div id='tab-2' className={abaAtiva === '2' ? 'abaAtiva' : 'abaInativa'}>
            <h1>Componentes do item</h1>
          </div>

          <div id='tab-3' className={abaAtiva === '3' ? 'abaAtiva' : 'abaInativa'}>
            <h1>Elaboração do item</h1>
          </div>
        </Form>
      </Spin>
    </>
  );
};

export default ItemCadastro;
