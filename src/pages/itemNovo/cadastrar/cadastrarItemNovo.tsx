import { Button, Col, Form, FormProps, notification, Row, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons";
import './cadastrarItemNovo.css';
import IdentificacaoComponent from '~/components/cadastro-item-novo/cards/identificacaoComponent/identificacaoComponent';
import CompetenciaHabilidade from '~/components/cadastro-item-novo/cards/competenciaHabilidadeComponent/competenciaHabilidadeComponent';
import CaracteristicasItemComponent from '~/components/cadastro-item-novo/cards/caracteristicasItemComponet/caracteristicasItemComponent';
import ClassificacaoTemaComponent from '~/components/cadastro-item-novo/cards/classificacaoTemaComponent/classificacaoTemaComponent';
import InformacoesEstatisticasComponent from '~/components/cadastro-item-novo/cards/informacoesEstatisticasComponent/informacoesEstatisticasComponent';
import { validarCampoForm } from '~/utils/funcoes'; //validarCampoArrayStringForm
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { cloneDeep } from 'lodash';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';
import { DadosIniciais } from '~/domain/enums/campos-cadastro-item';

// import { Campos } from '~/domain/enums/campos-cadastro-item';

import configuracaoItemService from '~/services/configuracaoItem-service';

import {
    setConfiguracaoItemNovo,
    setElaboracaoItemNovo,
    setItemNovo,
} from '~/redux/modules/cadastroItem-novo/itemNovo/actions';
import {
    ConfiguracaoItemNovoProps,
    ElaboracaoItemNovoProps,
    ItemNovoProps,
} from '~/redux/modules/cadastroItem-novo/itemNovo/reducers';
import { ItemNovoDto } from '~/domain/dto/itemNovo-dto';


const CadastrarItemNovo: React.FC<FormProps> = () => {
    const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";

    const dispatch = useDispatch();
    const [carregando, setCarregando] = useState<boolean>(false);
    const item = useSelector((state: AppState) => state.item);
    const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);
    
    const elaboracaoItemNovo = useSelector((state: AppState) => state.elaboracaoItemNovo);

    const [objTabConfiguracaoItem, setObjTabConfiguracaoItem] =
        useState<ConfiguracaoItemNovoProps>(configuracaoItemNovo);

    const [form] = Form.useForm();
    const initialValuesForm = {
        infoEstatisticasDiscriminacao: '',
        infoEstatisticasDificuldade: '',
        infoEstatisticasAcertoCasual: '',
        parametroBTransformado: '',
        tipoItem: DadosIniciais.tipoItemIdPadrao,
    };

    // const areaConhecimentoIdForm = Form.useWatch(Campos.areaConhecimento, form);
    // const disciplinaIdForm = Form.useWatch(Campos.disciplinas, form);

    // const bloquearSalvar =
    //     validarCampoForm(configuracaoItemNovo.disciplina) ||
    //     validarCampoForm(configuracaoItemNovo.areaConhecimento) ||
    //     validarCampoForm(configuracaoItemNovo.matriz) ||
    //     validarCampoForm(configuracaoItemNovo.competencia) ||
    //     validarCampoForm(configuracaoItemNovo.habilidade) ||
    //     validarCampoForm(configuracaoItemNovo.anoMatriz) ||
    //     validarCampoForm(configuracaoItemNovo.dificuldadeSugerida) ||
    //     validarCampoForm(configuracaoItemNovo.situacaoItem) ||
    //     validarCampoForm(configuracaoItemNovo.quantidadeAlternativas) ||
    //     validarCampoArrayStringForm(configuracaoItemNovo.palavrasChave ?? []);

    // const [bloquearBtnSalvar, setBloquearBtnSalvar] = useState<boolean>(bloquearSalvar);
    const [bloquearBtnSalvarRascunho, setBloquearBtnSalvarRascunho] =
        useState<boolean>(true);


    useEffect(() => {
        const bloquear =
            validarCampoForm(configuracaoItemNovo.disciplina) ||
            validarCampoForm(configuracaoItemNovo.areaConhecimento);

        setBloquearBtnSalvarRascunho(bloquear);
    }, [configuracaoItemNovo.areaConhecimento, configuracaoItemNovo.disciplina]);


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
        const itemAtual: ItemNovoProps = {
            id: 0,
            configuracao: {} as ConfiguracaoItemNovoProps,
            elaboracao: {} as ElaboracaoItemNovoProps,
        };
        dispatch(setItemNovo(itemAtual));
        dispatch(setConfiguracaoItemNovo({} as ConfiguracaoItemNovoProps));
        dispatch(setElaboracaoItemNovo({} as ElaboracaoItemNovoProps));
        form.resetFields();
        setCarregando(false);
    };

    const gerarItemSalvar = useCallback(() => {
        const values = cloneDeep(form.getFieldsValue(true));

        const dto: ItemNovoDto = {
            id: item.id,
            codigoItem: configuracaoItemNovo.codigo,
            areaConhecimentoId: configuracaoItemNovo.areaConhecimento,
            disciplinaId: configuracaoItemNovo.disciplina,
            matrizId: configuracaoItemNovo.matriz,
            competenciaId: configuracaoItemNovo.competencia,
            habilidadeId: configuracaoItemNovo.habilidade,
            anoMatrizId: configuracaoItemNovo.anoMatriz,
            assuntoId: configuracaoItemNovo.assunto,
            subAssuntoId: configuracaoItemNovo.subAssunto,
            situacao: configuracaoItemNovo.situacaoItem,
            tipoItem: configuracaoItemNovo.tipoItem,
            quantidadeAlternativasId: configuracaoItemNovo.quantidadeAlternativas,
            dificuldadeSugeridaId: configuracaoItemNovo.dificuldadeSugerida,
            discriminacao: configuracaoItemNovo.discriminacao !== '' ? configuracaoItemNovo.discriminacao : null,
            dificuldade: configuracaoItemNovo.dificuldade !== '' ? configuracaoItemNovo.dificuldade : null,
            nivelItem: configuracaoItemNovo.nivelItem,
            acertoCasual: configuracaoItemNovo.acertoCasual !== '' ? configuracaoItemNovo.acertoCasual : null,
            palavrasChave: configuracaoItemNovo.palavrasChave,
            parametroBTransformado: configuracaoItemNovo?.parametroBTransformado || null,
            mediaEhDesvio: configuracaoItemNovo.mediaDesvioPadrao,
            sentencaDescritora: configuracaoItemNovo.sentencaDescritora,
            observacao: configuracaoItemNovo.observacao,
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
    }, [item, configuracaoItemNovo, elaboracaoItemNovo, form]);

    const obterDadosItem = useCallback(
        async (id: number) => {
            setCarregando(true);
            await configuracaoItemService
                .obterItem(id)
                .then((resp) => {
                    const configuracaoItemRetorno: ConfiguracaoItemNovoProps = {
                        ...objTabConfiguracaoItem,
                        codigo: resp?.data?.codigoItem,
                    };
                    const itemAtual: ItemNovoProps = { ...item, id: id, configuracao: configuracaoItemRetorno };
                    setObjTabConfiguracaoItem(configuracaoItemRetorno);
                    dispatch(setConfiguracaoItemNovo(configuracaoItemRetorno));
                    dispatch(setItemNovo(itemAtual));
                })
                .catch((err) => {
                    console.log('Erro', err.message);
                });
            setCarregando(false);
        },
        [dispatch, item, objTabConfiguracaoItem],
    );

    const inserirItem = useCallback(
        async (item: ItemNovoDto) => {
            await configuracaoItemService
                .salvarItemNovo(item)
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
        async (item: ItemNovoDto) => {
            await configuracaoItemService
                .salvarRascunhoItemNovo(item)
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
            console.log('itemSalvar', itemSalvar);
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

    // const bloquearBtnSalvarRascunhoDadosTabElaboracaoItem = (): boolean => {
    //     const values = cloneDeep(form.getFieldsValue(true));

    //     let algumaDescricaoSemValor = false;

    //     if (values?.alternativasDto?.length) {
    //         algumaDescricaoSemValor = values.alternativasDto.find(
    //             (item: AltenativaDto) => !item?.descricao,
    //         );
    //     }

    //     if (!values?.enunciado || !values?.alternativaCorreta || algumaDescricaoSemValor) return true;

    //     return false;
    // };



    return (
        <>
            <Spin size='small'
                spinning={carregando}
            >
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
                            <RightOutlined className='cadastrarItemHeader-Breadcrumb-separator' />
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
            </Spin>
        </>
    );
}

export default CadastrarItemNovo;

