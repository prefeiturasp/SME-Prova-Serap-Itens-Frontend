import { Button, Form, FormProps, notification, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import CadastrarItemHeaderComponent from './cadastrarItemHeaderComponent';
import CadastrarItemRodapeComponent from './cadastrarItemRodapeComponent';




const CadastrarItemNovo: React.FC<FormProps> = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [carregando, setCarregando] = useState<boolean>(false);
    const item = useSelector((state: AppState) => state.item);
    const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);
    //const elaboracaoItemNovo = useSelector((state: AppState) => state.elaboracaoItemNovo);

    const [form] = Form.useForm();
    const initialValuesForm = {
        infoEstatisticasDiscriminacao: '',
        infoEstatisticasDificuldade: '',
        infoEstatisticasAcertoCasual: '',
        parametroBTransformado: '',
        tipoItem: DadosIniciais.tipoItemIdPadrao,
        dificuldadeSugerida: 5,
        quantidadeAlternativas: 23,
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
    const [bloquearBtnAvancar, setBloquearBtnAvancar] = useState<boolean>(true);

    // 💾 Funções para gerenciar localStorage
    const salvarItemNoLocalStorage = useCallback((itemData: { id: number, codigo: number, configuracao: any }) => {
        try {
            localStorage.setItem('itemAtual', JSON.stringify(itemData));
            console.log('💾 Item salvo no localStorage:', itemData);
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
        }
    }, []);

    const carregarItemDoLocalStorage = useCallback((): { id: number, codigo: number, configuracao: any } | null => {
        try {
            const itemSalvo = localStorage.getItem('itemAtual');
            if (itemSalvo) {
                const item = JSON.parse(itemSalvo);
                console.log('📂 Item carregado do localStorage:', item);
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
            console.log('🗑️ Item removido do localStorage');
        } catch (error) {
            console.error('❌ Erro ao limpar localStorage:', error);
        }
    }, []);

    // ✅ useEffect refatorado para usar valores do formulário ao invés do Redux
    useEffect(() => {
        const bloquear =
            validarCampoForm(disciplinaIdForm) ||
            validarCampoForm(areaConhecimentoIdForm);

        setBloquearBtnSalvarRascunho(bloquear);
    }, [areaConhecimentoIdForm, disciplinaIdForm]);

    // ✅ useEffect para carregar dados do localStorage na inicialização
    useEffect(() => {
        // Se Redux estiver vazio, tenta carregar do localStorage
        if ((!item.id || item.id === 0) && (!configuracaoItemNovo?.codigo || configuracaoItemNovo.codigo === 0)) {
            const itemSalvo = carregarItemDoLocalStorage();
            if (itemSalvo && itemSalvo.id > 0 && itemSalvo.codigo > 0) {
                console.log('🔄 Restaurando dados do localStorage para o Redux...');
                
                // Restaura no Redux
                const itemAtual: ItemNovoProps = {
                    id: itemSalvo.id,
                    configuracao: itemSalvo.configuracao,
                    elaboracao: {} as ElaboracaoItemNovoProps,
                };
                
                dispatch(setItemNovo(itemAtual));
                dispatch(setConfiguracaoItemNovo(itemSalvo.configuracao));
                
                // Popula o formulário
                Object.keys(itemSalvo.configuracao).forEach(key => {
                    const value = itemSalvo.configuracao[key];
                    if (value !== undefined && value !== null) {
                        form?.setFieldValue(key, value);
                    }
                });
            }
        }
    }, [carregarItemDoLocalStorage, dispatch, form]); // Executa apenas uma vez na inicialização

    // ✅ useEffect para controlar bloqueio do botão avançar baseado no Redux
    useEffect(() => {
        const temIdECodigo = item.id > 0 && configuracaoItemNovo?.codigo && configuracaoItemNovo.codigo > 0;
        
        console.log('🔍 Verificando condições para habilitar botão Avançar:', {
            itemId: item.id,
            codigoItem: configuracaoItemNovo?.codigo,
            podeAvancar: temIdECodigo
        });
        
        setBloquearBtnAvancar(!temIdECodigo);
    }, [item.id, configuracaoItemNovo?.codigo]);


    type tipoMsg = 'success' | 'info' | 'warning' | 'error';
    const [api, contextHolder] = notification.useNotification();
    const mensagem = useCallback(
        async (tipo: tipoMsg, titulo: string, msg: string) => {
            api[tipo]({ message: titulo, description: msg });
        },
        [api],
    );

    const cancelar = () => {
        setCarregando(true);
        
        // Limpa localStorage
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

    const avancar = () => {
        // Validação adicional antes de navegar
        if (!item.id || item.id === 0) {
            mensagem('error', 'Erro', 'É necessário salvar o item antes de avançar');
            return;
        }
        
        if (!configuracaoItemNovo?.codigo || configuracaoItemNovo.codigo === 0) {
            mensagem('error', 'Erro', 'É necessário que o item tenha um código antes de avançar');
            return;
        }
        
        console.log('✅ Navegando para elaboração com:', {
            id: item.id,
            codigo: configuracaoItemNovo.codigo
        });
        
        navigate('/elaboracao');
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
            tipo: values?.tipoItem ? Number(values.tipoItem) : 1, // ← Corrigido: 'tipo' como no backend
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
                        areaConhecimento: resp.data.areaconhecimentoId, // ← Corrigido: minúsculo "c"
                        disciplina: resp.data.disciplinaId,
                        matriz: resp.data.matrizId,
                        competencia: resp.data.competenciaId,
                        habilidade: resp.data.habilidadeId,
                        anoMatriz: resp.data.anoMatrizId,
                        assunto: resp.data.assuntoId,
                        subAssunto: resp.data.subAssuntoId,
                        situacaoItem: resp.data.situacao,
                        tipoItem: resp.data.tipo,
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
                    // 🔍 Agora Redux terá id e codigo - próximos salvamentos serão EDIÇÃO
                    const itemAtual: ItemNovoProps = {
                        ...item,
                        id: id,
                        configuracao: configuracaoItemRetorno
                    };

                    dispatch(setConfiguracaoItemNovo(configuracaoItemRetorno));
                    dispatch(setItemNovo(itemAtual));

                    // ✅ 3. Salvar no localStorage para persistir dados
                    salvarItemNoLocalStorage({
                        id: id,
                        codigo: configuracaoItemRetorno.codigo,
                        configuracao: configuracaoItemRetorno
                    });

                    // ✅ 4. Atualizar formulário com os dados carregados
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

    // 🔒 Validação de campos obrigatórios antes de enviar para backend
    const validarCamposObrigatorios = useCallback((dto: ItemNovoDto): boolean => {
        // ✅ Campos SEMPRE obrigatórios (primeiro salvamento e edição)
        const camposSempreObrigatorios = [
            { campo: 'areaConhecimentoId', valor: dto.areaConhecimentoId, nome: 'Área de Conhecimento' },
            { campo: 'disciplinaId', valor: dto.disciplinaId, nome: 'Disciplina' },
        ];

        // 🔍 Verifica se é edição (tem id e codigo no Redux)
        const ehEdicao = item.id > 0 && item.configuracao?.codigo && item.configuracao?.codigo > 0;

        console.log('🔍 Modo de operação:', {
            ehEdicao,
            itemReduxId: item.id,
            itemReduxCodigo: item.configuracao?.codigo,
            dtoId: dto.id,
            dtoCodigo: dto.codigoItem
        });

        let camposObrigatorios = [...camposSempreObrigatorios];

        // ✅ Se for edição, id e codigoItem também são obrigatórios
        if (ehEdicao) {
            camposObrigatorios.push(
                { campo: 'id', valor: dto.id, nome: 'ID' },
                { campo: 'codigoItem', valor: dto.codigoItem, nome: 'Código do Item' }
            );
        }

        const camposFaltando = camposObrigatorios.filter(({ valor }) =>
            valor === null || valor === undefined || valor === 0
        );

        if (camposFaltando.length > 0) {
            const nomesCampos = camposFaltando.map(({ nome }) => nome).join(', ');
            const tipoOperacao = ehEdicao ? 'edição' : 'criação';
            mensagem('error', 'Campos Obrigatórios',
                `Para ${tipoOperacao} do item, os seguintes campos são obrigatórios: ${nomesCampos}`
            );
            console.error(`❌ Campos obrigatórios faltando para ${tipoOperacao}:`, camposFaltando);
            return false;
        }

        console.log(`✅ Validação passou! Modo: ${ehEdicao ? 'Edição' : 'Criação'}`);
        return true;
    }, [mensagem, item.id, item.configuracao?.codigo]);

    const salvarItem = useCallback(
        async (rascunho = false) => {
            setCarregando(true);
            const itemSalvar = gerarItemSalvar();
            console.log('itemSalvar', itemSalvar);

            // 🔒 Validar campos obrigatórios antes de enviar
            if (!validarCamposObrigatorios(itemSalvar)) {
                setCarregando(false);
                return;
            }

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
                    <CadastrarItemHeaderComponent pagina={1} />

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
                                <Button className='btnVoltar' onClick={cancelar}>Cancelar</Button>
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
                                <Button 
                                    className='btnAvancar' 
                                    onClick={avancar}
                                    disabled={bloquearBtnAvancar}
                                    type={bloquearBtnAvancar ? 'default' : 'primary'}
                                >
                                    Avançar
                                </Button>
                            </div>
                        </div>
                    </div>
                    <CadastrarItemRodapeComponent />
                </Form>
            </Spin>
        </>
    );
}

/* 
🔒 REDUX SIMPLIFICADO - Uma Validação, Todas as Situações

✅ REDUX (simples):
   dispatch(setConfiguracaoItemNovo({ dificuldade: 5 })); // Sempre Partial
   dispatch(setElaboracaoItemNovo({ textoBase: "texto" })); // Sempre Partial

🎯 VALIDAÇÃO INTELIGENTE:
   A função validarCamposObrigatorios() detecta automaticamente:
   
   🆕 CRIAÇÃO (Redux: id=0): 
      - Obrigatórios: disciplina, areaConhecimento
      - Backend gera: id, codigoItem
   
   ✏️ EDIÇÃO (Redux: id>0 + codigo>0):
      - Obrigatórios: id, codigo, disciplina, areaConhecimento  
      - Backend atualiza: item existente

🔄 FLUXO:
   1️⃣ Primeira vez → disciplina+área → Backend gera ID/código → Redux atualizado
   2️⃣ Navegação → Redux mantém ID/código
   3️⃣ Voltar → Redux resetado (id=0)
   4️⃣ Listagem→Edição → Redux carregado com ID/código

🚀 SEM COMPLEXIDADE: Uma validação serve para tudo!
*/

export default CadastrarItemNovo;

