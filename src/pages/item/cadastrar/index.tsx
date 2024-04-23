import { Affix, Button, Col, Form, Row, Spin, notification } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Title } from '~/components/cadastro-item/elementos';
import TabForm from '~/components/cadastro-item/tab-form';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';
import { ItemDto } from '~/domain/dto/item-dto';
import { DadosIniciais } from '~/domain/enums/campos-cadastro-item';
import { AppState } from '~/redux';
import {
  setComponentesItem,
  setConfiguracaoItem,
  setElaboracaoItem,
  setItem,
} from '~/redux/modules/cadastro-item/item/actions';
import {
  ComponentesItemProps,
  ConfiguracaoItemProps,
  ElaboracaoItemProps,
  ItemProps,
} from '~/redux/modules/cadastro-item/item/reducers';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { validarCampoArrayStringForm, validarCampoForm } from '~/utils/funcoes';
import './cadastroItemStyles.css';

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
    form.resetFields();
    setCarregando(false);
  };

  const gerarItemSalvar = useCallback(() => {
    const values = cloneDeep(form.getFieldsValue(true));

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
      parametroBTransformado: componentesItem?.parametroBTransformado || null,
      mediaEhDesvio: componentesItem.mediaDesvioPadrao,
      observacao: componentesItem.observacao,
      textoBase: values?.textoBase || '',
      fonte: values?.fonte || '',
      enunciado: values?.enunciado || '',
      alternativasDto: values?.alternativasDto?.length ? values?.alternativasDto : [],
    };

    if (values?.alternativasDto?.length) {
      dto.alternativasDto = values?.alternativasDto.map((item: AltenativaDto) => {
        const ehAlternativaCorreta = item.numeracao === values.alternativaCorreta;
        item.correta = ehAlternativaCorreta;
        return item;
      });
    }

    if (values?.video?.length) {
      dto.arquivoItemId = values?.video?.[0]?.idFile;
    }
    if (values?.audio?.length) {
      dto.arquivoAudioId = values?.audio?.[0]?.idFile;
    }

    return dto;
  }, [item, configuracaoItem, componentesItem, elaboracaoItem, form]);

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
          const itemAtual: ItemProps = { ...item, id: id, configuracao: configuracaoItemRetorno };
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

  const salvarItem = useCallback(
    async (rascunho = false) => {
      setCarregando(true);
      const itemSalvar = gerarItemSalvar();

      if (item?.id > 0) {
        mensagem('info', 'Atenção', `Item já cadastrado, id:${item.id}`);
      } else {
        if (rascunho) {
          await inserirRascunhoItem(itemSalvar);
        } else {
          await inserirItem(itemSalvar);
        }
      }
      setCarregando(false);
    },
    [item.id, mensagem, inserirItem, inserirRascunhoItem, gerarItemSalvar],
  );

  const bloquearBtnSalvarRascunhoDadosTabElaboracaoItem = (): boolean => {
    const values = cloneDeep(form.getFieldsValue(true));

    let algumaDescricaoSemValor = false;

    if (values?.alternativasDto?.length) {
      algumaDescricaoSemValor = values.alternativasDto.find(
        (item: AltenativaDto) => !item?.descricao,
      );
    }

    if (!values?.enunciado || !values?.alternativaCorreta || algumaDescricaoSemValor) return true;

    return false;
  };

  return (
    <>
      <Spin size='small' spinning={carregando}>
        {contextHolder}

        <Form
          className='form'
          form={form}
          layout='vertical'
          autoComplete='off'
          initialValues={initialValuesForm}
          style={{
            margin: 0,
          }}
        >
          <Affix offsetTop={0.1} style={{ marginBottom: 30 }}>
            <Title>
              <Row gutter={2}>
                <Col span={12}>
                  <h1>Cadastrar novo item</h1>
                </Col>
                <Col span={12} style={{ marginTop: 24 }}>
                  <Row gutter={[8, 8]} justify='end'>
                    <Col>
                      <Button onClick={voltar}>Voltar</Button>
                    </Col>
                    <Col>
                      <Button
                        type='primary'
                        onClick={() => salvarItem(true)}
                        disabled={bloquearBtnSalvarRascunho}
                      >
                        Salvar rascunho
                      </Button>
                    </Col>
                    <Col>
                      <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                        {() => {
                          const desabilitar =
                            bloquearBtnSalvar || bloquearBtnSalvarRascunhoDadosTabElaboracaoItem();

                          return (
                            <Button
                              type='primary'
                              onClick={() => salvarItem()}
                              disabled={desabilitar}
                            >
                              Salvar
                            </Button>
                          );
                        }}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Title>
          </Affix>
          <TabForm form={form} />
        </Form>
      </Spin>
    </>
  );
};

export default ItemCadastro;
