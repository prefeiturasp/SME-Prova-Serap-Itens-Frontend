import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Input, Layout, Space, notification } from 'antd';
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

  const item = useSelector((state: AppState) => state.item);
  const matriz = useSelector((state: AppState) => state.matriz);
  const disciplina = useSelector((state: AppState) => state.disciplina);

  const [idItem, setIdItem] = useState<number>(item.id);
  const [codigoItem, setCodigoItem] = useState<string>(item.codigo);
  const [objAreaConhecimento, setArea] = useState<DefaultOptionType[]>(item.listaAreaConhecimentos);
  const [objDisciplina, setDisciplinas] = useState<DefaultOptionType[]>(item.listaDisciplinas);
  const [objMatriz, setMatriz] = useState<DefaultOptionType[]>(item.listaMatriz);
  const [modelomatriz, setModeloMatriz] = useState<string>(matriz.modelo);
  const [nivelEnsino, setNivelEnsino] = useState<string>(disciplina.nivelEnsino);

  const [form] = Form.useForm();

  const disciplinaid = Form.useWatch('disciplinas', form);
  const areaConhecimentoId = Form.useWatch('AreaConhecimento', form);
  const matrizId = Form.useWatch('matriz', form);

  const [abaAtiva, setAbaAtiva] = useState('1');

  type tipoMsg = 'success' | 'info' | 'warning' | 'error';
  const [api, contextHolder] = notification.useNotification();
  const mensagem = useCallback(
    async (tipo: tipoMsg, titulo: string, msg: string) => {
      api[tipo]({ message: titulo, description: msg });
    },
    [api],
  );

  const salvarItem = useCallback(async () => {
    const itemSalvar: ItemDto = {
      id: 0,
      codigoItem: 0,
      areaConhecimentoId: areaConhecimentoId,
      disciplinaId: disciplinaid,
      matrizId: matrizId,
    };
    console.log(itemSalvar);

    await configuracaoItemService
      .salvarItem(itemSalvar)
      .then((resp) => {
        console.log('sucesso', resp.data);
        mensagem('success', 'Sucesso', 'Item cadastrado com suesso');
        setIdItem(resp.data);
      })
      .catch((err) => {
        console.log('Erro', err.message);
        mensagem('error', 'Erro', 'ocorreu um erro ao cadastrar o item');
      });
  }, [disciplinaid, areaConhecimentoId, matrizId, mensagem]);

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
      {contextHolder}
      <Title>
        <Row gutter={2}>
          <Col span={12}>
            <h1>Cadastrar novo item</h1>
          </Col>
          <Col span={12}>
            <Space wrap className='botoesCadastro'>
              <Button>Voltar</Button>
              <Button type='primary'>Salvar rascunho</Button>
              <Button type='primary' onClick={salvarItem}>
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
                <Input disabled={true} placeholder='Código Item' value={codigoItem} />
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
    </>
  );
};

export default ItemCadastro;
