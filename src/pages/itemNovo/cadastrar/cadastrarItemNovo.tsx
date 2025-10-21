import { Button, Col, Form, FormProps, notification, Row, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons";
import './cadastrarItemNovo.css';

// import IdentificacaoComponent from '~/components/cadastro-item-novo/cards/identificacaoComponent/identificacaoComponent';
// import CompetenciaHabilidade from '~/components/cadastro-item-novo/cards/competenciaHabilidadeComponent/competenciaHabilidadeComponent';
// import CaracteristicasItemComponent from '~/components/cadastro-item-novo/cards/caracteristicasItemComponet/caracteristicasItemComponent';
// import ClassificacaoTemaComponent from '~/components/cadastro-item-novo/cards/classificacaoTemaComponent/classificacaoTemaComponent';
// import InformacoesEstatisticasComponent from '~/components/cadastro-item-novo/cards/informacoesEstatisticasComponent/informacoesEstatisticasComponent';


import FormularioUnico from '~/components/cadastro-item-novo/formularioUnicoComponent/formularioUnicoComponent';

import { validarCampoForm } from '~/utils/funcoes'; //validarCampoArrayStringForm

import { Campos } from '~/domain/enums/campos-cadastro-item';
import configuracaoItemService from '~/services/configuracaoItem-service';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { cloneDeep } from 'lodash';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';
import { DadosIniciais } from '~/domain/enums/campos-cadastro-item';

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
    //const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);
    //const elaboracaoItemNovo = useSelector((state: AppState) => state.elaboracaoItemNovo);

    // ❌ Removido: objTabConfiguracaoItem - não mais necessário

    const [form] = Form.useForm();
    const initialValuesForm = {
        infoEstatisticasDiscriminacao: '',
        infoEstatisticasDificuldade: '',
        infoEstatisticasAcertoCasual: '',
        parametroBTransformado: '',
        tipoItem: DadosIniciais.tipoItemIdPadrao,
        dificuldadeSugerida: 5,
        quantidadeAlternativas: 23,
        // dificuldadeSugerida: { value: 5, label: '1 - Muito Fácil', descricao: '1 - Muito Fácil', valor: 5 },
    };

    // ✅ Watchers do formulário para validação
    const areaConhecimentoIdForm = Form.useWatch(Campos.areaConhecimento, form);
    const disciplinaIdForm = Form.useWatch(Campos.disciplinas, form);

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

    // ✅ useEffect refatorado para usar valores do formulário ao invés do Redux
    useEffect(() => {
        const bloquear =
            validarCampoForm(disciplinaIdForm) ||
            validarCampoForm(areaConhecimentoIdForm);

        setBloquearBtnSalvarRascunho(bloquear);
    }, [areaConhecimentoIdForm, disciplinaIdForm]);


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

        console.log('📋 Valores do formulário para DTO:', values);

        const dto: ItemNovoDto = {
            id: item.id,
            codigoItem: values?.codigo ? +values?.codigo : 0,
            areaConhecimentoId: values?.AreaConhecimento || null,
            disciplinaId: values?.disciplinas || null,
            matrizId: values?.matriz || null,
            competenciaId: values?.competencia || null,
            habilidadeId: values?.habilidade || null,
            anoMatrizId: values?.anoMatriz || null,
            assuntoId: values?.assunto || null,
            subAssuntoId: values?.subAssunto || null,
            situacao: values?.situacaoItem || null,
            tipoItem: values?.tipoItem || null,
            quantidadeAlternativasId: values?.quantidadeAlternativas || null,
            dificuldadeSugeridaId: values?.dificuldadeSugerida || null,
            discriminacao: values?.infoEstatisticasDiscriminacao ? +values?.infoEstatisticasDiscriminacao : null,
            dificuldade: values?.infoEstatisticasDificuldade ? +values?.infoEstatisticasDificuldade : null,
            nivelItem: values?.nivelItem || null,
            acertoCasual: values?.infoEstatisticasAcertoCasual ? +values?.infoEstatisticasAcertoCasual : null,
            palavrasChave: values?.palavraChave || [],
            parametroBTransformado: values?.parametroBTransformado ? +values?.parametroBTransformado : null,
            mediaEhDesvio: values?.mediaDesvioPadrao || null,
            sentencaDescritora: values?.sentencaDescritora || null,
            observacao: values?.observacao || null,
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

        // 🔍 Log final do DTO antes de enviar
        console.log('🚀 DTO Final sendo enviado:', dto);

        return dto;
    }, [item.id, form]);

    const obterDadosItem = useCallback(
        async (id: number) => {
            setCarregando(true);

            try {
                const resp = await configuracaoItemService.obterItem(id);

                if (resp?.data) {
                    // ✅ 1. Mapear dados da API para o formato Redux
                    const configuracaoItemRetorno: ConfiguracaoItemNovoProps = {
                        codigo: resp.data.codigoItem,
                        areaConhecimento: resp.data.areaConhecimentoId,
                        disciplina: resp.data.disciplinaId,
                        matriz: resp.data.matrizId,
                        competencia: resp.data.competenciaId,
                        habilidade: resp.data.habilidadeId,
                        anoMatriz: resp.data.anoMatrizId,
                        assunto: resp.data.assuntoId,
                        subAssunto: resp.data.subAssuntoId,
                        situacaoItem: resp.data.situacao,
                        tipoItem: resp.data.tipoItem,
                        quantidadeAlternativas: resp.data.quantidadeAlternativasId,
                        dificuldadeSugerida: resp.data.dificuldadeSugeridaId,
                        discriminacao: resp.data.discriminacao,
                        dificuldade: resp.data.dificuldade,
                        nivelItem: resp.data.nivelItem,
                        acertoCasual: resp.data.acertoCasual,
                        palavrasChave: resp.data.palavrasChave,
                        parametroBTransformado: resp.data.parametroBTransformado,
                        mediaDesvioPadrao: resp.data.mediaEhDesvio,
                        sentencaDescritora: resp.data.sentencaDescritora,
                        observacao: resp.data.observacao,
                    };

                    // ✅ 2. Atualizar Redux (para navegação entre telas)
                    const itemAtual: ItemNovoProps = {
                        ...item,
                        id: id,
                        configuracao: configuracaoItemRetorno
                    };

                    dispatch(setConfiguracaoItemNovo(configuracaoItemRetorno));
                    dispatch(setItemNovo(itemAtual));

                    // ✅ 3. Atualizar formulário com os dados carregados
                    Object.keys(configuracaoItemRetorno).forEach(key => {
                        const value = configuracaoItemRetorno[key as keyof ConfiguracaoItemNovoProps];
                        if (value !== undefined && value !== null) {
                            form?.setFieldValue(key, value);
                        }
                    });

                    console.log('✅ Item carregado com sucesso:', {
                        id,
                        configuracao: configuracaoItemRetorno
                    });
                }
            } catch (err: any) {
                console.error('❌ Erro ao carregar item:', err.message);
                mensagem('error', 'Erro', 'Erro ao carregar dados do item');
            }

            setCarregando(false);
        },
        [dispatch, item, form, mensagem],
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

            if (rascunho) {
                await inserirRascunhoItem(itemSalvar);
            } else {
                await inserirItem(itemSalvar);
            }

            // if (item?.id > 0) {
            //     mensagem('info', 'Atenção','Desenvolver regras.' );
            //     //`Item já cadastrado, id:${item.id}`
            // } else {
            //     // if (rascunho) {
            //     //     await inserirRascunhoItem(itemSalvar);
            //     // } else {
            //     //     await inserirItem(itemSalvar);
            //     // }
            // }
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

                        {/* <IdentificacaoComponent form={form} />
                        <CompetenciaHabilidade form={form} />
                        <CaracteristicasItemComponent form={form} />
                        <ClassificacaoTemaComponent form={form} />
                        <InformacoesEstatisticasComponent form={form} /> */}

                        <FormularioUnico form={form} />

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

