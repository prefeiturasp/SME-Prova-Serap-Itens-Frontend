import { Button, Form, FormProps, notification, Spin } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cadastrarItemNovo.css';

import FormularioUnico from '~/components/cadastro-item-novo/formularioUnicoComponent/formularioUnicoComponent';

import { validarCampoForm } from '~/utils/funcoes';

import { Campos } from '~/domain/enums/campos-cadastro-item';
import configuracaoItemService from '~/services/configuracaoItem-service';

import { AltenativaDto } from '~/domain/dto/AltenativaDto';
import { DadosIniciais } from '~/domain/enums/campos-cadastro-item';

import { ItemNovoDto } from '~/domain/dto/itemNovo-dto';
import { SelectValueType } from '~/domain/type/select';
import CadastrarItemHeaderComponent from './cadastrarItemHeaderComponent';
import CadastrarItemRodapeComponent from './cadastrarItemRodapeComponent';
// Tipo local para elaboração
interface ElaboracaoLocalProps {
    textoBase?: string;
    fonte?: string;
    enunciado?: string;
    codigoItem?: string;
    video?: any[];
    audio?: any[];
    alternativaA?: string;
    justificativaA?: string;
    alternativaB?: string;
    justificativaB?: string;
    alternativaC?: string;
    justificativaC?: string;
    alternativaD?: string;
    justificativaD?: string;
    alternativaCorreta?: 'A' | 'B' | 'C' | 'D';
    alternativasDto?: AltenativaDto[];
}

// ✅ Tipo movido do Redux para cá
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

