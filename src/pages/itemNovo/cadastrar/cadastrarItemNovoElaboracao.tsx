import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, FormProps, notification, Spin } from 'antd';
import { useNavigate } from 'react-router';
import { cloneDeep } from 'lodash';
import './cadastrarItemNovoElaboracao.css';
import CadastrarItemHeaderComponent from './cadastrarItemHeaderComponent';
import CadastrarItemRodapeComponent from './cadastrarItemRodapeComponent';
import FormularioElaboracaoComponent from '~/components/cadastro-item-novo/formularioElaboracaoComponent/formularioElaboracaoComponent';
import { ItemNovoDto } from '~/domain/dto/itemNovo-dto';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';
import { VideoArquivoDto, AudioArquivoDto } from '~/domain/dto/ArquivoMidiaDto';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { limparStorageFluxoCadastro, STORAGE_KEYS } from '~/utils/fluxo-item-storage';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { SelectValueType } from '~/domain/type/select';
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
  versaoItem?: number;
  itemCodeVersion?: number;
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
  const initialValuesForm = {};
  const [carregando, setCarregando] = useState(false);
  const [verificacaoInicialFeita, setVerificacaoInicialFeita] = useState(false);
  const [sincronizandoForm, setSincronizandoForm] = useState(false);
  const [ultimaSincronizacao, setUltimaSincronizacao] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [itemId, setItemId] = useState<number>(0);
  const [codigoItemEstado, setCodigoItemEstado] = useState<string>('');
  const [editandoItem, setEditandoItem] = useState<boolean>(false);
  const [configuracaoItemNovo, setConfiguracaoItemNovoLocal] = useState<
    Partial<ConfiguracaoItemNovoProps>
  >({});
  const [elaboracaoItemNovo, setElaboracaoItemNovoLocal] = useState<ElaboracaoLocalProps>({});

  const [videoCaminho, setVideoCaminho] = useState<string>('');
  const [audioCaminho, setAudioCaminho] = useState<string>('');
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
  const carregarItemDoLocalStorage = useCallback((): {
    id: number;
    codigoItem: string;
    configuracao: any;
    elaboracao?: any;
  } | null => {
    try {
      const itemSalvo = localStorage.getItem('itemAtual');
      if (itemSalvo) {
        const item = JSON.parse(itemSalvo);
        if (item.videoAudio) {
          setVideoAudioData(item.videoAudio);
          const videoPath =
            item.videoAudio.videoTemp?.fileLink || item.videoAudio.videoSalvo?.fileLink || '';
          const audioPath =
            item.videoAudio.audioTemp?.fileLink || item.videoAudio.audioSalvo?.fileLink || '';

          setVideoCaminho(videoPath);
          setAudioCaminho(audioPath);
        }
        if (item.configuracao && item.configuracao.palavrasChave) {
          if (typeof item.configuracao.palavrasChave === 'string') {
            item.configuracao.palavrasChave = item.configuracao.palavrasChave
              .split(';')
              .filter((p: string) => p && p.trim());
          }
        }
        setItemId(item.id || 0);
        setCodigoItemEstado(item.codigoItem || '');
        if (item.configuracao) setConfiguracaoItemNovoLocal(item.configuracao);
        if (item.elaboracao) setElaboracaoItemNovoLocal(item.elaboracao);
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
      limparStorageFluxoCadastro();
    } catch {
      limparStorageFluxoCadastro();
    }
  }, []);

  const voltar = async () => {
    if (itemId && itemId > 0) {
      try {
        setCarregando(true);
        localStorage.setItem(STORAGE_KEYS.voltandoParaPrimeiraTela, 'true');
        const dadosCompletos = await obterItemComAlternativasEPopular(itemId);

        if (dadosCompletos) {
        } else {
        }
      } catch (error) {
        console.error('❌ Erro ao recarregar dados:', error);
        mensagem('error', 'Erro', 'Erro ao recarregar dados do item');
      } finally {
      }
    } else {
    }
    setTimeout(() => {
      setCarregando(false);
      navigate('/criacao');
    }, 500);
  };
  useEffect(() => {
    if (!verificacaoInicialFeita) {
      const temDadosObrigatorios =
        itemId > 0 &&
        (configuracaoItemNovo?.codigoItem || codigoItemEstado) &&
        (configuracaoItemNovo?.codigoItem || codigoItemEstado)?.toString().trim() !== '';
      const localStorageItem = carregarItemDoLocalStorage();
      const temLocalStorageValido =
        localStorageItem &&
        localStorageItem.id > 0 &&
        localStorageItem.codigoItem &&
        localStorageItem.codigoItem.trim() !== '';

      if (!temDadosObrigatorios && !temLocalStorageValido) {
        setTimeout(() => {
          navigate('/item-novo');
        }, 100);
        return;
      }

      setVerificacaoInicialFeita(true);
    }
  }, [
    verificacaoInicialFeita,
    itemId,
    codigoItemEstado,
    configuracaoItemNovo,
    carregarItemDoLocalStorage,
    navigate,
    setVerificacaoInicialFeita,
  ]);
  useEffect(() => {
    let parametrosObrigatorios = {
      id: itemId,
      codigoItem: configuracaoItemNovo?.codigoItem || codigoItemEstado,
      areaConhecimentoId: configuracaoItemNovo?.areaConhecimento,
      disciplinaId: configuracaoItemNovo?.disciplina,
    };
    if (
      !parametrosObrigatorios.id ||
      parametrosObrigatorios.id === 0 ||
      !parametrosObrigatorios.codigoItem ||
      parametrosObrigatorios.codigoItem.trim() === ''
    ) {
      const itemSalvo = carregarItemDoLocalStorage();
      if (
        itemSalvo &&
        itemSalvo.id > 0 &&
        itemSalvo.codigoItem &&
        itemSalvo.codigoItem.trim() !== ''
      ) {
        setItemId(itemSalvo.id);
        setCodigoItemEstado(itemSalvo.codigoItem);
        setConfiguracaoItemNovoLocal(itemSalvo.configuracao || {});
        parametrosObrigatorios = {
          id: itemSalvo.id,
          codigoItem: itemSalvo.codigoItem,
          areaConhecimentoId: itemSalvo.configuracao?.areaConhecimento,
          disciplinaId: itemSalvo.configuracao?.disciplina,
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
      mensagem(
        'error',
        'Erro',
        `Parâmetros obrigatórios faltando: ${parametrosFaltando.join(
          ', ',
        )}. Redirecionando para a tela anterior.`,
      );

      setTimeout(() => {
        navigate('/item-novo');
      }, 3000);
      return;
    }
  }, [
    itemId,
    configuracaoItemNovo,
    mensagem,
    navigate,
    elaboracaoItemNovo,
    carregarItemDoLocalStorage,
  ]);
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
  const sincronizarFormComLocalStorage = useCallback(
    (forcarSincronizacao = false) => {
      try {
        if (sincronizandoForm && !forcarSincronizacao) {
          return;
        }

        const itemSalvo = localStorage.getItem('itemAtual');
        if (itemSalvo) {
          const item = JSON.parse(itemSalvo);
          const hashAtual = JSON.stringify(item.videoAudio || {});
          if (hashAtual === ultimaSincronizacao && !forcarSincronizacao) {
            return;
          }

          setSincronizandoForm(true);
          if (item.videoAudio) {
            const videoAtual = item.videoAudio.videoTemp || item.videoAudio.videoSalvo;
            const audioAtual = item.videoAudio.audioTemp || item.videoAudio.audioSalvo;
            const formVideo = form.getFieldValue(campoVideo);
            const formAudio = form.getFieldValue(campoAudio);

            if (videoAtual && (!formVideo || formVideo[0]?.uid !== videoAtual.uid)) {
              form.setFieldValue(campoVideo, [videoAtual]);
            } else if (!videoAtual && formVideo?.length > 0) {
              form.setFieldValue(campoVideo, []);
            }

            if (audioAtual && (!formAudio || formAudio[0]?.uid !== audioAtual.uid)) {
              form.setFieldValue(campoAudio, [audioAtual]);
            } else if (!audioAtual && formAudio?.length > 0) {
              form.setFieldValue(campoAudio, []);
            }
          }

          setUltimaSincronizacao(hashAtual);
          setTimeout(() => {
            setSincronizandoForm(false);
          }, 100);
        }
      } catch (error) {
        console.error('❌ Erro ao sincronizar Form com localStorage:', error);
        setSincronizandoForm(false);
      }
    },
    [form, campoVideo, campoAudio, sincronizandoForm, ultimaSincronizacao],
  );
  const obterItemComAlternativasEPopular = useCallback(async (itemId: number) => {
    try {
      const resposta = await configuracaoItemService.obterItemComAlternativas(itemId);

      if (resposta?.data) {
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
          versaoItem: resposta.data.versaoItem ?? 0,
          itemCodeVersion: resposta.data.itemCodeVersion ?? 0,
        };
        let elaboracaoItemRetorno: ElaboracaoLocalProps = {
          textoBase: resposta.data.textoBase || '',
          fonte: resposta.data.fonte || '',
          enunciado: resposta.data.enunciado || '',
          codigoItem: resposta.data.codigoItem,
          alternativaA:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'A')?.descricao || '',
          justificativaA:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'A')?.justificativa || '',
          alternativaB:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'B')?.descricao || '',
          justificativaB:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'B')?.justificativa || '',
          alternativaC:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'C')?.descricao || '',
          justificativaC:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'C')?.justificativa || '',
          alternativaD:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'D')?.descricao || '',
          justificativaD:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'D')?.justificativa || '',
          alternativaCorreta:
            resposta.data.alternativas?.find((a: any) => a.correta)?.numeracao || 'A',
          idAlternativaA:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'A')?.id || null,
          idAlternativaB:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'B')?.id || null,
          idAlternativaC:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'C')?.id || null,
          idAlternativaD:
            resposta.data.alternativas?.find((a: any) => a.numeracao === 'D')?.id || null,
          ArquivoVideoId: resposta.data.video?.arquivoId || null,
          ArquivoAudioId: resposta.data.audio?.arquivoId || null,
        };
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
        let videoAudio: videoAudioProps = {
          videoSalvo: videoSalvo,
          audioSalvo: audioSalvo,
          videoTemp: undefined,
          audioTemp: undefined,
        };
        setItemId(itemId);
        setCodigoItemEstado(configuracaoItemRetorno.codigoItem || '');
        setConfiguracaoItemNovoLocal(configuracaoItemRetorno);
        setElaboracaoItemNovoLocal(elaboracaoItemRetorno);
        setVideoAudioData(videoAudio);
        if (videoSalvo?.fileLink) setVideoCaminho(videoSalvo.fileLink);
        if (audioSalvo?.fileLink) setAudioCaminho(audioSalvo.fileLink);
        const itemParaLocalStorage = {
          id: itemId,
          codigoItem: configuracaoItemRetorno.codigoItem,
          configuracao: configuracaoItemRetorno,
          elaboracao: elaboracaoItemRetorno,
          videoAudio: videoAudio,
        };
        localStorage.setItem('itemAtual', JSON.stringify(itemParaLocalStorage));
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
  useEffect(() => {
    const executarCarregamento = async () => {
      setEditandoItem(localStorage.getItem(STORAGE_KEYS.editandoItem) === 'true');

      if (itemId > 0) {
        const dadosBackend = await obterItemComAlternativasEPopular(itemId);

        if (dadosBackend) {
          return; // ✅ Sucesso, não precisa fazer mais nada
        }
      }
      const itemSalvo = carregarItemDoLocalStorage();

      if (
        itemSalvo &&
        itemSalvo.id > 0 &&
        itemSalvo.codigoItem &&
        itemSalvo.codigoItem.trim() !== ''
      ) {
        setItemId(itemSalvo.id);
        setCodigoItemEstado(itemSalvo.codigoItem);
        if (itemSalvo.configuracao) setConfiguracaoItemNovoLocal(itemSalvo.configuracao);
        if ((itemSalvo as any).elaboracao)
          setElaboracaoItemNovoLocal((itemSalvo as any).elaboracao);
      } else {
      }
    };

    executarCarregamento();
  }, []); // 🎯 SEM dependências - executa só quando componente monta
  useEffect(() => {
    if (elaboracaoItemNovo?.codigoItem && form) {
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
      if (videoAudioData.videoSalvo || videoAudioData.audioSalvo) {
        setTimeout(() => sincronizarFormComLocalStorage(true), 300);
      }
    }
  }, [elaboracaoItemNovo?.codigoItem]); // SÓ QUANDO codigoItem MUDA
  const salvarDadosFormularioNoLocalStorage = useCallback(() => {
    try {
      const values = form.getFieldsValue(true); // Ensure all fields are retrieved
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
        idAlternativaA: elaboracaoItemNovo?.idAlternativaA || null,
        idAlternativaB: elaboracaoItemNovo?.idAlternativaB || null,
        idAlternativaC: elaboracaoItemNovo?.idAlternativaC || null,
        idAlternativaD: elaboracaoItemNovo?.idAlternativaD || null,
        ArquivoVideoId:
          values[campoVideo]?.[0]?.idFile || elaboracaoItemNovo?.ArquivoVideoId || null,
        ArquivoAudioId:
          values[campoAudio]?.[0]?.idFile || elaboracaoItemNovo?.ArquivoAudioId || null,
      };
      setElaboracaoItemNovoLocal(elaboracaoAtual);

      configuracaoItemNovo.codigoItem = values[campoCodigoItem] || '';
      setConfiguracaoItemNovoLocal(configuracaoItemNovo);
      const itemAtualLocalStorage = localStorage.getItem('itemAtual');
      let videoAudioPreservado = videoAudioData;

      if (itemAtualLocalStorage) {
        const itemAtual = JSON.parse(itemAtualLocalStorage);
        if (itemAtual.videoAudio) {
          videoAudioPreservado = itemAtual.videoAudio;
        }
      }
      const itemParaLocalStorage = {
        id: itemId,
        codigoItem: values[campoCodigoItem] || '', // Save codigoItem in the localStorage object
        configuracao: configuracaoItemNovo,
        elaboracao: elaboracaoAtual, // Dados atuais do formulário
        videoAudio: videoAudioPreservado, // USA dados preservados do localStorage, não do estado React
      };

      localStorage.setItem('itemAtual', JSON.stringify(itemParaLocalStorage));
    } catch (error) {
      console.error('❌ Erro ao salvar dados do formulário no localStorage:', error);
    }
  }, [
    form,
    itemId,
    configuracaoItemNovo,
    videoAudioData,
    elaboracaoItemNovo,
    campoTextoBase,
    campoFonte,
    campoEnunciado,
    campoCodigoItem,
    campoVideo,
    campoAudio,
    campoAlternativaA,
    campoJustificativaA,
    campoAlternativaB,
    campoJustificativaB,
    campoAlternativaC,
    campoJustificativaC,
    campoAlternativaD,
    campoJustificativaD,
    campoAlternativaCorreta,
  ]);
  const salvarComDebounce = useCallback(() => {
    if (itemId > 0 && (configuracaoItemNovo?.codigoItem || codigoItemEstado)) {
      salvarDadosFormularioNoLocalStorage();
    }
  }, [
    itemId,
    configuracaoItemNovo?.codigoItem,
    codigoItemEstado,
    salvarDadosFormularioNoLocalStorage,
  ]);
  const gerarItemSalvar = useCallback(() => {
    const values = cloneDeep(form.getFieldsValue(true));
    const alternativasDto: AltenativaDto[] = [];

    const alternativaA: any = {
      numeracao: 'A',
      descricao: values[campoAlternativaA],
      justificativa: values[campoJustificativaA] || '',
      correta: values[campoAlternativaCorreta] === 'A',
      ordem: 1,
      itemId: itemId,
    };
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
      itemId: itemId,
    };
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
    if (elaboracaoItemNovo?.idAlternativaD) {
      alternativaD.id = elaboracaoItemNovo.idAlternativaD;
    }
    alternativasDto.push(alternativaD);
    const codigoItemAtualizado =
      configuracaoItemNovo?.codigoItem || codigoItemEstado || values[campoCodigoItem] || '';
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
      discriminacao: configuracaoItemNovo?.discriminacao
        ? +configuracaoItemNovo?.discriminacao
        : null,
      dificuldade: configuracaoItemNovo?.dificuldade ? +configuracaoItemNovo?.dificuldade : null,
      nivelItem: configuracaoItemNovo?.nivelItem || null,
      acertoCasual: configuracaoItemNovo?.acertoCasual ? +configuracaoItemNovo?.acertoCasual : null,
      palavrasChave: (() => {
        let palavrasChaveArray: string[] | null = null;

        if (configuracaoItemNovo?.palavrasChave) {
          if (Array.isArray(configuracaoItemNovo.palavrasChave)) {
            const palavrasValidas = configuracaoItemNovo.palavrasChave.filter(
              (p: string) => p && p.trim(),
            );
            palavrasChaveArray = palavrasValidas.length > 0 ? palavrasValidas : null;
          } else if (typeof configuracaoItemNovo.palavrasChave === 'string') {
            const palavraString = (configuracaoItemNovo.palavrasChave as string).trim();
            if (palavraString) {
              palavrasChaveArray = palavraString.includes(';')
                ? palavraString
                    .split(';')
                    .filter((p: string) => p && p.trim())
                    .map((p: string) => p.trim())
                : [palavraString];
            }
          }
        }
        return palavrasChaveArray; // Array de strings ou null
      })(),
      parametroBTransformado: configuracaoItemNovo?.parametroBTransformado
        ? +configuracaoItemNovo?.parametroBTransformado
        : null,
      mediaEhDesvio: configuracaoItemNovo?.mediaDesvioPadrao || null,
      sentencaDescritora: configuracaoItemNovo?.sentencaDescritora || null,
      observacao: configuracaoItemNovo?.observacao || null,
      textoBase: values[campoTextoBase] || '',
      fonte: values[campoFonte] || '',
      enunciado: values[campoEnunciado] || '',
      versaoItem: configuracaoItemNovo?.versaoItem ?? 0,
      itemCodeVersion: configuracaoItemNovo?.itemCodeVersion ?? 0,
      alternativasDto: alternativasDto,
    };

    if (values[campoVideo]?.length) {
      dto.arquivoVideoId = values[campoVideo]?.[0]?.idFile;
    }
    if (values[campoAudio]?.length) {
      dto.arquivoAudioId = values[campoAudio]?.[0]?.idFile;
    }
    try {
      JSON.stringify(dto);
    } catch (error) {
      console.error('❌ ERRO na serialização do DTO da elaboração:', error);
      Object.keys(dto).forEach((key) => {
        try {
          JSON.stringify((dto as any)[key]);
        } catch (err) {
          console.error(`❌ ${key}: ERRO -`, err);
        }
      });
    }

    return dto;
  }, [
    itemId,
    configuracaoItemNovo,
    codigoItemEstado,
    form,
    campoTextoBase,
    campoFonte,
    campoEnunciado,
    campoVideo,
    campoAudio,
    campoAlternativaA,
    campoJustificativaA,
    campoAlternativaB,
    campoJustificativaB,
    campoAlternativaC,
    campoJustificativaC,
    campoAlternativaD,
    campoJustificativaD,
    campoAlternativaCorreta,
  ]);

  const inserirRascunhoItem = useCallback(
    async (itemDto: ItemNovoDto) => {
      await configuracaoItemService
        .salvarRascunhoItemNovo(itemDto)
        .then(async (resp) => {
          mensagem('success', 'Sucesso', 'Rascunho de item salvo com sucesso');
          if (videoAudioData.videoTemp || videoAudioData.audioTemp) {
            const novoVideoAudio = {
              ...videoAudioData,
              videoSalvo: videoAudioData.videoTemp || videoAudioData.videoSalvo,
              audioSalvo: videoAudioData.audioTemp || videoAudioData.audioSalvo,
              videoTemp: undefined,
              audioTemp: undefined,
            };
            setVideoAudioData(novoVideoAudio);
            const itemAtualizado = localStorage.getItem('itemAtual');
            if (itemAtualizado) {
              const item = JSON.parse(itemAtualizado);
              item.videoAudio = novoVideoAudio;
              localStorage.setItem('itemAtual', JSON.stringify(item));
            }
          }
          try {
            const dadosAtualizados = await obterItemComAlternativasEPopular(resp.data);

            if (dadosAtualizados) {
            } else {
              console.warn('⚠️ Falha ao recarregar dados do backend após salvar rascunho');
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
        .catch(() => {
          mensagem('error', 'Erro', 'Ocorreu um erro ao salvar o rascunho');
        });
    },
    [
      mensagem,
      form,
      itemId,
      configuracaoItemNovo,
      campoTextoBase,
      campoFonte,
      campoEnunciado,
      campoCodigoItem,
      campoVideo,
      campoAudio,
      campoAlternativaA,
      campoJustificativaA,
      campoAlternativaB,
      campoJustificativaB,
      campoAlternativaC,
      campoJustificativaC,
      campoAlternativaD,
      campoJustificativaD,
      campoAlternativaCorreta,
    ],
  );

  const salvarRascunho = useCallback(async () => {
    setCarregando(true);
    salvarDadosFormularioNoLocalStorage();

    const itemSalvar = gerarItemSalvar();
    await inserirRascunhoItem(itemSalvar);
    setCarregando(false);
  }, [gerarItemSalvar, inserirRascunhoItem, salvarDadosFormularioNoLocalStorage]);

  const salvar = useCallback(async () => {
    setCarregando(true);
    salvarDadosFormularioNoLocalStorage();

    const itemSalvar = gerarItemSalvar();

    try {
      await configuracaoItemService.editarItemNovo(itemSalvar);
      mensagem('success', 'Sucesso', 'Item salvo com sucesso');
      limparItemDoLocalStorage();
      navigate('/listagem');
      window.scrollTo(0, 0);
    } catch {
      mensagem('error', 'Erro', 'Ocorreu um erro ao salvar o item');
    } finally {
      setCarregando(false);
    }
  }, [
    gerarItemSalvar,
    limparItemDoLocalStorage,
    mensagem,
    navigate,
    salvarDadosFormularioNoLocalStorage,
  ]);

  const cancelar = () => {
    setCarregando(true);
    limparItemDoLocalStorage();
    setItemId(0);
    setCodigoItemEstado('');
    setConfiguracaoItemNovoLocal({});
    setElaboracaoItemNovoLocal({});
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
    navigate('/listagem');
  };
  useEffect(() => {
    const codigoItemAtual = form.getFieldValue(campoCodigoItem);
    if (codigoItemAtual !== codigoItemEstado) {
      setCodigoItemEstado(codigoItemAtual);
    }
  }, [form, campoCodigoItem, codigoItemEstado]);

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
          onValuesChange={() => {
            if (itemId > 0 && (configuracaoItemNovo?.codigoItem || codigoItemEstado)) {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => {
                salvarComDebounce();
              }, 1500);
            }
          }}
          style={{
            margin: 0,
          }}
        >
          <CadastrarItemHeaderComponent pagina={2} editando={editandoItem} />

          <div className='cadastrarItem-corpo'>
            <div className='cadastrarItem-titulo-corpo'>
              <div className='cadastrarItem-titulo'>Edite o item</div>
              <div className='cadastrarItem-subtitulo'>
                Esses dados garantem que o item esteja alinhado à matriz de avaliação e possa ser
                aplicado corretamente.
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
                <Button className='btnVoltar' onClick={cancelar}>
                  Cancelar
                </Button>
              </div>
              <div className='cadastrarItem-btn'>
                <Button className='btnAvancar' onClick={salvar}>
                  Salvar
                </Button>
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
