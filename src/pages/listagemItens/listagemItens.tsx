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
    if (pagina) buscaDadosTabela();
  }, [selectItemSelecionado, pagina, itensPorPagina]);

  useEffect(() => {
    if (codigoItemTabelaSelecionado) buscaResumoEVersoes();
  }, [codigoItemTabelaSelecionado]);

  const buscaDadosTabela = async () => {
    try {
      const valorSelcionado: any = selectItemSelecionado?.value;

      const codigoItem: string = valorSelcionado?.label!;
      const resposta: PaginacaoDto<ItemListagemDto> = await itemService.obterListaItens({
        codigoItem: codigoItem,
        pagina: pagina,
        tamanhoPagina: itensPorPagina,
      });
      setTabelaItens(resposta?.itens);
      setTotalRegistro(resposta?.totalRegistros);
    } catch (error) {
      console.log(error);
    }
  };

  const buscaResumoEVersoes = async () => {
    const resposta: ItemResumoVersaoDto = await itemService.obterVersaoEResumo(
      codigoItemTabelaSelecionado,
    );

    setItemResumoVersao(resposta);
  };

  const selecionaItemOnChange = async (value: string, option: any) => {
    setPagina(1);
    if (value) {
      const obj: AntDesignDto = {
        label: option.label,
        value: value,
      };
      setSelectItemSelecionado(obj);
    } else {
      setSelectItemSelecionado(null!);
    }
  };

  const buscarItemOnSearch = async (value: string) => {
    try {
      setLoadingSelect(true);
      if (value?.length >= 3) {
        const resposta: SelecioneDto[] = await filtroSelectService.obterListaItems(value);
        setSelectItemLista(converterSelecineDto(resposta));
      } else {
        setSelectItemLista([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSelect(false);
    }
  };

  const selecionaPaginasOnChange = async (valor: string, option: any) => {
    console.log(valor, option);
    setItensPorPagina(Number(valor));
  };

  const tabelaItemClick = (id: string) => {
    setCodigoItemTabelaSelecionado(id);
  };

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
                <ListagemResumoItemComponent dados={itemResumoVersao} />
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