const CadastrarItemNovo: React.FC<FormProps> = () => {

    const navigate = useNavigate();
    const [carregando, setCarregando] = useState<boolean>(false);
    // removido estado de limpeza inicial automática do localStorage
    // Evita recriações do callback e loops por dependência
    const cascataEmAndamentoRef = useRef<boolean>(false);
    // Garante que a cascata automática só rode uma vez no primeiro acesso
    const cascataInicialAplicadaRef = useRef<boolean>(false);

    // ✅ Estados locais
    const [itemId, setItemId] = useState<number>(0);
    const [codigoItem, setCodigoItem] = useState<string>('');
    const [elaboracaoItem, setElaboracaoItem] = useState<ElaboracaoLocalProps>({});

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

    const [bloquearBtnSalvarRascunho, setBloquearBtnSalvarRascunho] =
        useState<boolean>(true);
    const [bloquearBtnAvancar, setBloquearBtnAvancar] = useState<boolean>(true);

    // 💾 Funções para gerenciar localStorage
    const salvarItemNoLocalStorage = useCallback((itemData: { id: number, codigoItem: string, configuracao: any, elaboracao?: any }) => {
        try {
            const itemCompleto = {
                id: itemData.id,
                codigoItem: itemData.codigoItem,
                configuracao: itemData.configuracao,
                elaboracao: itemData.elaboracao || {},
            };
            localStorage.setItem('itemAtual', JSON.stringify(itemCompleto));
            console.log('💾 Item completo salvo no localStorage:', itemCompleto);
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
        }
    }, []);

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
                        console.log('🔧 palavrasChave convertida de string para array:', item.configuracao.palavrasChave);
                    }
                }

                console.log('📂 Item carregado do localStorage:', item);
                // ✅ Seta os estados locais ao carregar
                setItemId(item.id || 0);
                setCodigoItem(item.codigoItem || '');
                if (item.elaboracao) {
                    setElaboracaoItem(item.elaboracao);
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
            localStorage.removeItem('voltandoParaPrimeiraTela'); // 🧹 Remove flag de navegação
            localStorage.removeItem('persist:SERAP-ITEM-PERSIST');
            console.log('🗑️ Todas as chaves do item removidas do localStorage');
            // ✅ Limpa estados locais
            setItemId(0);
            setCodigoItem('');
            setElaboracaoItem({});
        } catch (error) {
            console.error('❌ Erro ao limpar localStorage:', error);
        }
    }, []);

    // ✅ useEffect refatorado para usar valores do formulário
    useEffect(() => {
        const bloquear =
            validarCampoForm(disciplinaIdForm) ||
            validarCampoForm(areaConhecimentoIdForm);

        setBloquearBtnSalvarRascunho(bloquear);
    }, [areaConhecimentoIdForm, disciplinaIdForm]);

    // Removido: limpeza automática do localStorage no primeiro acesso.
    // Motivo: quando vier da listagem (edição), o localStorage já terá dados
    // e não deve ser apagado. A limpeza ocorrerá explicitamente via botão
    // "Novo item" (que chama limparItemDoLocalStorage) ou "Cancelar".

    // 🔄 Função para carregar localStorage com cascata inteligente (igual ao "Voltar")
    const carregarLocalStorageComCascata = useCallback(
        async (itemSalvo: { id: number, codigoItem: string, configuracao: any, elaboracao?: any }) => {
            console.log(' Iniciando carregamento localStorage com cascata inteligente...');
            // 🚫 Evita execuções simultâneas
            if (cascataEmAndamentoRef.current) {
                console.log('🚫 CASCATA: Já em andamento - ignorando chamada duplicada');
                return;
            }

            cascataEmAndamentoRef.current = true;
            setCarregando(true);

            const aguardarFlag = async (flag: string, maxTentativas = 25, atrasoMs = 200) => {
                let tentativas = 0;
                while (
                    tentativas < maxTentativas &&
                    localStorage.getItem(flag) === 'true'
                ) {
                    await new Promise(resolve => setTimeout(resolve, atrasoMs));
                    tentativas++;
                }
                return tentativas;
            };

            try {
                console.log('� Dados localStorage (configuração):', itemSalvo.configuracao);

                // 0) Atualiza estados locais para navegação/botões
                setItemId(itemSalvo.id);
                setCodigoItem(itemSalvo.codigoItem);
                if (itemSalvo.elaboracao) setElaboracaoItem(itemSalvo.elaboracao);

                // Sequência correta de dependências:
                // áreaConhecimento → disciplinas → matriz → anoMatriz → competências → habilidades
                // e em paralelo à disciplina: assuntos → subAssuntos

                // 1) Área do Conhecimento (carrega options e seta valor)
                if (itemSalvo.configuracao.areaConhecimento) {
                    console.log('📝 Definindo área do conhecimento...');
                    // Aguarda caso a tela esteja carregando a lista de áreas
                    await aguardarFlag('aguardandoAreaConhecimento');
                    // Predefine flags que serão disparadas pelos effects após setar a área
                    localStorage.setItem('aguardandoDisciplinas', 'true');
                    localStorage.setItem('aguardandoAssuntos', 'true');
                    form?.setFieldValue(Campos.areaConhecimento, itemSalvo.configuracao.areaConhecimento);

                    // Ao definir área, a tela carrega disciplinas e assuntos
                    console.log('⏳ Aguardando disciplinas e assuntos após selecionar área...');
                    await aguardarFlag('aguardandoDisciplinas');
                    await aguardarFlag('aguardandoAssuntos');
                }

                // 2) Disciplina (depende da área)
                if (itemSalvo.configuracao.disciplina) {
                    console.log('📝 Definindo disciplina...');
                    // Predefine flags de carregamento a serem limpas pelos effects do formulário
                    localStorage.setItem('aguardandoMatriz', 'true');
                    localStorage.setItem('aguardandoAssuntos', 'true');
                    form?.setFieldValue(Campos.disciplinas, itemSalvo.configuracao.disciplina);

                    // Ao definir disciplina, a tela carrega matriz e (novamente) assuntos
                    console.log('⏳ Aguardando matriz e assuntos após selecionar disciplina...');
                    await aguardarFlag('aguardandoMatriz');
                    await aguardarFlag('aguardandoAssuntos');
                }

                // 3) Matriz (depende da disciplina)
                if (itemSalvo.configuracao.matriz) {
                    console.log('📝 Definindo matriz...');
                    // Predefine flags para ano e competências
                    localStorage.setItem('aguardandoAnoMatriz', 'true');
                    localStorage.setItem('aguardandoCompetencias', 'true');
                    form?.setFieldValue(Campos.matriz, itemSalvo.configuracao.matriz);

                    // Ao definir matriz, a tela carrega anoMatriz e competências
                    console.log('⏳ Aguardando ano da matriz e competências...');
                    await aguardarFlag('aguardandoAnoMatriz');
                    await aguardarFlag('aguardandoCompetencias');
                }

                // 4) Ano da Matriz (depende da matriz)
                if (itemSalvo.configuracao.anoMatriz) {
                    console.log('📝 Definindo ano da matriz...');
                    form?.setFieldValue(Campos.anoMatriz, itemSalvo.configuracao.anoMatriz);
                }

                // 5) Competência (depende da matriz)
                if (itemSalvo.configuracao.competencia) {
                    console.log('📝 Definindo competência...');
                    // Predefine flag para habilidades
                    localStorage.setItem('aguardandoHabilidade', 'true');
                    form?.setFieldValue(Campos.competencia, itemSalvo.configuracao.competencia);

                    // Ao definir competência, a tela carrega habilidades
                    console.log('⏳ Aguardando habilidades...');
                    await aguardarFlag('aguardandoHabilidade');
                }

                // 6) Habilidade (depende da competência)
                if (itemSalvo.configuracao.habilidade) {
                    console.log('📝 Definindo habilidade...');
                    form?.setFieldValue(Campos.habilidade, itemSalvo.configuracao.habilidade);
                }

                // 7) Assunto (depende da disciplina)
                if (itemSalvo.configuracao.assunto) {
                    console.log('📝 Definindo assunto...');
                    // Predefine flag para subassuntos
                    localStorage.setItem('aguardandoSubAssuntos', 'true');
                    form?.setFieldValue(Campos.assunto, itemSalvo.configuracao.assunto);

                    // Ao definir assunto, a tela carrega subassuntos
                    console.log('⏳ Aguardando subassuntos...');
                    await aguardarFlag('aguardandoSubAssuntos');
                }

                // 8) SubAssunto (depende do assunto)
                if (itemSalvo.configuracao.subAssunto) {
                    console.log('📝 Definindo subAssunto...');
                    form?.setFieldValue(Campos.subAssunto, itemSalvo.configuracao.subAssunto);
                }

                // Demais campos simples (não quebrar a cascata principal)
                console.log('📝 Populando campos restantes não-cascata...');
                const mapeamentoCampos = {
                    codigoItem: Campos.codigoItem,
                    situacaoItem: Campos.situacaoItem,
                    tipoItem: Campos.tipoItem,
                    quantidadeAlternativas: Campos.quantidadeAlternativas,
                    dificuldadeSugerida: Campos.dificuldadeSugerida,
                    nivelItem: Campos.nivelItem,
                    discriminacao: Campos.discriminacao,        // infoEstatisticasDiscriminacao
                    dificuldade: Campos.dificuldade,            // infoEstatisticasDificuldade
                    acertoCasual: Campos.acertoCasual,          // infoEstatisticasAcertoCasual
                    palavrasChave: Campos.palavraChave,
                    parametroBTransformado: Campos.parametroBTransformado,
                    mediaDesvioPadrao: Campos.mediaDesvioPadrao,
                    sentencaDescritora: Campos.sentencaDescritora,
                    observacao: Campos.observacao,
                } as const;

                const camposJaDefinidos = new Set([
                    'areaConhecimento',
                    'disciplina',
                    'matriz',
                    'anoMatriz',
                    'competencia',
                    'habilidade',
                    'assunto',
                    'subAssunto',
                ]);

                Object.keys(itemSalvo.configuracao).forEach(key => {
                    if (camposJaDefinidos.has(key)) return;
                    const value = itemSalvo.configuracao[key];
                    const formFieldName = (mapeamentoCampos as any)[key];
                    if (value !== undefined && value !== null && formFieldName) {
                        form?.setFieldValue(formFieldName, value);
                        console.log(`📝 Campo ${formFieldName} (${key}) restaurado:`, value);
                    }
                });

                // Pequeno atraso para garantir processamento dos setFieldValue
                await new Promise(resolve => setTimeout(resolve, 100));

                console.log('✅ Carregamento localStorage com cascata finalizado');

            } catch (err: any) {
                console.error('❌ Erro no carregamento localStorage com cascata:', err.message);
            } finally {
                cascataEmAndamentoRef.current = false;
                setCarregando(false);
            }
        },
        [form]
    );

    // ✅ useEffect UNIFICADO: Detecta localStorage e "Voltar" em um só lugar
    useEffect(() => {
        const voltandoParaPrimeiraTela = localStorage.getItem('voltandoParaPrimeiraTela') === 'true';
        const itemSalvo = carregarItemDoLocalStorage();

        // 🔙 Cenário 1: Voltando da elaboração
        if (voltandoParaPrimeiraTela) {
            console.log('🔙 Detectado "Voltar" - usando dados do localStorage...');
            localStorage.removeItem('voltandoParaPrimeiraTela');
            // Permite aplicar cascata novamente ao voltar
            cascataInicialAplicadaRef.current = false;

            if (itemSalvo && itemSalvo.id > 0 && itemSalvo.codigoItem) {
                console.log('✅ Dados encontrados no localStorage - carregando com cascata...');
                carregarLocalStorageComCascata(itemSalvo);
            } else {
                console.log('⚠️ Dados inconsistentes no localStorage - mantendo estado atual');
            }
        }
        // 📂 Cenário 2: Primeiro acesso com dados no localStorage
        else if (!cascataInicialAplicadaRef.current && itemSalvo && itemSalvo.id > 0 && itemSalvo.codigoItem && itemSalvo.codigoItem.trim() !== '') {
            console.log('📂 Primeiro acesso: Detectado dados válidos no localStorage - carregando com cascata...');
            console.log('📋 Dados encontrados:', { id: itemSalvo.id, codigoItem: itemSalvo.codigoItem });
            carregarLocalStorageComCascata(itemSalvo);
            cascataInicialAplicadaRef.current = true;
        } else {
            console.log('📂 localStorage vazio - formulário ficará limpo para novo cadastro');
        }
    }, [itemId, carregarItemDoLocalStorage, carregarLocalStorageComCascata]); // Executa quando itemId muda ou componente monta

    // ✅ useEffect para controlar bloqueio do botão avançar
    useEffect(() => {
        const temIdECodigo = itemId > 0 && codigoItem && codigoItem.trim() !== '';

        console.log('🔍 Verificando condições para habilitar botão Avançar:', {
            itemId: itemId,
            codigoItem: codigoItem,
            podeAvancar: temIdECodigo
        });

        setBloquearBtnAvancar(!temIdECodigo);
    }, [itemId, codigoItem]);


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

        // Limpa localStorage e estados locais
        limparItemDoLocalStorage();

        form.resetFields();
        setCarregando(false);

        // Navega para a tela de listagem de itens
        navigate('/listagem');
    };

    const avancar = () => {
        // Validação adicional antes de navegar
        if (!itemId || itemId === 0) {
            mensagem('error', 'Erro', 'É necessário salvar o item antes de avançar');
            return;
        }
        if (!codigoItem || codigoItem.trim() === '') {
            mensagem('error', 'Erro', 'É necessário que o item tenha um código antes de avançar');
            return;
        }
        console.log('✅ Navegando para elaboração com:', {
            id: itemId,
            codigoItem: codigoItem
        });
        navigate('/elaboracao');
    };

    const gerarItemSalvar = useCallback(() => {
        const values = form.getFieldsValue(true);

        // Pega o estado mais recente do localStorage para garantir que a elaboração não seja perdida
        let elaboracaoLS: any = elaboracaoItem;
        try {
            const raw = localStorage.getItem('itemAtual');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed?.elaboracao) {
                    elaboracaoLS = parsed.elaboracao;
                }
            }
        } catch (_) {
            // ignora erro de parse
        }

        // Conversão segura do palavrasChave (campo não obrigatório) - BACKEND ESPERA ARRAY
        let palavrasChaveArray: string[] | null = null;
        if (values?.palavraChave) {
            if (Array.isArray(values.palavraChave)) {
                const palavrasValidas = values.palavraChave.filter((p: string) => p && p.trim());
                palavrasChaveArray = palavrasValidas.length > 0 ? palavrasValidas : null;
            } else if (typeof values.palavraChave === 'string' && values.palavraChave.trim()) {
                palavrasChaveArray = values.palavraChave.includes(';')
                    ? values.palavraChave.split(';').filter((p: string) => p && p.trim()).map((p: string) => p.trim())
                    : [values.palavraChave.trim()];
            }
        }

        // Constrói alternativas a partir da elaboração salva (se não houver alternativasDto no form)
        const construirAlternativasDeElaboracao = (): AltenativaDto[] | undefined => {
            if (!elaboracaoLS) return undefined;
            const alt: AltenativaDto[] = [] as any;
            const correta = elaboracaoLS?.alternativaCorreta;
            const push = (
                letra: 'A'|'B'|'C'|'D',
                descricao?: string,
                justificativa?: string,
                idAlt?: number | null,
                ordem?: number
            ) => {
                if (!descricao) return;
                const obj: any = {
                    numeracao: letra,
                    descricao,
                    justificativa: justificativa || '',
                    correta: letra === correta,
                    ordem: ordem || 1,
                    itemId: itemId,
                };
                if (idAlt) obj.id = idAlt;
                alt.push(obj);
            };
            push('A', elaboracaoLS?.alternativaA, elaboracaoLS?.justificativaA, elaboracaoLS?.idAlternativaA, 1);
            push('B', elaboracaoLS?.alternativaB, elaboracaoLS?.justificativaB, elaboracaoLS?.idAlternativaB, 2);
            push('C', elaboracaoLS?.alternativaC, elaboracaoLS?.justificativaC, elaboracaoLS?.idAlternativaC, 3);
            push('D', elaboracaoLS?.alternativaD, elaboracaoLS?.justificativaD, elaboracaoLS?.idAlternativaD, 4);
            return alt.length ? alt : undefined;
        };

        const dto: ItemNovoDto = {
            id: itemId,
            codigoItem: codigoItem || '',
            areaConhecimentoId: values?.AreaConhecimento || null,
            disciplinaId: values?.disciplinas || null,
            matrizId: values?.matriz || null,
            competenciaId: values?.competencia || null,
            habilidadeId: values?.habilidade || null,
            anoMatrizId: values?.anoMatriz || null,
            assuntoId: values?.assunto || null,
            subAssuntoId: values?.subAssunto || null,
            situacao: values?.situacaoItem || null,
            tipo: values?.tipoItem ? Number(values.tipoItem) : 1,
            quantidadeAlternativasId: values?.quantidadeAlternativas || null,
            dificuldadeSugeridaId: values?.dificuldadeSugerida || null,
            discriminacao: values?.infoEstatisticasDiscriminacao ? +values?.infoEstatisticasDiscriminacao : null,
            dificuldade: values?.infoEstatisticasDificuldade ? +values?.infoEstatisticasDificuldade : null,
            nivelItem: values?.nivelItem || null,
            acertoCasual: values?.infoEstatisticasAcertoCasual ? +values?.infoEstatisticasAcertoCasual : null,
            palavrasChave: palavrasChaveArray,
            parametroBTransformado: values?.parametroBTransformado ? +values?.parametroBTransformado : null,
            mediaEhDesvio: values?.mediaDesvioPadrao || null,
            sentencaDescritora: values?.sentencaDescritora || null,
            observacao: values?.observacao || null,
            // Elaboração sempre a partir do localStorage/estado de elaboração, para não perder dados
            textoBase: elaboracaoLS?.textoBase || '',
            fonte: elaboracaoLS?.fonte || '',
            enunciado: elaboracaoLS?.enunciado || '',
            alternativasDto: undefined,
        } as ItemNovoDto;

        // Preferência: se vier alternativasDto via form (raríssimo na primeira tela), usa e marca correta
        if (values?.alternativasDto?.length) {
            dto.alternativasDto = values.alternativasDto.map((item: AltenativaDto) => {
                const ehAlternativaCorreta = item.numeracao === values.alternativaCorreta;
                item.correta = ehAlternativaCorreta;
                return item;
            });
        } else {
            // Caso contrário, constrói a partir da elaboração salva
            const alt = construirAlternativasDeElaboracao();
            if (alt) dto.alternativasDto = alt;
        }

        // Arquivos de mídia a partir da elaboração salva
        if (elaboracaoLS?.video?.length) {
            dto.arquivoVideoId = elaboracaoLS.video?.[0]?.idFile;
        }
        if (elaboracaoLS?.audio?.length) {
            dto.arquivoAudioId = elaboracaoLS.audio?.[0]?.idFile;
        }

        // 🔍 Log final do DTO antes de enviar
        console.log('🚀 DTO Final sendo enviado:', dto);

        // 🧪 Teste de serialização para detectar referências circulares
        try {
            const testeSerializacao = JSON.stringify(dto);
            console.log('✅ DTO serializa corretamente - tamanho:', testeSerializacao.length);
        } catch (error) {
            console.error('❌ ERRO na serialização do DTO:', error);
            console.log('🔍 Analisando cada propriedade do DTO:');
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
    }, [itemId, codigoItem, form, elaboracaoItem]);

    const obterDadosItem = useCallback(
        async (id: number) => {
            //setCarregando(true);

            try {
                const resp = await configuracaoItemService.obterItem(id);

                if (resp?.data) {
                    console.log('📋 Dados recebidos do backend para item ID----->>>>>>>>', id, ':', resp.data);

                    // ✅ 1. Mapear dados da API para o formato local
                    const configuracaoItemRetorno: ConfiguracaoItemNovoProps = {
                        codigoItem: resp.data.codigoItem,
                        areaConhecimento: resp.data.areaconhecimentoId,
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
                        palavrasChave: resp.data.palavrasChave
                            ? resp.data.palavrasChave.split(';').filter((p: string) => p && p.trim())
                            : [],
                        parametroBTransformado: resp.data.parametroBTransformado,
                        mediaDesvioPadrao: resp.data.mediaEhDesvio,
                        sentencaDescritora: resp.data.sentencaDescritora,
                        observacao: resp.data.observacao,
                    };

                    // ✅ 2. Atualizar estados locais (para navegação entre telas)
                    setItemId(id);
                    setCodigoItem(configuracaoItemRetorno.codigoItem || '');

                    // ✅ 3. Salvar no localStorage para persistir dados
                    salvarItemNoLocalStorage({
                        id: id,
                        codigoItem: configuracaoItemRetorno.codigoItem,
                        configuracao: configuracaoItemRetorno
                    });

                    // ✅ 4. Popular o formulário respeitando a CASCATA automática
                   
                    console.log('✅ Item carregado com sucesso:', {
                        id,
                        configuracao: configuracaoItemRetorno
                    });
                }
            } catch (err: any) {
                console.error('❌ Erro ao carregar item:', err.message);
                mensagem('error', 'Erro', 'Erro ao carregar dados do item');
            } finally {
                //setCarregando(false);
            }

        },
        [form, mensagem, elaboracaoItem, carregarLocalStorageComCascata],
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

        // 🔍 Verifica se é edição (tem id e codigoItem no estado/localStorage)
        const ehEdicao = itemId > 0 && codigoItem && codigoItem.trim() !== '';

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
    }, [mensagem, itemId, codigoItem]);

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
        [mensagem, inserirItem, inserirRascunhoItem, gerarItemSalvar],
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

export default CadastrarItemNovo;

