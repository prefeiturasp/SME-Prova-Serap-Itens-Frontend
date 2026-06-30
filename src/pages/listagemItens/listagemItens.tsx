import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './listagemItens.css';
import ListagemTabela from '~/components/listagem-itens/tabela/listagemTabelaComponent';
import ListagemSelectComponent from '~/components/listagem-itens/select/listagemSelectComponent';
import ListagemResumoItemComponent from '~/components/listagem-itens/resumoItem/listagemResumoItemComponent';
import ListagemVersaoItemComponent from '~/components/listagem-itens/versaoItem/listagemVersaoItemComponent';
import { useNavigate } from 'react-router-dom';
import { AntDesignDto } from '~/domain/dto/ant-design-dto';
import itemService from '~/services/item-service';
import type { ItemListagemDto } from '~/domain/dto/item-listagem-dto';
import type { PaginacaoDto } from '~/domain/dto/paginacao-dto';
import { ItemResumoVersaoDto } from '~/domain/dto/item-resumo-versao-dto';
import filtroSelectService from '~/services/filtro-select-service';
import { DefaultOptionType } from 'antd/es/select';
import { SelecioneDto } from '~/domain/dto/selecione-dto';
import { converterSelecineDto } from '~/utils/converte-dto';
import carregarFiltroDeItensDoLocalStorage from '~/utils/filtro-helper';
import { limparStorageFiltroListagem, STORAGE_KEYS } from '~/utils/fluxo-item-storage';
import configuracaoItemService from '~/services/configuracaoItem-service';

