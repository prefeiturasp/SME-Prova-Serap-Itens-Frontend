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
import { VideoArquivoDto, AudioArquivoDto } from '~/domain/dto/ArquivoMidiaDto';
import { SelectValueType } from '~/domain/type/select';
import CadastrarItemHeaderComponent from './cadastrarItemHeaderComponent';
import CadastrarItemRodapeComponent from './cadastrarItemRodapeComponent';
import { limparStorageFluxoCadastro, STORAGE_KEYS } from '~/utils/fluxo-item-storage';

interface ElaboracaoLocalProps {
  textoBase?: string;
  fonte?: string;
  enunciado?: string;
  codigoItem?: string;
  video?: VideoArquivoDto | null;
  audio?: AudioArquivoDto | null;
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
  ArquivoVideoId?: number | null;
  ArquivoAudioId?: number | null;
}

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

const CadastrarItemNovo: React.FC<FormProps> = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(false);

  const [itemId, setItemId] = useState<number>(0);
  const [codigoItem, setCodigoItem] = useState<string>('');
  const [editandoItem, setEditandoItem] = useState<boolean>(false);
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

  const areaConhecimentoIdForm = Form.useWatch(Campos.areaConhecimento, form);
  const disciplinaIdForm = Form.useWatch(Campos.disciplinas, form);

  const [bloquearBtnSalvarRascunho, setBloquearBtnSalvarRascunho] = useState<boolean>(true);
  const [bloquearBtnAvancar, setBloquearBtnAvancar] = useState<boolean>(true);

  const salvarItemNoLocalStorage = useCallback(
    (itemData: { id: number; codigoItem: string; configuracao: any; elaboracao?: any }) => {
      try {
        const itemCompleto = {
          id: itemData.id,
          codigoItem: itemData.codigoItem,
          configuracao: itemData.configuracao,
          elaboracao: itemData.elaboracao || {},
        };
        localStorage.setItem('itemAtual', JSON.stringify(itemCompleto));
      } catch (error) {
        console.error('❌ Erro ao salvar no localStorage:', error);
      }
    },
    [],
  );

  const limparItemDoLocalStorage = useCallback(() => {
    try {
      limparStorageFluxoCadastro();
      setItemId(0);
      setCodigoItem('');
      setElaboracaoItem({});
    } catch {
      setItemId(0);
      setCodigoItem('');
      setElaboracaoItem({});
    }
  }, []);

  const carregarEstadosDoLocalStorage = useCallback(() => {
    try {
      const itemSalvoStr = localStorage.getItem('itemAtual');
      if (!itemSalvoStr) return;

      const itemSalvo = JSON.parse(itemSalvoStr);
      if (itemSalvo.id) setItemId(itemSalvo.id);
      if (itemSalvo.codigoItem) setCodigoItem(itemSalvo.codigoItem);
      if (itemSalvo.elaboracao) setElaboracaoItem(itemSalvo.elaboracao);
    } catch (error) {
      console.error('❌ Erro ao carregar estados do localStorage:', error);
    }
  }, []);

  useEffect(() => {
    carregarEstadosDoLocalStorage();
    setEditandoItem(localStorage.getItem(STORAGE_KEYS.editandoItem) === 'true');
  }, [carregarEstadosDoLocalStorage]);

  useEffect(() => {
    const bloquear = validarCampoForm(disciplinaIdForm) || validarCampoForm(areaConhecimentoIdForm);

    setBloquearBtnSalvarRascunho(bloquear);
  }, [areaConhecimentoIdForm, disciplinaIdForm]);

  useEffect(() => {
    const temIdECodigo = itemId > 0 && codigoItem && codigoItem.trim() !== '';

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
    limparItemDoLocalStorage();
    form.resetFields();
    setCarregando(false);
    navigate('/listagem');
  };

  const sincronizarConfiguracaoNoLocalStorage = useCallback(() => {
    try {
      const values = form.getFieldsValue(true);
      const itemAtualStr = localStorage.getItem(STORAGE_KEYS.itemAtual);
      if (!itemAtualStr) return;

      const itemAtual = JSON.parse(itemAtualStr);

      let palavrasChaveArray: string[] | null = null;
      if (values?.palavraChave) {
        if (Array.isArray(values.palavraChave)) {
          const validas = values.palavraChave.filter((p: string) => p && p.trim());
          palavrasChaveArray = validas.length > 0 ? validas : null;
        } else if (typeof values.palavraChave === 'string' && values.palavraChave.trim()) {
          const str = values.palavraChave.trim();
          palavrasChaveArray = str.includes(';')
            ? str
                .split(';')
                .filter((p: string) => p && p.trim())
                .map((p: string) => p.trim())
            : [str];
        }
      }

      const configuracaoAtualizada = {
        ...itemAtual.configuracao,
        areaConhecimento: values?.AreaConhecimento ?? itemAtual.configuracao?.areaConhecimento,
        disciplina: values?.disciplinas ?? itemAtual.configuracao?.disciplina,
        matriz: values?.matriz ?? itemAtual.configuracao?.matriz,
        anoMatriz: values?.anoMatriz ?? itemAtual.configuracao?.anoMatriz,
        competencia: values?.competencia ?? itemAtual.configuracao?.competencia,
        habilidade: values?.habilidade ?? itemAtual.configuracao?.habilidade,
        assunto: values?.assunto ?? itemAtual.configuracao?.assunto,
        subAssunto: values?.subAssunto ?? itemAtual.configuracao?.subAssunto,
        situacaoItem: values?.situacaoItem ?? itemAtual.configuracao?.situacaoItem,
        tipoItem: values?.tipoItem ?? itemAtual.configuracao?.tipoItem,
        quantidadeAlternativas:
          values?.quantidadeAlternativas ?? itemAtual.configuracao?.quantidadeAlternativas,
        dificuldadeSugerida:
          values?.dificuldadeSugerida ?? itemAtual.configuracao?.dificuldadeSugerida,
        nivelItem: values?.nivelItem ?? itemAtual.configuracao?.nivelItem,
        discriminacao:
          values?.infoEstatisticasDiscriminacao ?? itemAtual.configuracao?.discriminacao,
        dificuldade: values?.infoEstatisticasDificuldade ?? itemAtual.configuracao?.dificuldade,
        acertoCasual: values?.infoEstatisticasAcertoCasual ?? itemAtual.configuracao?.acertoCasual,
        palavrasChave:
          palavrasChaveArray !== null ? palavrasChaveArray : itemAtual.configuracao?.palavrasChave,
        parametroBTransformado:
          values?.parametroBTransformado ?? itemAtual.configuracao?.parametroBTransformado,
        mediaDesvioPadrao: values?.mediaDesvioPadrao ?? itemAtual.configuracao?.mediaDesvioPadrao,
        sentencaDescritora:
          values?.sentencaDescritora ?? itemAtual.configuracao?.sentencaDescritora,
        observacao: values?.observacao ?? itemAtual.configuracao?.observacao,
      };

      localStorage.setItem(
        STORAGE_KEYS.itemAtual,
        JSON.stringify({ ...itemAtual, configuracao: configuracaoAtualizada }),
      );
    } catch (error) {
      console.error('❌ Erro ao sincronizar configuração no localStorage:', error);
    }
  }, [form]);

  const avancar = () => {
    if (!itemId || itemId === 0) {
      mensagem('error', 'Erro', 'É necessário salvar o item antes de avançar');
      return;
    }
    if (!codigoItem || codigoItem.trim() === '') {
      mensagem('error', 'Erro', 'É necessário que o item tenha um código antes de avançar');
      return;
    }
    sincronizarConfiguracaoNoLocalStorage();
    navigate('/elaboracao');
  };

  const gerarItemSalvar = useCallback(() => {
    const values = form.getFieldsValue(true);

    let elaboracaoLS: any = elaboracaoItem;
    try {
      const raw = localStorage.getItem('itemAtual');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.elaboracao) {
          elaboracaoLS = parsed.elaboracao;
        }
      }
    } catch (_) {}

    let palavrasChaveArray: string[] | null = null;
    if (values?.palavraChave) {
      if (Array.isArray(values.palavraChave)) {
        const palavrasValidas = values.palavraChave.filter((p: string) => p && p.trim());
        palavrasChaveArray = palavrasValidas.length > 0 ? palavrasValidas : null;
      } else if (typeof values.palavraChave === 'string' && values.palavraChave.trim()) {
        palavrasChaveArray = values.palavraChave.includes(';')
          ? values.palavraChave
              .split(';')
              .filter((p: string) => p && p.trim())
              .map((p: string) => p.trim())
          : [values.palavraChave.trim()];
      }
    }

    const construirAlternativasDeElaboracao = (): AltenativaDto[] | undefined => {
      if (!elaboracaoLS) return undefined;
      const alt: AltenativaDto[] = [] as any;
      const correta = elaboracaoLS?.alternativaCorreta;
      const push = (
        letra: 'A' | 'B' | 'C' | 'D',
        descricao?: string,
        justificativa?: string,
        idAlt?: number | null,
        ordem?: number,
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
      push(
        'A',
        elaboracaoLS?.alternativaA,
        elaboracaoLS?.justificativaA,
        elaboracaoLS?.idAlternativaA,
        1,
      );
      push(
        'B',
        elaboracaoLS?.alternativaB,
        elaboracaoLS?.justificativaB,
        elaboracaoLS?.idAlternativaB,
        2,
      );
      push(
        'C',
        elaboracaoLS?.alternativaC,
        elaboracaoLS?.justificativaC,
        elaboracaoLS?.idAlternativaC,
        3,
      );
      push(
        'D',
        elaboracaoLS?.alternativaD,
        elaboracaoLS?.justificativaD,
        elaboracaoLS?.idAlternativaD,
        4,
      );
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
      discriminacao: values?.infoEstatisticasDiscriminacao
        ? +values?.infoEstatisticasDiscriminacao
        : null,
      dificuldade: values?.infoEstatisticasDificuldade
        ? +values?.infoEstatisticasDificuldade
        : null,
      nivelItem: values?.nivelItem || null,
      acertoCasual: values?.infoEstatisticasAcertoCasual
        ? +values?.infoEstatisticasAcertoCasual
        : null,
      palavrasChave: palavrasChaveArray,
      parametroBTransformado: values?.parametroBTransformado
        ? +values?.parametroBTransformado
        : null,
      mediaEhDesvio: values?.mediaDesvioPadrao || null,
      sentencaDescritora: values?.sentencaDescritora || null,
      observacao: values?.observacao || null,
      textoBase: elaboracaoLS?.textoBase || '',
      fonte: elaboracaoLS?.fonte || '',
      enunciado: elaboracaoLS?.enunciado || '',
      versaoItem: 0,
      itemCodeVersion: 0,
      alternativasDto: undefined,
    } as ItemNovoDto;

    if (values?.alternativasDto?.length) {
      dto.alternativasDto = values.alternativasDto.map((item: AltenativaDto) => {
        const ehAlternativaCorreta = item.numeracao === values.alternativaCorreta;
        item.correta = ehAlternativaCorreta;
        return item;
      });
    } else {
      const alt = construirAlternativasDeElaboracao();
      if (alt) dto.alternativasDto = alt;
    }

    if (elaboracaoLS?.video) {
      dto.arquivoVideoId = elaboracaoLS.video.idFile;
    }
    if (elaboracaoLS?.audio) {
      dto.arquivoAudioId = elaboracaoLS.audio.idFile;
    }

    return dto;
  }, [itemId, codigoItem, form, elaboracaoItem]);

  const obterDadosItem = useCallback(
    async (id: number) => {
      try {
        const resp = await configuracaoItemService.obterItem(id);

        if (resp?.data) {
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
            versaoItem: resp.data.versaoItem ?? 0,
            itemCodeVersion: resp.data.itemCodeVersion ?? 0,
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
    [form, mensagem, salvarItemNoLocalStorage],
  );

  const inserirItem = useCallback(
    async (item: ItemNovoDto) => {
      await configuracaoItemService
        .salvarItemNovo(item)
        .then((resp) => {
          obterDadosItem(resp.data);
          mensagem('success', 'Sucesso', 'Item cadastrado com sucesso');
        })
        .catch(() => {
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
        .catch(() => {
          mensagem('error', 'Erro', 'ocorreu um erro ao cadastrar o rascunho');
        });
    },
    [mensagem, obterDadosItem],
  );

  const validarCamposObrigatorios = useCallback(
    (dto: ItemNovoDto): boolean => {
      const camposSempreObrigatorios = [
        {
          campo: 'areaConhecimentoId',
          valor: dto.areaConhecimentoId,
          nome: 'Área de Conhecimento',
        },
        { campo: 'disciplinaId', valor: dto.disciplinaId, nome: 'Disciplina' },
      ];

      const ehEdicao = itemId > 0 && codigoItem && codigoItem.trim() !== '';

      let camposObrigatorios = [...camposSempreObrigatorios];

      if (ehEdicao) {
        camposObrigatorios.push(
          { campo: 'id', valor: dto.id, nome: 'ID' },
          { campo: 'codigoItem', valor: dto.codigoItem, nome: 'Código do Item' },
        );
      }

      const camposFaltando = camposObrigatorios.filter(
        ({ valor }) => valor === null || valor === undefined || valor === 0,
      );

      if (camposFaltando.length > 0) {
        const nomesCampos = camposFaltando.map(({ nome }) => nome).join(', ');
        const tipoOperacao = ehEdicao ? 'edição' : 'criação';
        mensagem(
          'error',
          'Campos Obrigatórios',
          `Para ${tipoOperacao} do item, os seguintes campos são obrigatórios: ${nomesCampos}`,
        );
        console.error(`❌ Campos obrigatórios faltando para ${tipoOperacao}:`, camposFaltando);
        return false;
      }
      return true;
    },
    [mensagem, itemId, codigoItem],
  );

  const salvarItem = useCallback(
    async (rascunho = false) => {
      setCarregando(true);
      const itemSalvar = gerarItemSalvar();

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
      <Spin size='small' spinning={carregando}>
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
          <CadastrarItemHeaderComponent pagina={1} editando={editandoItem} />

          <div className='cadastrarItem-corpo'>
            <div className='cadastrarItem-titulo-corpo'>
              <div className='cadastrarItem-titulo'>Configure o novo item</div>
              <div className='cadastrarItem-subtitulo'>
                Preencha as informações abaixo para criar e cadastrar um novo item. Esses dados
                garantem que ele esteja alinhado à matriz de avaliação e possa ser aplicado
                corretamente.
              </div>
            </div>

            <FormularioUnico form={form} setCarregando={setCarregando} />

            <div className='cadastrarItem-botoes'>
              <div className='cadastrarItem-btn'>
                <Button className='btnVoltar' onClick={cancelar}>
                  Cancelar
                </Button>
              </div>
              <div className='cadastrarItem-btn'>
                <Button
                  type='primary'
                  onClick={() => salvarItem(true)}
                  disabled={bloquearBtnSalvarRascunho || editandoItem}
                  className='btnAvancar'
                >
                  Salvar
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
};

export default CadastrarItemNovo;
