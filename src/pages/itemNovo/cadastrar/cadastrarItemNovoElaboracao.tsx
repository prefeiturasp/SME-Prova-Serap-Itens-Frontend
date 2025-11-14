import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { VideoArquivoDto, AudioArquivoDto } from '~/domain/dto/ArquivoMidiaDto';

// Services
import configuracaoItemService from '~/services/configuracaoItem-service';

// Usaremos estado local + localStorage

// Enums
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { SelectValueType } from "~/domain/type/select";

// Tipos locais
export interface ConfiguracaoItemNovoProps {
    codigoItem: string;
    areaConhecimento: SelectValueType;
    disciplina: SelectValueType;
    matriz: SelectValueType;
    anoMatriz: SelectValueType;
    competencia: SelectValueType;
    habilidade: SelectValueType;
    assunto: SelectValueType;
    subAssunto: SelectValueType;
    situacaoItem: SelectValueType;
    tipoItem: SelectValueType;
    quantidadeAlternativas: SelectValueType;
    dificuldadeSugerida: SelectValueType;
    nivelItem: SelectValueType;
    discriminacao: number | string | null;
    dificuldade: number | string | null;
    acertoCasual: number | string | null;
    palavrasChave: string[] | null;
    parametroBTransformado: number | string | null;
    mediaDesvioPadrao: string | null;
    observacao: string | null;
    sentencaDescritora: string | null;
}

export interface ElaboracaoLocalProps {
    textoBase?: string;
    fonte?: string;
    enunciado?: string;
    codigoItem?: string;
    alternativaA?: string;
    justificativaA?: string;
    alternativaB?: string;
    justificativaB?: string;
    alternativaC?: string;
    justificativaC?: string;
    alternativaD?: string;
    justificativaD?: string;
    alternativaCorreta?: 'A' | 'B' | 'C' | 'D';
    idAlternativaA?: number | null;
    idAlternativaB?: number | null;
    idAlternativaC?: number | null;
    idAlternativaD?: number | null;
    alternativasDto?: AltenativaDto[];
    // IDs dos arquivos de mídia
    ArquivoVideoId?: number | null;
    ArquivoAudioId?: number | null;
}

export interface videoAudioProps {
    videoTemp?: VideoArquivoDto;
    audioTemp?: AudioArquivoDto;
    videoSalvo?: VideoArquivoDto;
    audioSalvo?: AudioArquivoDto;
}