const ListagemItens: React.FC = () => {
  const linkRetorno = 'https://hom-serap.sme.prefeitura.sp.gov.br/';
  const navigate = useNavigate();

  const [pagina, setPagina] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [totalRegistros, setTotalRegistro] = useState(0);
  const [selectItemLista, setSelectItemLista] = useState<DefaultOptionType[]>(null!);
  const [selectItemSelecionado, setSelectItemSelecionado] = useState<DefaultOptionType>(null!);
  const [tabelaItens, setTabelaItens] = useState<ItemListagemDto[]>([]);
  const [itemResumoVersao, setItemResumoVersao] = useState<ItemResumoVersaoDto>();
  const [codigoItemTabelaSelecionado, setCodigoItemTabelaSelecionado] = useState<string>('');
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);

  useEffect(() => {
    buscaDadosTabela();
  }, []);

  useEffect(() => {
    if (pagina) {
      buscaDadosTabela();
    }
  }, [selectItemSelecionado, pagina, itensPorPagina]);

  useEffect(() => {
    if (codigoItemTabelaSelecionado) buscaResumoEVersoes();
  }, [codigoItemTabelaSelecionado]);

  const buscaDadosTabela = async () => {
    try {
      const filtros = carregarFiltroDeItensDoLocalStorage();
      const codigoItem = (selectItemSelecionado?.label as string) ?? '';
      const resposta: PaginacaoDto<ItemListagemDto> = await itemService.obterListaItens(
        pagina,
        itensPorPagina,
        {
          codigoItem: codigoItem,
          ...filtros,
        },
      );
      setTabelaItens(resposta?.itens ?? []);
      setTotalRegistro(resposta?.totalRegistros ?? 0);
    } catch {
      setTabelaItens([]);
      setTotalRegistro(0);
    }
  };

  const buscaResumoEVersoes = async () => {
    const resposta: ItemResumoVersaoDto = await itemService.obterVersaoEResumo(
      codigoItemTabelaSelecionado,
    );

    setItemResumoVersao(resposta);
  };

  const selecionaItemOnChange = async (value: string, option: DefaultOptionType) => {
    setPagina(1);
    if (value) {
      const label = typeof option.label === 'string' ? option.label : String(option.label ?? '');
      const obj: AntDesignDto = {
        label,
        value: value,
      };
      setSelectItemSelecionado(obj);
      setCodigoItemTabelaSelecionado('');
    } else {
      setSelectItemSelecionado(null!);
      setCodigoItemTabelaSelecionado('');
    }
  };

  const buscarItemOnSearch = async (value: string) => {
    try {
      if (!value) return;

      setLoadingSelect(true);

      const labelSelecionado = String(selectItemSelecionado?.label ?? '');

      if (value.length >= 3 || labelSelecionado.length >= 3) {
        const resposta: SelecioneDto[] = await filtroSelectService.obterListaItems(value);
        setSelectItemLista(converterSelecineDto(resposta));
      } else {
        setSelectItemSelecionado(null!);
        setCodigoItemTabelaSelecionado('');
        setSelectItemLista([]);
      }
    } catch {
      setSelectItemLista([]);
    } finally {
      setLoadingSelect(false);
    }
  };

  const onChangeFiltro = () => {
    if (pagina != 1) setPagina(1);
    else buscaDadosTabela();
  };

  const selecionaPaginasOnChange = (valor: number) => {
    setItensPorPagina(valor);
  };

  const tabelaItemClick = (id: string) => {
    setCodigoItemTabelaSelecionado(id);
  };

  const editarItem = async (itemId: number) => {
    try {
      const resposta = await configuracaoItemService.obterItemComAlternativas(itemId);
      const item = resposta?.data;

      if (!item) return;

      const configuracao = {
        codigoItem: item.codigoItem,
        areaConhecimento: item.areaconhecimentoId,
        disciplina: item.disciplinaId,
        matriz: item.matrizId,
        competencia: item.competenciaId,
        habilidade: item.habilidadeId,
        anoMatriz: item.anoMatrizId,
        assunto: item.assuntoId,
        subAssunto: item.subAssuntoId,
        situacaoItem: item.situacao,
        tipoItem: item.tipo,
        quantidadeAlternativas: item.quantidadeAlternativasId,
        dificuldadeSugerida: item.dificuldadeSugeridaId,
        discriminacao: item.discriminacao,
        dificuldade: item.dificuldade,
        nivelItem: item.nivelItem,
        acertoCasual: item.acertoCasual,
        palavrasChave: Array.isArray(item.palavrasChave)
          ? item.palavrasChave.filter((p: string) => p && p.trim())
          : item.palavrasChave
          ? item.palavrasChave.split(';').filter((p: string) => p && p.trim())
          : [],
        parametroBTransformado: item.parametroBTransformado,
        mediaDesvioPadrao: item.mediaEhDesvio,
        sentencaDescritora: item.sentencaDescritora,
        observacao: item.observacao,
        versaoItem: item.versaoItem ?? 0,
        itemCodeVersion: item.itemCodeVersion ?? 0,
      };

      const elaboracao = {
        textoBase: item.textoBase || '',
        fonte: item.fonte || '',
        enunciado: item.enunciado || '',
        codigoItem: item.codigoItem,
        alternativaA: item.alternativas?.find((a: any) => a.numeracao === 'A')?.descricao || '',
        justificativaA:
          item.alternativas?.find((a: any) => a.numeracao === 'A')?.justificativa || '',
        alternativaB: item.alternativas?.find((a: any) => a.numeracao === 'B')?.descricao || '',
        justificativaB:
          item.alternativas?.find((a: any) => a.numeracao === 'B')?.justificativa || '',
        alternativaC: item.alternativas?.find((a: any) => a.numeracao === 'C')?.descricao || '',
        justificativaC:
          item.alternativas?.find((a: any) => a.numeracao === 'C')?.justificativa || '',
        alternativaD: item.alternativas?.find((a: any) => a.numeracao === 'D')?.descricao || '',
        justificativaD:
          item.alternativas?.find((a: any) => a.numeracao === 'D')?.justificativa || '',
        alternativaCorreta: item.alternativas?.find((a: any) => a.correta)?.numeracao || 'A',
        idAlternativaA: item.alternativas?.find((a: any) => a.numeracao === 'A')?.id || null,
        idAlternativaB: item.alternativas?.find((a: any) => a.numeracao === 'B')?.id || null,
        idAlternativaC: item.alternativas?.find((a: any) => a.numeracao === 'C')?.id || null,
        idAlternativaD: item.alternativas?.find((a: any) => a.numeracao === 'D')?.id || null,
        ArquivoVideoId: item.video?.arquivoId || null,
        ArquivoAudioId: item.audio?.arquivoId || null,
      };

      const videoAudio = {
        videoSalvo: item.video?.arquivoId
          ? {
              idFile: item.video.arquivoId,
              fileLink: item.video.caminho || undefined,
              name: item.video.nomeArquivo || undefined,
              status: 'done',
              uid: `video-${item.video.arquivoId}`,
              type: item.video.contentType || undefined,
            }
          : undefined,
        audioSalvo: item.audio?.arquivoId
          ? {
              idFile: item.audio.arquivoId,
              fileLink: item.audio.caminho || undefined,
              name: item.audio.nomeArquivo || undefined,
              status: 'done',
              uid: `audio-${item.audio.arquivoId}`,
              type: item.audio.contentType || undefined,
            }
          : undefined,
        videoTemp: undefined,
        audioTemp: undefined,
      };

      localStorage.setItem(
        STORAGE_KEYS.itemAtual,
        JSON.stringify({
          id: item.id,
          codigoItem: item.codigoItem,
          configuracao,
          elaboracao,
          videoAudio,
        }),
      );
      localStorage.setItem(STORAGE_KEYS.editandoItem, 'true');
      localStorage.removeItem(STORAGE_KEYS.voltandoParaPrimeiraTela);
      navigate('/criacao');
      window.scrollTo(0, 0);
    } catch {
      // Mantem comportamento atual sem bloquear a listagem em caso de falha na consulta.
    }
  };

  useEffect(() => {
    return () => {
      limparStorageFiltroListagem();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      limparStorageFiltroListagem();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className='listagem-pagina'>
      <div className='cadastrarItemHeader'>
        <Row className='cadastrarItemHeader-corpo'>
          <Col xs={12} md={6}>
            <a href={linkRetorno} className='cadastrarItemHeader-retornar'>
              <ArrowLeftOutlined className='cadastrarItemHeader-icone-retornar' />
              <span className='cadastrarItemHeader-texto-retornar'>Retornar à tela inicial</span>
            </a>
          </Col>
          <Col xs={12} md={12} className='cadastrarItemHeader-titulo'>
            Banco de itens
          </Col>
          <Col xs={0} md={6} />
        </Row>
        <div className='cadastrarItemHeader-rota'>
          <div className='cadastrarItemHeader-rota-texto'>Home / Itens / Banco de itens</div>
          <div className='cadastrarItemHeader-rota-titulo'>Banco de itens</div>
        </div>
      </div>

      <div className='listagem-head'>
        <div className='listagem-head-texto'>
          <div className='listagem-titulo'>Lista de itens</div>

          <div className='listagem-subtitulo'>
            Sua lista de itens criados. Você pode conferir detalhes, fazer edições ou usar os
            filtros para encontrar o que precisa.
          </div>
        </div>
        <div className='listagem-head-botao'>
          <Button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEYS.editandoItem);
              navigate(`/criacao`);
              window.scrollTo(0, 0);
            }}
            className='btn-azul-padrao'
          >
            Criar novo item
          </Button>
        </div>
      </div>

      <div>
        <ListagemSelectComponent
          dados={selectItemLista}
          buscarItemOnSearch={buscarItemOnSearch}
          itemSelecionado={selectItemSelecionado}
          selecionaItemOnChange={selecionaItemOnChange}
          loading={loadingSelect}
        ></ListagemSelectComponent>
      </div>

      <div className='listagem-conteudo'>
        <div className='listagem-conteudo-esquerda'>
          <ListagemTabela
            dados={tabelaItens}
            pagina={pagina}
            totalRegistros={totalRegistros}
            setPagina={setPagina}
            itensPorPagina={itensPorPagina}
            onItemClick={tabelaItemClick}
            selecionaPaginasOnChange={selecionaPaginasOnChange}
            onChangeFiltro={onChangeFiltro}
          ></ListagemTabela>
        </div>
        <div className='listagem-conteudo-direita'>
          {codigoItemTabelaSelecionado === '' ? (
            <div className='listagem-conteudo-direita-vazio'>
              <p>
                <b>Nenhum item selecionado!</b>
              </p>
              Escolha um na lista ao lado para conferir os detalhes aqui.
            </div>
          ) : (
            <>
              <div>
                <ListagemResumoItemComponent dados={itemResumoVersao} onEditarItem={editarItem} />
              </div>
              <div>
                <ListagemVersaoItemComponent versoes={itemResumoVersao?.versoesDisponiveis!} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListagemItens;
