import { Button, Col, Form, Row } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { setFiltroAtual } from '~/redux/modules/filtro-principal/actions';

import { FiltroPrincipalProps } from '~/redux/modules/filtro-principal/reducers';
import { setAbrirFiltroPrincipal } from '~/redux/modules/geral/actions';
import AnosEscolares from './anos-escolares';
import AnosLetivos from './anos-letivos';
import Dres from './dres';
import Modalidade from './modalidade';
import Provas from './provas';
import SituacoesProvas from './situacoes-provas';
import { LabelPopover } from './styles';
import Turmas from './turmas';
import Ues from './ues';

const CamposFiltroPrincipal: React.FC = () => {
  const dispatch = useDispatch();

  const abrirFiltroPrincipal = useSelector((state: AppState) => state.geral.abrirFiltroPrincipal);

  const filtroPrincipal = useSelector((state: AppState) => state.filtroPrincipal);

  const [form] = Form.useForm();

  const [anosLetivos, setAnosLetivos] = useState<DefaultOptionType[]>(filtroPrincipal.anosLetivos);
  const [situacoesProvas, setSituacoesProvas] = useState<DefaultOptionType[]>(
    filtroPrincipal.situacoesProvas,
  );
  const [provas, setProvas] = useState<DefaultOptionType[]>(filtroPrincipal.provas);
  const [modalidades, setModalidades] = useState<DefaultOptionType[]>(filtroPrincipal.modalidades);
  const [dres, setDres] = useState<DefaultOptionType[]>(filtroPrincipal.dres);
  const [ues, setUes] = useState<DefaultOptionType[]>(filtroPrincipal.ues);
  const [anosEscolares, setAnosEscolares] = useState<DefaultOptionType[]>(
    filtroPrincipal.anosEscolares,
  );
  const [turmas, setTurmas] = useState<DefaultOptionType[]>(filtroPrincipal.turmas);

  useEffect(() => {
    form.resetFields();
  }, [form, abrirFiltroPrincipal]);

  const onClickAplicarFiltro = (valores: FiltroPrincipalProps) => {
    dispatch(
      setFiltroAtual({
        anoLetivo: valores.anoLetivo,
        situacaoProva: valores.situacaoProva,
        prova: valores.prova,
        modalidade: valores.modalidade,
        dre: valores.dre,
        ue: valores.ue,
        anoEscolar: valores.anoEscolar,
        turma: valores.turma,
        anosLetivos,
        situacoesProvas,
        provas,
        modalidades,
        dres,
        ues,
        anosEscolares,
        turmas,
      }),
    );
    dispatch(setAbrirFiltroPrincipal(false));
  };

  return (
    <>
      <Row>
        <LabelPopover>Selecione itens abaixo para filtrar as informações</LabelPopover>
      </Row>
      <Form
        form={form}
        initialValues={{
          anoLetivo: filtroPrincipal.anoLetivo,
          situacaoProva: filtroPrincipal.situacaoProva,
          prova: filtroPrincipal.prova,
          modalidade: filtroPrincipal.modalidade,
          dre: filtroPrincipal.dre,
          ue: filtroPrincipal.ue,
          anoEscolar: filtroPrincipal.anoEscolar,
          turma: filtroPrincipal.turma,
        }}
        onFinish={onClickAplicarFiltro}
        autoComplete='off'
      >
        <Row gutter={11}>
          <Col span={4}>
            <AnosLetivos form={form} setAnosLetivos={setAnosLetivos} options={anosLetivos} />
          </Col>
          <Col span={8}>
            <SituacoesProvas
              form={form}
              setSituacoesProvas={setSituacoesProvas}
              options={situacoesProvas}
            />
          </Col>
          <Col span={12}>
            <Provas form={form} setProvas={setProvas} options={provas} />
          </Col>
          <Col span={8}>
            <Modalidade form={form} setModalidades={setModalidades} options={modalidades} />
          </Col>
          <Col span={16}>
            <Dres form={form} setDres={setDres} options={dres} />
          </Col>
          <Col span={24}>
            <Ues form={form} setUes={setUes} options={ues} />
          </Col>
          <Col span={7}>
            <AnosEscolares
              form={form}
              setAnosEscolares={setAnosEscolares}
              options={anosEscolares}
            />
          </Col>
          <Col span={12}>
            <Turmas form={form} setTurmas={setTurmas} options={turmas} />
          </Col>
          <Col span={5}>
            <Form.Item>
              <Button htmlType='submit' style={{ width: '100%' }} type='primary'>
                Aplicar filtro
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default React.memo(CamposFiltroPrincipal);
