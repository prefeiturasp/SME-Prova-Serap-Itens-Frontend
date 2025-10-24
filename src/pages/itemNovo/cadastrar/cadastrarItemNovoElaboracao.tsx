import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, FormProps, notification, Spin } from 'antd';
import { useNavigate } from "react-router";
import { cloneDeep } from 'lodash';

//css
import './cadastrarItemNovoElaboracao.css';
// import './cadastrarItemNovo.css';

//outros componentes
import CadastrarItemHeaderComponent from "./cadastrarItemHeaderComponent";
import CadastrarItemRodapeComponent from "./cadastrarItemRodapeComponent";
import FormularioElaboracaoComponent from "~/components/cadastro-item-novo/formularioElaboracaoComponent/formularioElaboracaoComponent";

// Types
import { ItemNovoDto } from '~/domain/dto/itemNovo-dto';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';

// Services
import configuracaoItemService from '~/services/configuracaoItem-service';

// Redux
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "~/redux";
import { setConfiguracaoItemNovo, setElaboracaoItemNovo, setItemNovo } from '~/redux/modules/cadastroItem-novo/itemNovo/actions';

// Enums
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { ElaboracaoItemNovoProps, ItemNovoProps } from "~/redux/modules/cadastroItem-novo/itemNovo/reducers";

