import { Button, Form, FormProps, notification, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
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

    // 🔄 Função para carregar apenas estados locais do localStorage
    const carregarEstadosDoLocalStorage = useCallback(() => {
        try {
            const itemSalvoStr = localStorage.getItem('itemAtual');
            if (!itemSalvoStr) return;

            const itemSalvo = JSON.parse(itemSalvoStr);
            console.log('📋 Carregando estados locais do localStorage:', {
                id: itemSalvo.id,
                codigoItem: itemSalvo.codigoItem
            });

            // Atualiza apenas estados locais para navegação/botões
            if (itemSalvo.id) setItemId(itemSalvo.id);
            if (itemSalvo.codigoItem) setCodigoItem(itemSalvo.codigoItem);
            if (itemSalvo.elaboracao) setElaboracaoItem(itemSalvo.elaboracao);

        } catch (error) {
            console.error('❌ Erro ao carregar estados do localStorage:', error);
        }
    }, []);

    // ✅ useEffect para carregar estados locais na montagem
    useEffect(() => {
        carregarEstadosDoLocalStorage();
    }, [carregarEstadosDoLocalStorage]);

    // ✅ useEffect refatorado para usar valores do formulário
    useEffect(() => {
        const bloquear =
            validarCampoForm(disciplinaIdForm) ||
            validarCampoForm(areaConhecimentoIdForm);

        setBloquearBtnSalvarRascunho(bloquear);
    }, [areaConhecimentoIdForm, disciplinaIdForm]);


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
            try {
                const resp = await configuracaoItemService.obterItem(id);

                if (resp?.data) {
                    console.log('📋 Dados recebidos do backend para item ID:', id, ':', resp.data);

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

                    setItemId(id);
                    setCodigoItem(configuracaoItemRetorno.codigoItem || '');

                    const itemAtual = localStorage.getItem('itemAtual');
                    let elaboracaoExistente = {};

                    if (itemAtual) {
                        const itemAtualizado = JSON.parse(itemAtual);
                        elaboracaoExistente = itemAtualizado.elaboracao || {};
                        itemAtualizado.codigoItem = resp.data.codigoItem;
                        itemAtualizado.configuracao = configuracaoItemRetorno;
                        localStorage.setItem('itemAtual', JSON.stringify(itemAtualizado));
                        console.log('💾 Código do item atualizado no localStorage:', resp.data.codigoItem);
                    }

                    salvarItemNoLocalStorage({
                        id: id,
                        codigoItem: configuracaoItemRetorno.codigoItem,
                        configuracao: configuracaoItemRetorno,
                        elaboracao: elaboracaoExistente,
                    });
                }
            } catch (err: any) {
                console.error('❌ Erro ao carregar dados do item:', err.message);
                mensagem('error', 'Erro', 'Erro ao carregar dados do item');
            }
        },
        [form, mensagem, salvarItemNoLocalStorage]
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

            setCarregando(false);
        },
        [mensagem, inserirItem, inserirRascunhoItem, gerarItemSalvar, validarCamposObrigatorios],
    );

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

                        <FormularioUnico 
                            form={form} 
                            setCarregando={setCarregando}
                        />

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

