import { Button, Col, Form, FormProps, notification, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from "@ant-design/icons";
import './cadastrarItemNovo.css';
import IdentificacaoComponent from '~/components/cadastro-item-novo/cards/identificacaoComponent/identificacaoComponent';
import CompetenciaHabilidade from '~/components/cadastro-item-novo/cards/competenciaHabilidadeComponent/competenciaHabilidadeComponent';
import CaracteristicasItemComponent from '~/components/cadastro-item-novo/cards/caracteristicasItemComponet/caracteristicasItemComponent';
import ClassificacaoTemaComponent from '~/components/cadastro-item-novo/cards/classificacaoTemaComponent/classificacaoTemaComponent';
import InformacoesEstatisticasComponent from '~/components/cadastro-item-novo/cards/informacoesEstatisticasComponent/informacoesEstatisticasComponent';
import { validarCampoArrayStringForm, validarCampoForm } from '~/utils/funcoes';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { cloneDeep } from 'lodash';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';
import { DadosIniciais } from '~/domain/enums/campos-cadastro-item';

import { ComponentesItemProps, ConfiguracaoItemProps, ElaboracaoItemProps, ItemProps } from '~/redux/modules/cadastro-item/item/reducers';
import { ItemDto } from '~/domain/dto/item-dto';
import { setComponentesItem, setConfiguracaoItem, setElaboracaoItem, setItem } from '~/redux/modules/cadastro-item/item/actions';
import configuracaoItemService from '~/services/configuracaoItem-service';


const CadastrarItemNovo: React.FC<FormProps> = () => {
    const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";

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
            dto.arquivoVideoId = values?.video?.[0]?.idFile;
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
            {/* <Spin size='small'
            // spinning={carregando}
            > */}
            {/* {contextHolder} */}

            <Form
                className='form'
                form={form}
                layout='vertical'
                autoComplete='off'
                // initialValues={initialValuesForm}
                style={{
                    margin: 0,
                }}
            >
                {/* <Affix offsetTop={0.1} style={{ marginBottom: 30 }}> */}
                <div className='cadastrarItemHeader'>
                    <Row className="cadastrarItemHeader-corpo">
                        <Col xs={12} md={6}>
                            <Link to={linkRetorno} className="cadastrarItemHeader-retornar">
                                <ArrowLeftOutlined className="cadastrarItemHeader-icone-retornar" />
                                <span className="cadastrarItemHeader-texto-retornar">Retornar à tela inicial</span>
                            </Link>
                        </Col>
                        <Col xs={12} md={12} className='cadastrarItemHeader-titulo'>
                            Cadastrar novo item
                        </Col>
                        <Col xs={0} md={6} />
                    </Row>
                    <div className='cadastrarItemHeader-rota'>
                        <div className='cadastrarItemHeader-rota-texto'>
                            Home / Itens/ Cadastrar novo item
                        </div>
                        <div className='cadastrarItemHeader-rota-titulo'>
                            Cadastrar novo item
                        </div>
                    </div>
                    <div className='cadastrarItemHeader-Breadcrumb-corpo'>
                        <div className='cadastrarItemHeader-Breadcrumb-item01'>
                            <div className='cadastrarItemHeader-Breadcrumb-item01-index'>
                                1
                            </div>
                            <div className='cadastrarItemHeader-Breadcrumb-item01-texto'>
                                Configuração
                            </div>
                        </div>
                        <p className='cadastrarItemHeader-Breadcrumb-separator'>{'>'}</p>
                        <div className='cadastrarItemHeader-Breadcrumb-item02'>
                            <div className='cadastrarItemHeader-Breadcrumb-item02-index'>
                                2
                            </div>
                            <div className='cadastrarItemHeader-Breadcrumb-item02-texto'>
                                Elaboração do item
                            </div>
                        </div>
                    </div>
                </div>

                {/* </Affix> */}
                {/* <TabForm form={form} /> */}
                <div className='cadastrarItem-corpo'>
                    <div className='cadastrarItem-titulo-corpo'>
                        <div className='cadastrarItem-titulo'>
                            Configure o novo item
                        </div>
                        <div className='cadastrarItem-subtitulo'>
                            Preencha as informações abaixo para criar e cadastrar um novo item. Esses dados garantem que ele esteja alinhado à matriz de avaliação e possa ser aplicado corretamente.
                        </div>
                    </div>

                    <IdentificacaoComponent form={form} />
                    <CompetenciaHabilidade form={form} />
                    <CaracteristicasItemComponent form={form} />
                    <ClassificacaoTemaComponent form={form} />
                    <InformacoesEstatisticasComponent form={form} />
                    <div className='cadastrarItem-botoes'>
                        <div className='cadastrarItem-btn'>
                            <Button className='btnVoltar' onClick={voltar}>Voltar</Button>
                        </div>
                        <div className='cadastrarItem-btn'>
                            <Button
                                type='primary'
                                onClick={() => salvarItem(true)}
                                disabled={bloquearBtnSalvarRascunho}
                                className='btnRascunho'
                            >
                                Salvar rascunho
                            </Button>
                        </div>
                        <div className='cadastrarItem-btn'>
                            <Button className='btnAvancar' onClick={voltar}>Avançar</Button>
                        </div>
                    </div>
                </div>
                <div className='cadastrarItem-footer'>
                    <div className='cadastrarItem-footer-conteudo'>
                        <div className='footer-item1'>
                            SERAp - Versão: 1.30.9.2
                        </div>
                        <div className='footer-item2'>
                            Todos os direitos reservados
                        </div>
                    </div>
                </div>
            </Form>
            {/* </Spin> */}
        </>
    );
}

export default CadastrarItemNovo;

