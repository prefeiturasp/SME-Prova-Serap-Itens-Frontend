
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Input, Layout } from 'antd';
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
  background: ${Colors.CinzaFundo};
`;



//<Matriz></Matriz>
const ItemCadastro: React.FC = () => {
  const item = useSelector((state: AppState) => state.item);
  const matriz = useSelector((state: AppState) => state.matriz);
  const disciplina = useSelector((state: AppState) => state.disciplina);
  const [form] = Form.useForm();

  const [objAreaConhecimento, setArea] = useState<DefaultOptionType[]>(item.listaAreaConhecimentos);
  const [objDisciplina, setDisciplinas] = useState<DefaultOptionType[]>(item.listaDisciplinas);
  const [objMatriz, setMatriz] = useState<DefaultOptionType[]>(item.listaMatriz);
  const [modelomatriz, setModeloMatriz] = useState<string>(matriz.modelo);
  const [nivelEnsino, setNivelEnsino] = useState<string>(disciplina.nivelEnsino);

console.log("ValoresFormulario",  Form)
	const salvarItem = () => {
		// form.validateFields()
		// 	.then((values) => {
		// 		// Submit values
		// 		// submitValues(values);
		// 	})
			//.catch((errorInfo) => {});
      const disciplinaid = Form.useWatch('disciplinas', form);
      const areaConhecimentoId = Form.useWatch('area', form);
      const matrizId = Form.useWatch('matriz', form);
  

	};

  
  //console.log(objDisciplina);
  useEffect(() => {
    form.resetFields();
  }, [form, objAreaConhecimento]);

  return (<>
    <Header></Header>
    <Titulo>
      Cadastro de Itens
    </Titulo>
    <Title></Title>
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        AreaConhecimento: objAreaConhecimento,
      }}
      autoComplete='off'
    >

      <Row gutter={2}>
        <Col span={8}></Col>
        Cadastrar Item
        <Form.Item >
          <Button type="primary" onSubmit={salvarItem}   >Salvar </Button>
        </Form.Item>
      </Row>
      <Row gutter={2}>
        <Col span={8}>
          <Form.Item label="Código">
            <Input disabled={true} placeholder="Código Item" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col span={8}>
          <AreaConhecimento form={form} options={objAreaConhecimento} setArea={setArea}></AreaConhecimento>
        </Col>
        <Col span={8}>
          <Disciplina form={form} options={objDisciplina} setDisciplinas={setDisciplinas}></Disciplina>
        </Col>
        <Col span={8}>
          <Matriz form={form} options={objMatriz} setMatrizes={setMatriz}></Matriz>
        </Col>
      </Row>
      <Row gutter={10}>
        <ModeloMatriz setModeloMatriz={setModeloMatriz} modelo={modelomatriz} form={form}></ModeloMatriz>
        <Col span={8}>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col>
          <NivelEnsino setNivelEnsino={setNivelEnsino} nivelEnsino={nivelEnsino} form={form}></NivelEnsino>
        </Col>
      </Row>
    </Form>
  </>)
};

export default ItemCadastro;