const CadastrarItemNovoElaboracao: React.FC<FormProps> = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const initialValuesForm = {}


    // const [messageApi, contextHolder] = message.useMessage();
    const [carregando, setCarregando] = useState(false);
    const [verificacaoInicialFeita, setVerificacaoInicialFeita] = useState(false);
    // 🔄 CONTROLE PARA EVITAR LOOP INFINITO NA SINCRONIZAÇÃO
    const [sincronizandoForm, setSincronizandoForm] = useState(false);
    const [ultimaSincronizacao, setUltimaSincronizacao] = useState<string>('');
    // 🔄 REF PARA CONTROLAR TIMEOUT DE SALVAMENTO
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [itemId, setItemId] = useState<number>(0);
    const [codigoItemEstado, setCodigoItemEstado] = useState<string>('');
    const [configuracaoItemNovo, setConfiguracaoItemNovoLocal] = useState<Partial<ConfiguracaoItemNovoProps>>({});
    const [elaboracaoItemNovo, setElaboracaoItemNovoLocal] = useState<ElaboracaoLocalProps>({});

    const [videoCaminho, setVideoCaminho] = useState<string>('');
    const [audioCaminho, setAudioCaminho] = useState<string>('');
    
    // 📁 ESTADOS PARA GERENCIAR ARQUIVOS DE MÍDIA
    const [videoAudioData, setVideoAudioData] = useState<videoAudioProps>({
        videoSalvo: undefined,
        audioSalvo: undefined,
        videoTemp: undefined,
        audioTemp: undefined,
    });

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

                // 📁 CARREGA DADOS DE VIDEO E AUDIO
                if (item.videoAudio) {
                    setVideoAudioData(item.videoAudio);
                    
                    // Define caminhos para preview - prioriza arquivo temporário (recém-upado) se existir
                    const videoPath = item.videoAudio.videoTemp?.fileLink || item.videoAudio.videoSalvo?.fileLink || '';
                    const audioPath = item.videoAudio.audioTemp?.fileLink || item.videoAudio.audioSalvo?.fileLink || '';
                    
                    setVideoCaminho(videoPath);
                    setAudioCaminho(audioPath);
                    
                    console.log('📁 Video/Audio carregados:', {
                        videoPath,
                        audioPath,
                        videoAudio: item.videoAudio
                    });
                }

                // Normaliza palavrasChave - converte string separada por ';' em array
                if (item.configuracao && item.configuracao.palavrasChave) {
                    if (typeof item.configuracao.palavrasChave === 'string') {
                        item.configuracao.palavrasChave = item.configuracao.palavrasChave
                            .split(';')
                            .filter((p: string) => p && p.trim());
                        console.log('🔧 palavrasChave convertida de string para array na elaboração:', item.configuracao.palavrasChave);
                    }
                }

                console.log('📂 Item completo carregado do localStorage na elaboração:', item);
                // Seta estados locais
                setItemId(item.id || 0);
                setCodigoItemEstado(item.codigoItem || '');
                if (item.configuracao) setConfiguracaoItemNovoLocal(item.configuracao);
                if (item.elaboracao) setElaboracaoItemNovoLocal(item.elaboracao);

                // ✅ Garante que o codigoItem da configuração prevaleça se o item for novo
                if (!item.elaboracao || !item.elaboracao.codigoItem) {
                    item.elaboracao = item.elaboracao || {};
                    item.elaboracao.codigoItem = item.codigoItem;
                }

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

        if (itemId && itemId > 0) {
            try {
                setCarregando(true);

                // 🏷️ MARCA que estamos vindo do "Voltar" para o FormularioUnico saber como agir
                localStorage.setItem('voltandoParaPrimeiraTela', 'true');

                // 🔄 Usa a nova função que carrega dados completos com alternativas
                const dadosCompletos = await obterItemComAlternativasEPopular(itemId);

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

    // ✅ Acesso direto inválido: apenas redireciona, NÃO limpa localStorage (limpeza só no botão Cancelar)
    useEffect(() => {
        if (!verificacaoInicialFeita) {
            const temDadosObrigatorios = itemId > 0 && (configuracaoItemNovo?.codigoItem || codigoItemEstado) && (configuracaoItemNovo?.codigoItem || codigoItemEstado)?.toString().trim() !== '';
            const localStorageItem = carregarItemDoLocalStorage();
            const temLocalStorageValido = localStorageItem && localStorageItem.id > 0 && localStorageItem.codigoItem && localStorageItem.codigoItem.trim() !== '';

            if (!temDadosObrigatorios && !temLocalStorageValido) {
                console.log('↩️ Acesso direto inválido à segunda página - redirecionando sem limpar localStorage');
                setTimeout(() => {
                    navigate('/item-novo');
                }, 100);
                return;
            }

            setVerificacaoInicialFeita(true);
        }
    }, [verificacaoInicialFeita, itemId, codigoItemEstado, configuracaoItemNovo, carregarItemDoLocalStorage, navigate, setVerificacaoInicialFeita]);

    // Validação dos parâmetros obrigatórios para acessar esta tela
    useEffect(() => {
        let parametrosObrigatorios = {
            id: itemId,
            codigoItem: configuracaoItemNovo?.codigoItem || codigoItemEstado,
            areaConhecimentoId: configuracaoItemNovo?.areaConhecimento,
            disciplinaId: configuracaoItemNovo?.disciplina
        };

        // Se estados locais estiverem vazios, tenta carregar do localStorage
        if ((!parametrosObrigatorios.id || parametrosObrigatorios.id === 0) ||
            (!parametrosObrigatorios.codigoItem || parametrosObrigatorios.codigoItem.trim() === '')) {

            const itemSalvo = carregarItemDoLocalStorage();
            if (itemSalvo && itemSalvo.id > 0 && itemSalvo.codigoItem && itemSalvo.codigoItem.trim() !== '') {
                console.log('🔄 Estados locais vazios, restaurando do localStorage...');
                // Restaura nos estados locais
                setItemId(itemSalvo.id);
                setCodigoItemEstado(itemSalvo.codigoItem);
                setConfiguracaoItemNovoLocal(itemSalvo.configuracao || {});
                // mantém elaboracao atual se existir

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
        console.log('📋 Dados carregados:', {
            item: parametrosObrigatorios,
            elaboracao: elaboracaoItemNovo
        });
    }, [itemId, configuracaoItemNovo, mensagem, navigate, elaboracaoItemNovo, carregarItemDoLocalStorage]);

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


    // 🔄 FUNÇÃO PARA SINCRONIZAR FORM COM LOCALSTORAGE (localStorage como fonte da verdade)
    const sincronizarFormComLocalStorage = useCallback((forcarSincronizacao = false) => {
        try {
            // 🚫 EVITA LOOP INFINITO - não sincroniza se já estiver sincronizando
            if (sincronizandoForm && !forcarSincronizacao) {
                console.log('🔄 Sincronização já em andamento, pulando...');
                return;
            }

            const itemSalvo = localStorage.getItem('itemAtual');
            if (itemSalvo) {
                const item = JSON.parse(itemSalvo);
                
                // 🔍 VERIFICA SE REALMENTE PRECISA SINCRONIZAR
                const hashAtual = JSON.stringify(item.videoAudio || {});
                if (hashAtual === ultimaSincronizacao && !forcarSincronizacao) {
                    console.log('🔄 Dados de mídia não mudaram, pulando sincronização');
                    return;
                }

                setSincronizandoForm(true);
                
                // 📁 SINCRONIZA CAMPOS DE VÍDEO/ÁUDIO DO LOCALSTORAGE PARA O FORM
                if (item.videoAudio) {
                    // Prioriza temporário sobre salvo (como deve ser)
                    const videoAtual = item.videoAudio.videoTemp || item.videoAudio.videoSalvo;
                    const audioAtual = item.videoAudio.audioTemp || item.videoAudio.audioSalvo;
                    
                    // 🔄 SINCRONIZA APENAS SE DIFERENTES DO FORM ATUAL
                    const formVideo = form.getFieldValue(campoVideo);
                    const formAudio = form.getFieldValue(campoAudio);
                    
                    if (videoAtual && (!formVideo || formVideo[0]?.uid !== videoAtual.uid)) {
                        console.log('🎬 Sincronizando vídeo do localStorage para Form:', videoAtual.name);
                        form.setFieldValue(campoVideo, [videoAtual]);
                    } else if (!videoAtual && formVideo?.length > 0) {
                        console.log('🗑️ Limpando campo vídeo no Form');
                        form.setFieldValue(campoVideo, []);
                    }
                    
                    if (audioAtual && (!formAudio || formAudio[0]?.uid !== audioAtual.uid)) {
                        console.log('🎵 Sincronizando áudio do localStorage para Form:', audioAtual.name);
                        form.setFieldValue(campoAudio, [audioAtual]);
                    } else if (!audioAtual && formAudio?.length > 0) {
                        console.log('🗑️ Limpando campo áudio no Form');
                        form.setFieldValue(campoAudio, []);
                    }
                }
                
                setUltimaSincronizacao(hashAtual);
                
                // 🕐 PEQUENO DELAY PARA EVITAR LOOP
                setTimeout(() => {
                    setSincronizandoForm(false);
                }, 100);
            }
        } catch (error) {
            console.error('❌ Erro ao sincronizar Form com localStorage:', error);
            setSincronizandoForm(false);
        }
    }, [form, campoVideo, campoAudio, sincronizandoForm, ultimaSincronizacao]);

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
                let elaboracaoItemRetorno: ElaboracaoLocalProps = {
                    textoBase: resposta.data.textoBase || '',
                    fonte: resposta.data.fonte || '',
                    enunciado: resposta.data.enunciado || '',
                    codigoItem: resposta.data.codigoItem,                    
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
                    // 📁 IDs dos arquivos de mídia
                    ArquivoVideoId: resposta.data.video?.arquivoId || null,
                    ArquivoAudioId: resposta.data.audio?.arquivoId || null,
                };

                // 🎬 OBJETO VIDEO SALVO - apenas se existir no backend
                let videoSalvo: VideoArquivoDto | undefined = undefined;
                if (resposta.data.video?.arquivoId) {
                    videoSalvo = {
                        idFile: resposta.data.video.arquivoId,
                        fileLink: resposta.data.video.caminho || undefined,
                        name: resposta.data.video.nomeArquivo || undefined,
                        status: 'done',
                        uid: `video-${resposta.data.video.arquivoId}`,
                        type: resposta.data.video.contentType || undefined,
                    };
                }

                // 🎵 OBJETO AUDIO SALVO - apenas se existir no backend
                let audioSalvo: AudioArquivoDto | undefined = undefined;
                if (resposta.data.audio?.arquivoId) {
                    audioSalvo = {
                        idFile: resposta.data.audio.arquivoId,
                        fileLink: resposta.data.audio.caminho || undefined,
                        name: resposta.data.audio.nomeArquivo || undefined,
                        status: 'done',
                        uid: `audio-${resposta.data.audio.arquivoId}`,
                        type: resposta.data.audio.contentType || undefined,
                    };
                }

                // 📁 OBJETO COMPLETO DE VIDEO E AUDIO
                let videoAudio: videoAudioProps = {
                    videoSalvo: videoSalvo,
                    audioSalvo: audioSalvo,
                    // videoTemp e audioTemp serão gerenciados no componente quando houver uploads
                    videoTemp: undefined,
                    audioTemp: undefined,
                };

                console.log('🎯 Configuração mapeada:', configuracaoItemRetorno);
                console.log('🎯 Elaboração mapeada com alternativas:', elaboracaoItemRetorno);

                // ✅ Atualiza estados locais com dados completos do backend
                setItemId(itemId);
                setCodigoItemEstado(configuracaoItemRetorno.codigoItem || '');
                setConfiguracaoItemNovoLocal(configuracaoItemRetorno);
                setElaboracaoItemNovoLocal(elaboracaoItemRetorno);
                
                // 📁 Atualiza dados de vídeo e áudio
                setVideoAudioData(videoAudio);
                if (videoSalvo?.fileLink) setVideoCaminho(videoSalvo.fileLink);
                if (audioSalvo?.fileLink) setAudioCaminho(audioSalvo.fileLink);

                // ✅ Salva dados completos no localStorage
                const itemParaLocalStorage = {
                    id: itemId,
                    codigoItem: configuracaoItemRetorno.codigoItem,
                    configuracao: configuracaoItemRetorno,
                    elaboracao: elaboracaoItemRetorno,
                    videoAudio: videoAudio,
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
    }, []);

    // ✅ useEffect INTELIGENTE: Prioriza backend, fallback para localStorage
    useEffect(() => {
        const executarCarregamento = async () => {
            // 🎯 1ª PRIORIDADE: Se tem ID no Redux, busca dados completos do backend
            if (itemId > 0) {
                console.log('🎯 ELABORAÇÃO: ID disponível (estado/local), carregando');
                const dadosBackend = await obterItemComAlternativasEPopular(itemId);

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

                // Restaura estados locais
                setItemId(itemSalvo.id);
                setCodigoItemEstado(itemSalvo.codigoItem);
                if (itemSalvo.configuracao) setConfiguracaoItemNovoLocal(itemSalvo.configuracao);
                if ((itemSalvo as any).elaboracao) setElaboracaoItemNovoLocal((itemSalvo as any).elaboracao);
            } else {
                console.log('📂 Nem backend nem localStorage têm dados válidos');
            }
        };

        executarCarregamento();
    }, []); // 🎯 SEM dependências - executa só quando componente monta



    // 📋 CARREGA DADOS INICIAIS NO FORM (APENAS QUANDO codigoItem MUDA)
    useEffect(() => {
        if (elaboracaoItemNovo?.codigoItem && form) {
            console.log('📋 Carregando dados iniciais no form para:', elaboracaoItemNovo.codigoItem);
            form.setFieldsValue({
                [campoTextoBase]: elaboracaoItemNovo.textoBase || '',
                [campoFonte]: elaboracaoItemNovo.fonte || '',
                [campoEnunciado]: elaboracaoItemNovo.enunciado || '',
                [campoCodigoItem]: elaboracaoItemNovo.codigoItem || '',
                [campoAlternativaA]: elaboracaoItemNovo.alternativaA || '',
                [campoJustificativaA]: elaboracaoItemNovo.justificativaA || '',
                [campoAlternativaB]: elaboracaoItemNovo.alternativaB || '',
                [campoJustificativaB]: elaboracaoItemNovo.justificativaB || '',
                [campoAlternativaC]: elaboracaoItemNovo.alternativaC || '',
                [campoJustificativaC]: elaboracaoItemNovo.justificativaC || '',
                [campoAlternativaD]: elaboracaoItemNovo.alternativaD || '',
                [campoJustificativaD]: elaboracaoItemNovo.justificativaD || '',
                [campoAlternativaCorreta]: elaboracaoItemNovo.alternativaCorreta || 'A',
            });
            
            // 🎬 SINCRONIZA MÍDIA SE NECESSÁRIO (UMA VEZ SÓ)
            if (videoAudioData.videoSalvo || videoAudioData.audioSalvo) {
                console.log('🎬 Sincronizando mídia inicial...');
                setTimeout(() => sincronizarFormComLocalStorage(true), 300);
            }
        }
    }, [elaboracaoItemNovo?.codigoItem]); // SÓ QUANDO codigoItem MUDA

    // 📄 Função para salvar dados atuais do formulário no localStorage
    const salvarDadosFormularioNoLocalStorage = useCallback(() => {
        try {
            const values = form.getFieldsValue(true); // Ensure all fields are retrieved

            // Cria objeto de elaboração com dados atuais do formulário
            const elaboracaoAtual: ElaboracaoLocalProps = {
                textoBase: values[campoTextoBase] || '',
                fonte: values[campoFonte] || '',
                enunciado: values[campoEnunciado] || '',
                codigoItem: values[campoCodigoItem] || '', // Ensure codigoItem is retrieved from the form                
                alternativaA: values[campoAlternativaA] || '',
                justificativaA: values[campoJustificativaA] || '',
                alternativaB: values[campoAlternativaB] || '',
                justificativaB: values[campoJustificativaB] || '',
                alternativaC: values[campoAlternativaC] || '',
                justificativaC: values[campoJustificativaC] || '',
                alternativaD: values[campoAlternativaD] || '',
                justificativaD: values[campoJustificativaD] || '',
                alternativaCorreta: values[campoAlternativaCorreta] || 'A',
                // 🆔 PRESERVA IDs DAS ALTERNATIVAS existentes (para update)
                idAlternativaA: elaboracaoItemNovo?.idAlternativaA || null,
                idAlternativaB: elaboracaoItemNovo?.idAlternativaB || null,
                idAlternativaC: elaboracaoItemNovo?.idAlternativaC || null,
                idAlternativaD: elaboracaoItemNovo?.idAlternativaD || null,
                // 📁 IDs dos arquivos de mídia (response?.data?.idFile do upload)
                ArquivoVideoId: values[campoVideo]?.[0]?.idFile || elaboracaoItemNovo?.ArquivoVideoId || null,
                ArquivoAudioId: values[campoAudio]?.[0]?.idFile || elaboracaoItemNovo?.ArquivoAudioId || null,
            };

            // Atualiza estado local com dados do formulário
            setElaboracaoItemNovoLocal(elaboracaoAtual);

            configuracaoItemNovo.codigoItem = values[campoCodigoItem] || '';
            setConfiguracaoItemNovoLocal(configuracaoItemNovo);

            // 📁 PRESERVA DADOS DE VIDEOAUDIO DO LOCALSTORAGE (não do Form)
            const itemAtualLocalStorage = localStorage.getItem('itemAtual');
            let videoAudioPreservado = videoAudioData;
            
            if (itemAtualLocalStorage) {
                const itemAtual = JSON.parse(itemAtualLocalStorage);
                if (itemAtual.videoAudio) {
                    // Preserva estrutura existente do localStorage
                    videoAudioPreservado = itemAtual.videoAudio;
                    console.log('📁 Preservando videoAudio do localStorage:', {
                        videoSalvo: videoAudioPreservado.videoSalvo?.name || 'N/A',
                        audioSalvo: videoAudioPreservado.audioSalvo?.name || 'N/A',
                        videoTemp: videoAudioPreservado.videoTemp?.name || 'N/A',
                        audioTemp: videoAudioPreservado.audioTemp?.name || 'N/A',
                    });
                }
            }

            // Salva no localStorage dados atuais
            const itemParaLocalStorage = {
                id: itemId,
                codigoItem: values[campoCodigoItem] || '', // Save codigoItem in the localStorage object
                configuracao: configuracaoItemNovo,
                elaboracao: elaboracaoAtual, // Dados atuais do formulário
                videoAudio: videoAudioPreservado // USA dados preservados do localStorage, não do estado React
            };

            localStorage.setItem('itemAtual', JSON.stringify(itemParaLocalStorage));
            console.log('💾 Dados do formulário salvos no localStorage:', {
                elaboracao: itemParaLocalStorage.elaboracao,
                videoAudio: itemParaLocalStorage.videoAudio
            });

        } catch (error) {
            console.error('❌ Erro ao salvar dados do formulário no localStorage:', error);
        }
    }, [form, itemId, configuracaoItemNovo, videoAudioData, elaboracaoItemNovo,
        campoTextoBase, campoFonte, campoEnunciado, campoCodigoItem,
        campoVideo, campoAudio, campoAlternativaA, campoJustificativaA,
        campoAlternativaB, campoJustificativaB, campoAlternativaC, campoJustificativaC,
        campoAlternativaD, campoJustificativaD, campoAlternativaCorreta]);

    // ✅ FUNÇÃO PARA SALVAR COM DEBOUNCE (SEM WATCH)
    const salvarComDebounce = useCallback(() => {
        // Só salva se tem dados essenciais
        if (itemId > 0 && (configuracaoItemNovo?.codigoItem || codigoItemEstado)) {
            console.log('📝 Campo alterado manualmente, salvando no localStorage...');
            salvarDadosFormularioNoLocalStorage();
        }
    }, [itemId, configuracaoItemNovo?.codigoItem, codigoItemEstado, salvarDadosFormularioNoLocalStorage]);

    // Método para gerar o DTO para salvar
    const gerarItemSalvar = useCallback(() => {
        const values = cloneDeep(form.getFieldsValue(true));

        // Monta as alternativas com base nos campos individuais
        const alternativasDto: AltenativaDto[] = [];


        const alternativaA: any = {
            numeracao: 'A',
            descricao: values[campoAlternativaA],
            justificativa: values[campoJustificativaA] || '',
            correta: values[campoAlternativaCorreta] === 'A',
            ordem: 1,
            itemId: itemId,
        };
        // 🆔 ADICIONA ID se existir (para update)
        if (elaboracaoItemNovo?.idAlternativaA) {
            alternativaA.id = elaboracaoItemNovo.idAlternativaA;
        }
        alternativasDto.push(alternativaA);



        const alternativaB: any = {
            numeracao: 'B',
            descricao: values[campoAlternativaB],
            justificativa: values[campoJustificativaB] || '',
            correta: values[campoAlternativaCorreta] === 'B',
            ordem: 2,
            itemId: itemId,
        };
        // 🆔 ADICIONA ID se existir (para update)
        if (elaboracaoItemNovo?.idAlternativaB) {
            alternativaB.id = elaboracaoItemNovo.idAlternativaB;
        }
        alternativasDto.push(alternativaB);



        const alternativaC: any = {
            numeracao: 'C',
            descricao: values[campoAlternativaC],
            justificativa: values[campoJustificativaC] || '',
            correta: values[campoAlternativaCorreta] === 'C',
            ordem: 3,
            itemId: itemId
        };
        // 🆔 ADICIONA ID se existir (para update)
        if (elaboracaoItemNovo?.idAlternativaC) {
            alternativaC.id = elaboracaoItemNovo.idAlternativaC;
        }
        alternativasDto.push(alternativaC);



        const alternativaD: any = {
            numeracao: 'D',
            descricao: values[campoAlternativaD],
            justificativa: values[campoJustificativaD] || '',
            correta: values[campoAlternativaCorreta] === 'D',
            ordem: 4,
            itemId: itemId,
        };
        // 🆔 ADICIONA ID se existir (para update)
        if (elaboracaoItemNovo?.idAlternativaD) {
            alternativaD.id = elaboracaoItemNovo.idAlternativaD;
        }
        alternativasDto.push(alternativaD);


        console.log('🎯 Alternativas montadas para envio:', alternativasDto);

        // 🔍 DEBUG: verificar dados da configuração
        console.log('🔍 CONFIGURAÇÃO ATUAL PARA DTO:', configuracaoItemNovo);
        console.log('🔍 AREA CONHECIMENTO ESPECIFICAMENTE:', {
            valor: configuracaoItemNovo?.areaConhecimento,
            tipo: typeof configuracaoItemNovo?.areaConhecimento,
            undefined: configuracaoItemNovo?.areaConhecimento === undefined
        });

        // Atualiza o codigoItem no DTO com o valor mais recente do estado ou do formulário
        const codigoItemAtualizado = configuracaoItemNovo?.codigoItem || codigoItemEstado || values[campoCodigoItem] || '';
        console.log('🔄 Atualizando codigoItem no DTO:', codigoItemAtualizado);

        const dto: ItemNovoDto = {
            id: itemId,
            codigoItem: codigoItemAtualizado,
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
            // Conversão segura do palavrasChave para elaboração (campo não obrigatório) - BACKEND ESPERA ARRAY
            palavrasChave: (() => {
                let palavrasChaveArray: string[] | null = null;

                if (configuracaoItemNovo?.palavrasChave) {
                    if (Array.isArray(configuracaoItemNovo.palavrasChave)) {
                        // Filtra valores vazios e mantém como array
                        const palavrasValidas = configuracaoItemNovo.palavrasChave.filter((p: string) => p && p.trim());
                        palavrasChaveArray = palavrasValidas.length > 0 ? palavrasValidas : null;
                    } else if (typeof configuracaoItemNovo.palavrasChave === 'string') {
                        const palavraString = (configuracaoItemNovo.palavrasChave as string).trim();
                        if (palavraString) {
                            // Se for string, converte para array (separado por ';' se houver)
                            palavrasChaveArray = palavraString.includes(';')
                                ? palavraString.split(';').filter((p: string) => p && p.trim()).map((p: string) => p.trim())
                                : [palavraString];
                        }
                    }
                }

                console.log('🔧 palavrasChave convertido na elaboração para array:', {
                    original: configuracaoItemNovo?.palavrasChave,
                    convertido: palavrasChaveArray,
                    isArray: Array.isArray(palavrasChaveArray)
                });
                return palavrasChaveArray; // Array de strings ou null
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
    }, [itemId, configuracaoItemNovo, codigoItemEstado, form, campoTextoBase, campoFonte, campoEnunciado,
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

                    // 🔄 MOVE ARQUIVOS TEMPORÁRIOS PARA SALVOS
                    if (videoAudioData.videoTemp || videoAudioData.audioTemp) {
                        const novoVideoAudio = {
                            ...videoAudioData,
                            // Move temporários para salvos
                            videoSalvo: videoAudioData.videoTemp || videoAudioData.videoSalvo,
                            audioSalvo: videoAudioData.audioTemp || videoAudioData.audioSalvo,
                            // Limpa temporários
                            videoTemp: undefined,
                            audioTemp: undefined,
                        };
                        setVideoAudioData(novoVideoAudio);
                        
                        // Atualiza localStorage
                        const itemAtualizado = localStorage.getItem('itemAtual');
                        if (itemAtualizado) {
                            const item = JSON.parse(itemAtualizado);
                            item.videoAudio = novoVideoAudio;
                            localStorage.setItem('itemAtual', JSON.stringify(item));
                        }
                        
                        console.log('🔄 Arquivos movidos de temporário para salvo após salvar rascunho');
                    }

                    // 🔄 USA NOVA FUNÇÃO: Carrega dados completos atualizados do backend
                    try {
                        console.log('🔄 Recarregando dados completos após salvar rascunho...');
                        const dadosAtualizados = await obterItemComAlternativasEPopular(resp.data);

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
                            setElaboracaoItemNovoLocal(elaboracaoAtualizada);
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
                        setElaboracaoItemNovoLocal(elaboracaoAtualizada);
                    }
                })
                .catch((err) => {
                    console.log('❌ Erro ao salvar rascunho:', err.message);
                    mensagem('error', 'Erro', 'Ocorreu um erro ao salvar o rascunho');
                });
        },
        [mensagem, form, itemId, configuracaoItemNovo, campoTextoBase, campoFonte, campoEnunciado, campoCodigoItem,
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
        // Reseta estados locais
        setItemId(0);
        setCodigoItemEstado('');
        setConfiguracaoItemNovoLocal({});
        setElaboracaoItemNovoLocal({});
        // 🧹 Limpa dados de vídeo e áudio
        setVideoAudioData({
            videoSalvo: undefined,
            audioSalvo: undefined,
            videoTemp: undefined,
            audioTemp: undefined,
        });
        setVideoCaminho('');
        setAudioCaminho('');
        form.resetFields();
        setCarregando(false);

        // Navega para a tela de listagem de itens
        navigate('/listagem');
    };

    // Sincroniza o estado local com o valor do campo codigoItem no formulário
    useEffect(() => {
        const codigoItemAtual = form.getFieldValue(campoCodigoItem);
        if (codigoItemAtual !== codigoItemEstado) {
            console.log('🔄 Atualizando estado codigoItemEstado:', codigoItemAtual);
            setCodigoItemEstado(codigoItemAtual);
        }
    }, [form, campoCodigoItem, codigoItemEstado]);

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
                    onValuesChange={(changedValues) => {
                        // 📝 SALVA AUTOMATICAMENTE QUANDO CAMPOS MUDAM (SEM LOOP)
                        if (itemId > 0 && (configuracaoItemNovo?.codigoItem || codigoItemEstado)) {
                            // Debounce para não salvar muito frequentemente
                            if (timeoutRef.current) {
                                clearTimeout(timeoutRef.current);
                            }
                            timeoutRef.current = setTimeout(() => {
                                console.log('📝 Campo alterado via onChange, salvando...', Object.keys(changedValues));
                                salvarComDebounce();
                            }, 1500);
                        }
                    }}
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

                        <FormularioElaboracaoComponent 
                            form={form} 
                            videoCaminho={videoCaminho} 
                            audioCaminho={audioCaminho}
                            videoAudioData={videoAudioData}
                            setVideoAudioData={setVideoAudioData}
                            setVideoCaminho={setVideoCaminho}
                            setAudioCaminho={setAudioCaminho}
                        />

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