const CadastrarItemNovoElaboracao: React.FC<FormProps> = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const initialValuesForm = {}


    const dispatch = useDispatch();
    // const [messageApi, contextHolder] = message.useMessage();
    const [carregando, setCarregando] = useState(false);

    const elaboracaoItemNovo = useSelector((state: AppState) => state.elaboracaoItemNovo);
    const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);
    const item = useSelector((state: AppState) => state.item);


    type tipoMsg = 'success' | 'info' | 'warning' | 'error';
    const [api, contextHolder] = notification.useNotification();

    const mensagem = useCallback(
        async (tipo: tipoMsg, titulo: string, msg: string) => {
            api[tipo]({ message: titulo, description: msg });
        },
        [api],
    );

    // 💾 Funções para gerenciar localStorage
    const carregarItemDoLocalStorage = useCallback((): { id: number, codigo: number, configuracao: any } | null => {
        try {
            const itemSalvo = localStorage.getItem('itemAtual');
            if (itemSalvo) {
                const item = JSON.parse(itemSalvo);
                console.log('📂 Item carregado do localStorage na elaboração:', item);
                return item;
            }
        } catch (error) {
            console.error('❌ Erro ao carregar do localStorage:', error);
        }
        return null;
    }, []);

    const limparItemDoLocalStorage = useCallback(() => {
        try {
            localStorage.removeItem('itemAtual');
            console.log('🗑️ Item removido do localStorage na elaboração');
        } catch (error) {
            console.error('❌ Erro ao limpar localStorage:', error);
        }
    }, []);

    const voltar = () => {
        navigate('/criacao');
    };

    // Validação dos parâmetros obrigatórios para acessar esta tela
    useEffect(() => {
        let parametrosObrigatorios = {
            id: item.id,
            codigoItem: configuracaoItemNovo?.codigo,
            areaConhecimentoId: configuracaoItemNovo?.areaConhecimento,
            disciplinaId: configuracaoItemNovo?.disciplina
        };

        // Se Redux estiver vazio, tenta carregar do localStorage
        if ((!parametrosObrigatorios.id || parametrosObrigatorios.id === 0) || 
            (!parametrosObrigatorios.codigoItem || parametrosObrigatorios.codigoItem === 0)) {
            
            const itemSalvo = carregarItemDoLocalStorage();
            if (itemSalvo && itemSalvo.id > 0 && itemSalvo.codigo > 0) {
                console.log('🔄 Dados do Redux vazios, restaurando do localStorage...');
                
                // Restaura no Redux
                dispatch(setConfiguracaoItemNovo(itemSalvo.configuracao));
                dispatch(setItemNovo({
                    id: itemSalvo.id,
                    configuracao: itemSalvo.configuracao,
                    elaboracao: elaboracaoItemNovo,
                }));

                // Atualiza parâmetros obrigatórios com dados do localStorage
                parametrosObrigatorios = {
                    id: itemSalvo.id,
                    codigoItem: itemSalvo.codigo,
                    areaConhecimentoId: itemSalvo.configuracao?.areaConhecimento,
                    disciplinaId: itemSalvo.configuracao?.disciplina
                };
            }
        }

        const parametrosFaltando = [];
        if (!parametrosObrigatorios.id || parametrosObrigatorios.id === 0) {
            parametrosFaltando.push('ID do item');
        }
        if (!parametrosObrigatorios.codigoItem || parametrosObrigatorios.codigoItem === 0) {
            parametrosFaltando.push('Código do item');
        }
        if (!parametrosObrigatorios.areaConhecimentoId) {
            parametrosFaltando.push('Área do conhecimento');
        }
        if (!parametrosObrigatorios.disciplinaId) {
            parametrosFaltando.push('Disciplina');
        }

        if (parametrosFaltando.length > 0) {
            mensagem('error', 'Erro',
                `Parâmetros obrigatórios faltando: ${parametrosFaltando.join(', ')}. Redirecionando para a tela anterior.`
            );

            setTimeout(() => {
                navigate('/item-novo');
            }, 3000);
            return;
        }

        console.log('✅ FormularioElaboracaoComponent carregado com sucesso!');
        console.log('📋 Dados do Redux carregados:', {
            item: parametrosObrigatorios,
            elaboracao: elaboracaoItemNovo
        });
    }, [item.id, configuracaoItemNovo, mensagem, navigate, elaboracaoItemNovo, carregarItemDoLocalStorage, dispatch]);

    // Campos do enum
    const campoTextoBase = Campos.textoBase;
    const campoFonte = Campos.fonte;
    const campoEnunciado = Campos.enunciado;
    const campoCodigoItem = Campos.codigoItem;
    const campoVideo = Campos.video;
    const campoAudio = Campos.audio;
    const campoAlternativaA = Campos.alternativaA;
    const campoJustificativaA = Campos.justificativaA;
    const campoAlternativaB = Campos.alternativaB;
    const campoJustificativaB = Campos.justificativaB;
    const campoAlternativaC = Campos.alternativaC;
    const campoJustificativaC = Campos.justificativaC;
    const campoAlternativaD = Campos.alternativaD;
    const campoJustificativaD = Campos.justificativaD;
    const campoAlternativaCorreta = Campos.alternativaCorreta;

    // Carrega dados do Redux no form quando o componente monta
    useEffect(() => {
        if (elaboracaoItemNovo && form) {
            form.setFieldsValue({
                [campoTextoBase]: elaboracaoItemNovo.textoBase,
                [campoFonte]: elaboracaoItemNovo.fonte,
                [campoEnunciado]: elaboracaoItemNovo.enunciado,
                [campoCodigoItem]: elaboracaoItemNovo.codigoItem,
                [campoVideo]: elaboracaoItemNovo.video,
                [campoAudio]: elaboracaoItemNovo.audio,
                [campoAlternativaA]: elaboracaoItemNovo.alternativaA,
                [campoJustificativaA]: elaboracaoItemNovo.justificativaA,
                [campoAlternativaB]: elaboracaoItemNovo.alternativaB,
                [campoJustificativaB]: elaboracaoItemNovo.justificativaB,
                [campoAlternativaC]: elaboracaoItemNovo.alternativaC,
                [campoJustificativaC]: elaboracaoItemNovo.justificativaC,
                [campoAlternativaD]: elaboracaoItemNovo.alternativaD,
                [campoJustificativaD]: elaboracaoItemNovo.justificativaD,
                [campoAlternativaCorreta]: elaboracaoItemNovo.alternativaCorreta || 'A', // Default para A
            });
        }
    }, [elaboracaoItemNovo, form, campoTextoBase, campoFonte, campoEnunciado, campoCodigoItem,
        campoVideo, campoAudio, campoAlternativaA, campoJustificativaA, campoAlternativaB,
        campoJustificativaB, campoAlternativaC, campoJustificativaC, campoAlternativaD,
        campoJustificativaD, campoAlternativaCorreta]);

    // Método para gerar o DTO para salvar
    const gerarItemSalvar = useCallback(() => {
        const values = cloneDeep(form.getFieldsValue(true));

        console.log('📋 Valores do formulário da elaboração:', values);

        // Monta as alternativas com base nos campos individuais
        const alternativasDto: AltenativaDto[] = [];

        if (values[campoAlternativaA]) {
            alternativasDto.push({
                numeracao: 'A',
                descricao: values[campoAlternativaA],
                justificativa: values[campoJustificativaA] || '',
                correta: values[campoAlternativaCorreta] === 'A',
                ordem: 1
            });
        }

        if (values[campoAlternativaB]) {
            alternativasDto.push({
                numeracao: 'B',
                descricao: values[campoAlternativaB],
                justificativa: values[campoJustificativaB] || '',
                correta: values[campoAlternativaCorreta] === 'B',
                ordem: 2
            });
        }

        if (values[campoAlternativaC]) {
            alternativasDto.push({
                numeracao: 'C',
                descricao: values[campoAlternativaC],
                justificativa: values[campoJustificativaC] || '',
                correta: values[campoAlternativaCorreta] === 'C',
                ordem: 3
            });
        }

        if (values[campoAlternativaD]) {
            alternativasDto.push({
                numeracao: 'D',
                descricao: values[campoAlternativaD],
                justificativa: values[campoJustificativaD] || '',
                correta: values[campoAlternativaCorreta] === 'D',
                ordem: 4
            });
        }

        const dto: ItemNovoDto = {
            id: item.id,
            codigoItem: configuracaoItemNovo?.codigo || 0,
            areaConhecimentoId: configuracaoItemNovo?.areaConhecimento || null,
            disciplinaId: configuracaoItemNovo?.disciplina || null,
            matrizId: configuracaoItemNovo?.matriz || null,
            competenciaId: configuracaoItemNovo?.competencia || null,
            habilidadeId: configuracaoItemNovo?.habilidade || null,
            anoMatrizId: configuracaoItemNovo?.anoMatriz || null,
            assuntoId: configuracaoItemNovo?.assunto || null,
            subAssuntoId: configuracaoItemNovo?.subAssunto || null,
            situacao: configuracaoItemNovo?.situacaoItem || null,
            tipo: configuracaoItemNovo?.tipoItem ? Number(configuracaoItemNovo.tipoItem) : 1,
            quantidadeAlternativasId: configuracaoItemNovo?.quantidadeAlternativas || null,
            dificuldadeSugeridaId: configuracaoItemNovo?.dificuldadeSugerida || null,
            discriminacao: configuracaoItemNovo?.discriminacao ? +configuracaoItemNovo?.discriminacao : null,
            dificuldade: configuracaoItemNovo?.dificuldade ? +configuracaoItemNovo?.dificuldade : null,
            nivelItem: configuracaoItemNovo?.nivelItem || null,
            acertoCasual: configuracaoItemNovo?.acertoCasual ? +configuracaoItemNovo?.acertoCasual : null,
            palavrasChave: configuracaoItemNovo?.palavrasChave || [],
            parametroBTransformado: configuracaoItemNovo?.parametroBTransformado ? +configuracaoItemNovo?.parametroBTransformado : null,
            mediaEhDesvio: configuracaoItemNovo?.mediaDesvioPadrao || null,
            sentencaDescritora: configuracaoItemNovo?.sentencaDescritora || null,
            observacao: configuracaoItemNovo?.observacao || null,
            textoBase: values[campoTextoBase] || '',
            fonte: values[campoFonte] || '',
            enunciado: values[campoEnunciado] || '',
            alternativasDto: alternativasDto,
        };

        if (values[campoVideo]?.length) {
            dto.arquivoVideoId = values[campoVideo]?.[0]?.idFile;
        }
        if (values[campoAudio]?.length) {
            dto.arquivoAudioId = values[campoAudio]?.[0]?.idFile;
        }

        console.log('🚀 DTO Final da elaboração sendo enviado:', dto);
        return dto;
    }, [item.id, configuracaoItemNovo, form, campoTextoBase, campoFonte, campoEnunciado,
        campoVideo, campoAudio, campoAlternativaA, campoJustificativaA, campoAlternativaB,
        campoJustificativaB, campoAlternativaC, campoJustificativaC, campoAlternativaD,
        campoJustificativaD, campoAlternativaCorreta]);

    const inserirRascunhoItem = useCallback(
        async (itemDto: ItemNovoDto) => {
            await configuracaoItemService
                .salvarRascunhoItemNovo(itemDto)
                .then((resp) => {
                    mensagem('success', 'Sucesso', 'Rascunho de item salvo com sucesso');
                    console.log('✅ Rascunho salvo com ID:', resp.data);

                    // Atualiza Redux com os dados salvos apenas após salvar
                    const values = form.getFieldsValue(true);
                    const elaboracaoAtualizada = {
                        textoBase: values[campoTextoBase],
                        fonte: values[campoFonte],
                        enunciado: values[campoEnunciado],
                        codigoItem: values[campoCodigoItem],
                        video: values[campoVideo],
                        audio: values[campoAudio],
                        alternativaA: values[campoAlternativaA],
                        justificativaA: values[campoJustificativaA],
                        alternativaB: values[campoAlternativaB],
                        justificativaB: values[campoJustificativaB],
                        alternativaC: values[campoAlternativaC],
                        justificativaC: values[campoJustificativaC],
                        alternativaD: values[campoAlternativaD],
                        justificativaD: values[campoJustificativaD],
                        alternativaCorreta: values[campoAlternativaCorreta],
                    };
                    
                    dispatch(setElaboracaoItemNovo(elaboracaoAtualizada));
                    
                    // ✅ 2.2 - Salvar dados do Redux no localStorage após salvar rascunho
                    try {
                        const itemParaLocalStorage = {
                            id: item.id,
                            codigo: configuracaoItemNovo?.codigo || 0,
                            configuracao: configuracaoItemNovo,
                            elaboracao: elaboracaoAtualizada
                        };
                        localStorage.setItem('itemAtual', JSON.stringify(itemParaLocalStorage));
                        console.log('💾 Dados salvos no localStorage após salvar rascunho:', itemParaLocalStorage);
                    } catch (error) {
                        console.error('❌ Erro ao salvar no localStorage:', error);
                    }
                })
                .catch((err) => {
                    console.log('❌ Erro ao salvar rascunho:', err.message);
                    mensagem('error', 'Erro', 'Ocorreu um erro ao salvar o rascunho');
                });
        },
        [mensagem, dispatch, form, item.id, configuracaoItemNovo, campoTextoBase, campoFonte, campoEnunciado, campoCodigoItem,
            campoVideo, campoAudio, campoAlternativaA, campoJustificativaA, campoAlternativaB,
            campoJustificativaB, campoAlternativaC, campoJustificativaC, campoAlternativaD,
            campoJustificativaD, campoAlternativaCorreta],
    );

    const salvarRascunho = useCallback(
        async () => {
            setCarregando(true);
            const itemSalvar = gerarItemSalvar();
            console.log('💾 Salvando rascunho da elaboração:', itemSalvar);

            await inserirRascunhoItem(itemSalvar);
            setCarregando(false);
        },
        [gerarItemSalvar, inserirRascunhoItem],
    );

    const cancelar = () => {
        setCarregando(true);        
        limparItemDoLocalStorage();
        const itemAtual: ItemNovoProps = {
            id: 0,
            configuracao: {},
            elaboracao: {} as ElaboracaoItemNovoProps,
        };
        dispatch(setItemNovo(itemAtual));
        dispatch(setConfiguracaoItemNovo({}));
        dispatch(setElaboracaoItemNovo({} as ElaboracaoItemNovoProps));
        form.resetFields();
        setCarregando(false);

        // Navega para a tela de listagem de itens
        navigate('/listagem');
    };



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
                    <CadastrarItemHeaderComponent pagina={2} />
                    {/* </Affix> */}

                    <div className='cadastrarItem-corpo'>
                        <div className='cadastrarItem-titulo-corpo'>
                            <div className='cadastrarItem-titulo'>
                                Edite o item
                            </div>
                            <div className='cadastrarItem-subtitulo'>
                                Esses dados garantem que o item esteja alinhado à matriz de avaliação e possa ser aplicado corretamente.
                            </div>
                        </div>

                        <FormularioElaboracaoComponent form={form} />

                        <div className='cadastrarItem-botoes'>
                            <div className='cadastrarItem-btn'>
                                <Button className='btnVoltar' onClick={voltar}>
                                    Voltar
                                </Button>
                            </div>
                            <div className='cadastrarItem-btn'>
                                <Button className='btnVoltar' onClick={cancelar}>Cancelar</Button>
                            </div>
                            <div className='cadastrarItem-btn'>
                                <Button
                                    type='primary'
                                    onClick={salvarRascunho}
                                    loading={carregando}
                                    className='btnRascunho'
                                >
                                    Salvar rascunho
                                </Button>
                            </div>
                            <div className='cadastrarItem-btn'>
                                <Button className='btnAvancar'
                                // onClick={salvar}
                                >Salvar</Button>
                            </div>
                        </div>
                    </div>
                    <CadastrarItemRodapeComponent />
                </Form>
            </Spin>
        </>
    );
};

export default CadastrarItemNovoElaboracao;