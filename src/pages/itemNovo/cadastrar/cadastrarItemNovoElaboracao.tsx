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
    const [verificacaoInicialFeita, setVerificacaoInicialFeita] = useState(false);

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
    const carregarItemDoLocalStorage = useCallback((): { id: number, codigoItem: string, configuracao: any, elaboracao?: any } | null => {
        try {
            const itemSalvo = localStorage.getItem('itemAtual');
            if (itemSalvo) {
                const item = JSON.parse(itemSalvo);

                // 🔧 Normaliza palavrasChave - converte string separada por ';' em array
                if (item.configuracao && item.configuracao.palavrasChave) {
                    if (typeof item.configuracao.palavrasChave === 'string') {
                        item.configuracao.palavrasChave = item.configuracao.palavrasChave
                            .split(';')
                            .filter((p: string) => p && p.trim());
                        console.log('🔧 palavrasChave convertida de string para array na elaboração:', item.configuracao.palavrasChave);
                    }
                }

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
            localStorage.removeItem('itemNovo'); // 🧹 Remove também chave antiga para limpeza completa
            localStorage.removeItem('voltandoParaPrimeiraTela'); // 🧹 Remove flag de navegação
            localStorage.removeItem('persist:SERAP-ITEM-PERSIST');
            console.log('🗑️ Todas as chaves do item removidas do localStorage na elaboração');
        } catch (error) {
            console.error('❌ Erro ao limpar localStorage:', error);
        }
    }, []);

    const voltar = async () => {
        console.log('🔙 Voltando para primeira tela - recarregando dados completos...');

        if (item.id && item.id > 0) {
            try {
                setCarregando(true);

                // 🏷️ MARCA que estamos vindo do "Voltar" para o FormularioUnico saber como agir
                localStorage.setItem('voltandoParaPrimeiraTela', 'true');

                // 🔄 Usa a nova função que carrega dados completos com alternativas
                const dadosCompletos = await obterItemComAlternativasEPopular(item.id);

                if (dadosCompletos) {
                    console.log('✅ Dados completos recarregados com sucesso, navegando para primeira tela...');
                } else {
                    console.log('⚠️ Falha ao recarregar dados, mas navegando mesmo assim...');
                }
            } catch (error) {
                console.error('❌ Erro ao recarregar dados:', error);
                mensagem('error', 'Erro', 'Erro ao recarregar dados do item');
            } finally {
                //setCarregando(false);
            }
        } else {
            console.log('⚠️ ID do item não disponível, navegando sem recarregar...');
        }

        // 🔄 Pequeno delay para garantir que dados sejam processados antes de navegar
        setTimeout(() => {
            setCarregando(false);
            navigate('/criacao');
        }, 500);
    };

    // ✅ useEffect para limpar localStorage no primeiro acesso direto à segunda página (sem navegação válida)
    useEffect(() => {
        if (!verificacaoInicialFeita) {
            // Detecta acesso direto inválido: sem dados obrigatórios no Redux E sem localStorage válido
            const temDadosObrigatorios = item.id > 0 && configuracaoItemNovo?.codigoItem && configuracaoItemNovo.codigoItem.trim() !== '';
            const localStorageItem = carregarItemDoLocalStorage();
            const temLocalStorageValido = localStorageItem && localStorageItem.id > 0 && localStorageItem.codigoItem && localStorageItem.codigoItem.trim() !== '';

            if (!temDadosObrigatorios && !temLocalStorageValido) {
                console.log('🧹 Acesso direto inválido à segunda página - limpando localStorage e redirecionando');
                limparItemDoLocalStorage();

                // Limpa Redux também
                const itemLimpo: ItemNovoProps = {
                    id: 0,
                    configuracao: {},
                    elaboracao: {} as ElaboracaoItemNovoProps,
                };
                dispatch(setItemNovo(itemLimpo));
                dispatch(setConfiguracaoItemNovo({}));
                dispatch(setElaboracaoItemNovo({} as ElaboracaoItemNovoProps));

                // Redireciona para primeira página
                setTimeout(() => {
                    navigate('/item-novo');
                }, 100);
                return;
            }

            setVerificacaoInicialFeita(true);
        }
    }, [verificacaoInicialFeita, item.id, configuracaoItemNovo, carregarItemDoLocalStorage, limparItemDoLocalStorage, dispatch, navigate, setVerificacaoInicialFeita]);

    // Validação dos parâmetros obrigatórios para acessar esta tela
    useEffect(() => {
        let parametrosObrigatorios = {
            id: item.id,
            codigoItem: configuracaoItemNovo?.codigoItem,
            areaConhecimentoId: configuracaoItemNovo?.areaConhecimento,
            disciplinaId: configuracaoItemNovo?.disciplina
        };

        // Se Redux estiver vazio, tenta carregar do localStorage
        if ((!parametrosObrigatorios.id || parametrosObrigatorios.id === 0) ||
            (!parametrosObrigatorios.codigoItem || parametrosObrigatorios.codigoItem.trim() === '')) {

            const itemSalvo = carregarItemDoLocalStorage();
            if (itemSalvo && itemSalvo.id > 0 && itemSalvo.codigoItem && itemSalvo.codigoItem.trim() !== '') {
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
                    codigoItem: itemSalvo.codigoItem,
                    areaConhecimentoId: itemSalvo.configuracao?.areaConhecimento,
                    disciplinaId: itemSalvo.configuracao?.disciplina
                };
            }
        }

        const parametrosFaltando = [];
        if (!parametrosObrigatorios.id || parametrosObrigatorios.id === 0) {
            parametrosFaltando.push('ID do item');
        }
        if (!parametrosObrigatorios.codigoItem || parametrosObrigatorios.codigoItem.trim() === '') {
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

    // 🎯 Função para carregar dados completos do backend via obterItemComAlternativas
    const obterItemComAlternativasEPopular = useCallback(async (itemId: number) => {
        try {
            console.log('🔄 ELABORAÇÃO: Carregando dados completos do backend (id:', itemId, ')...');
            const resposta = await configuracaoItemService.obterItemComAlternativas(itemId);
            
            if (resposta?.data) {
                console.log('✅ Dados completos recebidos do backend:', resposta.data);
                
                // ✅ Mapeia dados de configuração do backend
                const configuracaoItemRetorno = {
                    codigoItem: resposta.data.codigoItem,
                    areaConhecimento: resposta.data.areaconhecimentoId, // ← backend usa minúscula
                    disciplina: resposta.data.disciplinaId,
                    matriz: resposta.data.matrizId,
                    competencia: resposta.data.competenciaId,
                    habilidade: resposta.data.habilidadeId,
                    anoMatriz: resposta.data.anoMatrizId,
                    assunto: resposta.data.assuntoId,
                    subAssunto: resposta.data.subAssuntoId,
                    situacaoItem: resposta.data.situacao,
                    tipoItem: resposta.data.tipo,
                    quantidadeAlternativas: resposta.data.quantidadeAlternativasId,
                    dificuldadeSugerida: resposta.data.dificuldadeSugeridaId,
                    discriminacao: resposta.data.discriminacao,
                    dificuldade: resposta.data.dificuldade,
                    nivelItem: resposta.data.nivelItem,
                    acertoCasual: resposta.data.acertoCasual,
                    palavrasChave: Array.isArray(resposta.data.palavrasChave) 
                        ? resposta.data.palavrasChave.filter((p: string) => p && p.trim())
                        : resposta.data.palavrasChave 
                            ? resposta.data.palavrasChave.split(';').filter((p: string) => p && p.trim())
                            : [],
                    parametroBTransformado: resposta.data.parametroBTransformado,
                    mediaDesvioPadrao: resposta.data.mediaEhDesvio,
                    sentencaDescritora: resposta.data.sentencaDescritora,
                    observacao: resposta.data.observacao,
                };

                // ✅ Mapeia dados de elaboração do backend (incluindo alternativas)
                const elaboracaoItemRetorno = {
                    textoBase: resposta.data.textoBase || '',
                    fonte: resposta.data.fonte || '',
                    enunciado: resposta.data.enunciado || '',
                    codigoItem: resposta.data.codigoItem,
                    video: [], // TODO: mapear arquivos se necessário
                    audio: [], // TODO: mapear arquivos se necessário 
                    alternativaA: resposta.data.alternativas?.find((a: any) => a.numeracao === 'A')?.descricao || '',
                    justificativaA: resposta.data.alternativas?.find((a: any) => a.numeracao === 'A')?.justificativa || '',
                    alternativaB: resposta.data.alternativas?.find((a: any) => a.numeracao === 'B')?.descricao || '',
                    justificativaB: resposta.data.alternativas?.find((a: any) => a.numeracao === 'B')?.justificativa || '',
                    alternativaC: resposta.data.alternativas?.find((a: any) => a.numeracao === 'C')?.descricao || '',
                    justificativaC: resposta.data.alternativas?.find((a: any) => a.numeracao === 'C')?.justificativa || '',
                    alternativaD: resposta.data.alternativas?.find((a: any) => a.numeracao === 'D')?.descricao || '',
                    justificativaD: resposta.data.alternativas?.find((a: any) => a.numeracao === 'D')?.justificativa || '',
                    alternativaCorreta: resposta.data.alternativas?.find((a: any) => a.correta)?.numeracao || 'A',
                    // 🆔 SALVANDO IDs DAS ALTERNATIVAS para update
                    idAlternativaA: resposta.data.alternativas?.find((a: any) => a.numeracao === 'A')?.id || null,
                    idAlternativaB: resposta.data.alternativas?.find((a: any) => a.numeracao === 'B')?.id || null,
                    idAlternativaC: resposta.data.alternativas?.find((a: any) => a.numeracao === 'C')?.id || null,
                    idAlternativaD: resposta.data.alternativas?.find((a: any) => a.numeracao === 'D')?.id || null,
                };

                console.log('🎯 Configuração mapeada:', configuracaoItemRetorno);
                console.log('🎯 Elaboração mapeada com alternativas:', elaboracaoItemRetorno);

                // ✅ Atualiza Redux com dados completos do backend
                dispatch(setConfiguracaoItemNovo(configuracaoItemRetorno));
                dispatch(setElaboracaoItemNovo(elaboracaoItemRetorno));
                dispatch(setItemNovo({
                    id: itemId,
                    configuracao: configuracaoItemRetorno,
                    elaboracao: elaboracaoItemRetorno
                }));

                // ✅ Salva dados completos no localStorage
                const itemParaLocalStorage = {
                    id: itemId,
                    codigoItem: configuracaoItemRetorno.codigoItem,
                    configuracao: configuracaoItemRetorno,
                    elaboracao: elaboracaoItemRetorno
                };
                localStorage.setItem('itemAtual', JSON.stringify(itemParaLocalStorage));
                console.log('💾 Dados completos salvos no localStorage:', itemParaLocalStorage);

                return { configuracao: configuracaoItemRetorno, elaboracao: elaboracaoItemRetorno };
            } else {
                console.warn('⚠️ Backend não retornou dados para o item');
                return null;
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados completos do backend:', error);
            return null;
        }
    }, [dispatch]);

    // ✅ useEffect INTELIGENTE: Prioriza backend, fallback para localStorage
    useEffect(() => {
        const executarCarregamento = async () => {
            // 🎯 1ª PRIORIDADE: Se tem ID no Redux, busca dados completos do backend
            if (item.id > 0) {
                console.log('🎯 ELABORAÇÃO: ID disponível no Redux, carregando do backend...');
                const dadosBackend = await obterItemComAlternativasEPopular(item.id);
                
                if (dadosBackend) {
                    console.log('✅ Dados carregados do backend com sucesso');
                    return; // ✅ Sucesso, não precisa fazer mais nada
                }
                console.log('⚠️ Falha ao carregar do backend, tentando localStorage...');
            }

            // 🎯 2ª PRIORIDADE: Fallback para localStorage se backend falhar
            const itemSalvo = carregarItemDoLocalStorage();
            
            if (itemSalvo && itemSalvo.id > 0 && itemSalvo.codigoItem && itemSalvo.codigoItem.trim() !== '') {
                console.log('💾 ELABORAÇÃO: Carregando dados do localStorage como fallback...');
                console.log('📋 Dados encontrados:', { 
                    id: itemSalvo.id, 
                    codigoItem: itemSalvo.codigoItem,
                    temConfiguracao: !!itemSalvo.configuracao,
                    temElaboracao: !!(itemSalvo as any).elaboracao
                });
                
                // Restaura configuração no Redux
                if (itemSalvo.configuracao) {
                    dispatch(setConfiguracaoItemNovo(itemSalvo.configuracao));
                }
                
                // Restaura elaboração no Redux
                if ((itemSalvo as any).elaboracao) {
                    dispatch(setElaboracaoItemNovo((itemSalvo as any).elaboracao));
                    console.log('✅ Dados da elaboração restaurados do localStorage:', (itemSalvo as any).elaboracao);
                }
                
                // Restaura item no Redux
                dispatch(setItemNovo({
                    id: itemSalvo.id,
                    configuracao: itemSalvo.configuracao || {},
                    elaboracao: (itemSalvo as any).elaboracao || {}
                }));
            } else {
                console.log('📂 Nem backend nem localStorage têm dados válidos');
            }
        };

        executarCarregamento();
    }, []); // 🎯 SEM dependências - executa só quando componente monta

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

    // � Função para salvar dados atuais do formulário no localStorage
    const salvarDadosFormularioNoLocalStorage = useCallback(() => {
        try {
            const values = form.getFieldsValue(true);
            
            // Cria objeto de elaboração com dados atuais do formulário
            const elaboracaoAtual = {
                textoBase: values[campoTextoBase] || '',
                fonte: values[campoFonte] || '',
                enunciado: values[campoEnunciado] || '',
                codigoItem: values[campoCodigoItem] || configuracaoItemNovo?.codigoItem,
                video: values[campoVideo] || [],
                audio: values[campoAudio] || [],
                alternativaA: values[campoAlternativaA] || '',
                justificativaA: values[campoJustificativaA] || '',
                alternativaB: values[campoAlternativaB] || '',
                justificativaB: values[campoJustificativaB] || '',
                alternativaC: values[campoAlternativaC] || '',
                justificativaC: values[campoJustificativaC] || '',
                alternativaD: values[campoAlternativaD] || '',
                justificativaD: values[campoJustificativaD] || '',
                alternativaCorreta: values[campoAlternativaCorreta] || 'A',
                // 🆔 PRESERVA IDs DAS ALTERNATIVAS existentes do Redux (para update)
                idAlternativaA: elaboracaoItemNovo?.idAlternativaA || null,
                idAlternativaB: elaboracaoItemNovo?.idAlternativaB || null,
                idAlternativaC: elaboracaoItemNovo?.idAlternativaC || null,
                idAlternativaD: elaboracaoItemNovo?.idAlternativaD || null,
            };

            // Atualiza Redux com dados do formulário
            dispatch(setElaboracaoItemNovo(elaboracaoAtual));

            // Salva no localStorage dados atuais
            const itemParaLocalStorage = {
                id: item.id,
                codigoItem: configuracaoItemNovo?.codigoItem,
                configuracao: configuracaoItemNovo,
                elaboracao: elaboracaoAtual // ← Dados atuais do formulário
            };

            localStorage.setItem('itemAtual', JSON.stringify(itemParaLocalStorage));
            console.log('💾 Dados do formulário salvos no localStorage:', itemParaLocalStorage.elaboracao);
            
        } catch (error) {
            console.error('❌ Erro ao salvar dados do formulário no localStorage:', error);
        }
    }, [form, item.id, configuracaoItemNovo, dispatch, 
        campoTextoBase, campoFonte, campoEnunciado, campoCodigoItem,
        campoVideo, campoAudio, campoAlternativaA, campoJustificativaA, 
        campoAlternativaB, campoJustificativaB, campoAlternativaC, campoJustificativaC, 
        campoAlternativaD, campoJustificativaD, campoAlternativaCorreta]);

    // �🔄 Watch mudanças nos campos e salva automaticamente no localStorage
    const watchedValues = Form.useWatch([], form);
    useEffect(() => {
        // Só salva se tem dados essenciais
        if (item.id > 0 && configuracaoItemNovo?.codigoItem && watchedValues) {
            // Debounce para não salvar muito frequentemente
            const timeoutId = setTimeout(() => {
                console.log('🔄 Campo alterado, salvando no localStorage...', Object.keys(watchedValues));
                salvarDadosFormularioNoLocalStorage();
            }, 1000); // 1 segundo de debounce

            return () => clearTimeout(timeoutId);
        }
    }, [watchedValues, item.id, configuracaoItemNovo?.codigoItem, salvarDadosFormularioNoLocalStorage]);

    // Método para gerar o DTO para salvar
    const gerarItemSalvar = useCallback(() => {
        const values = cloneDeep(form.getFieldsValue(true));

        console.log('📋 Valores do formulário da elaboração:', values);
        console.log('🆔 IDs das alternativas no Redux:', {
            idA: elaboracaoItemNovo?.idAlternativaA,
            idB: elaboracaoItemNovo?.idAlternativaB,
            idC: elaboracaoItemNovo?.idAlternativaC,
            idD: elaboracaoItemNovo?.idAlternativaD
        });

        // Monta as alternativas com base nos campos individuais
        const alternativasDto: AltenativaDto[] = [];

        if (values[campoAlternativaA]) {
            const alternativaA: any = {
                numeracao: 'A',
                descricao: values[campoAlternativaA],
                justificativa: values[campoJustificativaA] || '',
                correta: values[campoAlternativaCorreta] === 'A',
                ordem: 1,
                itemId: item.id,
            };
            // 🆔 ADICIONA ID se existir (para update)
            if (elaboracaoItemNovo?.idAlternativaA) {
                alternativaA.id = elaboracaoItemNovo.idAlternativaA;
            }
            alternativasDto.push(alternativaA);
        }

        if (values[campoAlternativaB]) {
            const alternativaB: any = {
                numeracao: 'B',
                descricao: values[campoAlternativaB],
                justificativa: values[campoJustificativaB] || '',
                correta: values[campoAlternativaCorreta] === 'B',
                ordem: 2,
                itemId: item.id,
            };
            // 🆔 ADICIONA ID se existir (para update)
            if (elaboracaoItemNovo?.idAlternativaB) {
                alternativaB.id = elaboracaoItemNovo.idAlternativaB;
            }
            alternativasDto.push(alternativaB);
        }

        if (values[campoAlternativaC]) {
            const alternativaC: any = {
                numeracao: 'C',
                descricao: values[campoAlternativaC],
                justificativa: values[campoJustificativaC] || '',
                correta: values[campoAlternativaCorreta] === 'C',
                ordem: 3,
                itemId: item.id
            };
            // 🆔 ADICIONA ID se existir (para update)
            if (elaboracaoItemNovo?.idAlternativaC) {
                alternativaC.id = elaboracaoItemNovo.idAlternativaC;
            }
            alternativasDto.push(alternativaC);
        }

        if (values[campoAlternativaD]) {
            const alternativaD: any = {
                numeracao: 'D',
                descricao: values[campoAlternativaD],
                justificativa: values[campoJustificativaD] || '',
                correta: values[campoAlternativaCorreta] === 'D',
                ordem: 4,
                itemId: item.id,
            };
            // 🆔 ADICIONA ID se existir (para update)
            if (elaboracaoItemNovo?.idAlternativaD) {
                alternativaD.id = elaboracaoItemNovo.idAlternativaD;
            }
            alternativasDto.push(alternativaD);
        }

        console.log('🎯 Alternativas montadas para envio:', alternativasDto);

        // 🔍 DEBUG: verificar dados da configuração
        console.log('🔍 CONFIGURAÇÃO REDUX PARA DTO:', configuracaoItemNovo);
        console.log('🔍 AREA CONHECIMENTO ESPECIFICAMENTE:', {
            valor: configuracaoItemNovo?.areaConhecimento,
            tipo: typeof configuracaoItemNovo?.areaConhecimento,
            undefined: configuracaoItemNovo?.areaConhecimento === undefined
        });

        const dto: ItemNovoDto = {
            id: item.id,
            codigoItem: configuracaoItemNovo?.codigoItem || '',
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
            // Conversão segura do palavrasChave para elaboração (campo não obrigatório)
            palavrasChave: (() => {
                let palavrasChaveConvertido = '';

                if (configuracaoItemNovo?.palavrasChave) {
                    if (Array.isArray(configuracaoItemNovo.palavrasChave)) {
                        // Filtra valores vazios e junta com ';'
                        const palavrasValidas = configuracaoItemNovo.palavrasChave.filter((p: string) => p && p.trim());
                        palavrasChaveConvertido = palavrasValidas.length > 0 ? palavrasValidas.join(';') : '';
                    } else if (typeof configuracaoItemNovo.palavrasChave === 'string') {
                        const palavraString = (configuracaoItemNovo.palavrasChave as string).trim();
                        if (palavraString) {
                            palavrasChaveConvertido = palavraString;
                        }
                    }
                }

                console.log('🔧 palavrasChave convertido na elaboração:', {
                    original: configuracaoItemNovo?.palavrasChave,
                    convertido: palavrasChaveConvertido,
                    isEmpty: !palavrasChaveConvertido
                });
                return palavrasChaveConvertido || null; // null se vazio
            })(),
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

        // 🔍 Debug específico para palavrasChave
        console.log('🔍 Debug palavrasChave:', {
            original: configuracaoItemNovo?.palavrasChave,
            tipo: typeof configuracaoItemNovo?.palavrasChave,
            isArray: Array.isArray(configuracaoItemNovo?.palavrasChave),
            final: dto.palavrasChave,
            tipoFinal: typeof dto.palavrasChave,
            formatoBackend: 'String separada por ";" ex: "escola;livro"'
        });

        console.log('🚀 DTO Final da elaboração sendo enviado:', dto);

        // 🧪 Teste de serialização para detectar referências circulares
        try {
            const testeSerializacao = JSON.stringify(dto);
            console.log('✅ DTO da elaboração serializa corretamente - tamanho:', testeSerializacao.length);
        } catch (error) {
            console.error('❌ ERRO na serialização do DTO da elaboração:', error);
            console.log('🔍 Analisando cada propriedade do DTO da elaboração:');
            Object.keys(dto).forEach(key => {
                try {
                    JSON.stringify((dto as any)[key]);
                    console.log(`✅ ${key}: OK`);
                } catch (err) {
                    console.error(`❌ ${key}: ERRO -`, err);
                }
            });
        }

        return dto;
    }, [item.id, configuracaoItemNovo, form, campoTextoBase, campoFonte, campoEnunciado,
        campoVideo, campoAudio, campoAlternativaA, campoJustificativaA, campoAlternativaB,
        campoJustificativaB, campoAlternativaC, campoJustificativaC, campoAlternativaD,
        campoJustificativaD, campoAlternativaCorreta]);

    const inserirRascunhoItem = useCallback(
        async (itemDto: ItemNovoDto) => {
            await configuracaoItemService
                .salvarRascunhoItemNovo(itemDto)
                .then(async (resp) => {
                    mensagem('success', 'Sucesso', 'Rascunho de item salvo com sucesso');
                    console.log('✅ Rascunho salvo com ID:', resp.data);

                    // 🔄 USA NOVA FUNÇÃO: Carrega dados completos atualizados do backend
                    try {
                        console.log('🔄 Recarregando dados completos após salvar rascunho...');
                        const dadosAtualizados = await obterItemComAlternativasEPopular(item.id);
                        
                        if (dadosAtualizados) {
                            console.log('✅ Dados completos recarregados com sucesso após salvar rascunho');
                        } else {
                            console.warn('⚠️ Falha ao recarregar dados do backend após salvar rascunho');
                            // Fallback: usar dados do formulário se consulta falhar
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
                        }
                    } catch (error) {
                        console.error('❌ Erro ao recarregar dados após salvar rascunho:', error);
                        // Fallback: usar dados do formulário se consulta falhar
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
            
            // 🔥 IMPORTANTE: Salva dados do formulário no localStorage PRIMEIRO
            console.log('💾 Salvando dados atuais do formulário no localStorage...');
            salvarDadosFormularioNoLocalStorage();
            
            const itemSalvar = gerarItemSalvar();
            console.log('💾 Salvando rascunho da elaboração:', itemSalvar);

            await inserirRascunhoItem(itemSalvar);
            setCarregando(false);
        },
        [gerarItemSalvar, inserirRascunhoItem, salvarDadosFormularioNoLocalStorage],
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