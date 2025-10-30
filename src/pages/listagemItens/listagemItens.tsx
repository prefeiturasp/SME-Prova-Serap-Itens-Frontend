import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './listagemItens.css';
import ListagemTabela from '~/components/listagem-itens/tabela/listagemTabelaComponent';
import ListagemSelectComponent from '~/components/listagem-itens/select/listagemSelectComponent';
import ListagemResumoItemComponent from '~/components/listagem-itens/resumoItem/listagemResumoItemComponent';
import ListagemVersaoItemComponent from '~/components/listagem-itens/versaoItem/listagemVersaoItemComponent';
import { useNavigate } from 'react-router-dom';
import { AntDesignDto } from '~/domain/dto/ant-design-dto';
import type { VersaoDto } from '~/domain/dto/versao-dto';
import itemService from '~/services/item-service';
import type { ItemListagemDto } from '~/domain/dto/item-listagem-dto';
import type { PaginacaoDto } from '~/domain/dto/paginacao-dto';
import { ItemResumoVersaoDto } from '~/domain/dto/item-resumo-versao-dto';

const ITENS_POR_PAGINA = 8;

const ListagemItens: React.FC = () => {
  const linkRetorno = 'https://serap.sme.prefeitura.sp.gov.br/';
  const navigate = useNavigate();

  const [pagina, setPagina] = useState(1);
  const [totalRegistros, setTotalRegistro] = useState(0);
  const [selectItemLista, setSelectItemLista] = useState<AntDesignDto[]>([
    {
      value: '0',
      label: 'Todas',
    },
  ]);
  const [selectItemSelecionado, setSelectItemSelecionado] = useState<AntDesignDto>({
    value: '0',
    label: 'Todas',
  });

  const [tabelaItens, setTabelaItens] = useState<ItemListagemDto[]>([]);
  const [itemResumoVersao, setItemResumoVersao] = useState<ItemResumoVersaoDto>();

  const [codigoItemTabelaSelecionado, setCodigoItemTabelaSelecionado] = useState<string>('');

  useEffect(() => {
    buscaDadosSelectItens();
    buscaDadosTabela();
  }, []);

  useEffect(() => {
    if (selectItemSelecionado && pagina) buscaDadosTabela();
  }, [selectItemSelecionado, pagina]);

  useEffect(() => {
    if (codigoItemTabelaSelecionado) buscaResumoEVersoes();
  }, [codigoItemTabelaSelecionado]);

  const buscaDadosSelectItens = async () => {
    try {
      /*const retorno = CAIQUE CRIE O SERVICO NA PASTA SERVICO E CHAME A API AQUI SUBSTITUINDO O VALOR MOCKADO ABAIXO 
      EXEMPLO const resposta: any[] = await MetododaPastaServicoQueVoceCriou(Number(aplicacaoSelecionada?.value),Number(componenteSelecionado?.value),Number(anoSelecionado?.value));*/
      const retorno = [
        {
          value: '0',
          label: 'Todas',
        },
      ];
      setSelectItemLista(retorno);
    } catch (error) {
      console.log(error);
    }
  };

  const buscaDadosTabela = async () => {
    try {
      const codigoItem: string = selectItemSelecionado?.value?.toString();
      const resposta: PaginacaoDto<ItemListagemDto> = await itemService.obterListaItens({
        codigoItem: codigoItem,
        pagina: pagina,
        tamanhoPagina: ITENS_POR_PAGINA,
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
    const obj: AntDesignDto = {
      label: option.label,
      value: value,
    };
    setSelectItemSelecionado(obj);
  };

  const tabelaItemClick = (id: string) => {
    setCodigoItemTabelaSelecionado(id);
  };

  const versoes: VersaoDto[] = [
    { id: 1, codigoItem: '_LPT_EF4_SAEB_00', versaoItem: 1, dataCriacao: '05/10/2025', provas: [] },
    { id: 2, codigoItem: '_LPT_EF4_SAEB_00', versaoItem: 2, dataCriacao: '30/11/2020', provas: [] },
  ];

  return (
    <div className='listagem-pagina'>
      <div className='cadastrarItemHeader'>
        <Row className='cadastrarItemHeader-corpo'>
          <Col xs={12} md={6}>
            <Link to={linkRetorno} className='cadastrarItemHeader-retornar'>
              <ArrowLeftOutlined className='cadastrarItemHeader-icone-retornar' />
              <span className='cadastrarItemHeader-texto-retornar'>Retornar à tela inicial</span>
            </Link>
          </Col>
          <Col xs={12} md={12} className='cadastrarItemHeader-titulo'>
            Cadastrar novo item
          </Col>
          <Col xs={0} md={6} />
        </Row>
        <div className='cadastrarItemHeader-rota'>
          <div className='cadastrarItemHeader-rota-texto'>Home / Itens / Cadastrar novo item</div>
          <div className='cadastrarItemHeader-rota-titulo'>Cadastrar novo item</div>
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
          itemSelecionado={selectItemSelecionado}
          selecionaItemOnChange={selecionaItemOnChange}
        ></ListagemSelectComponent>
      </div>

      <div className='listagem-conteudo'>
        <div className='listagem-conteudo-esquerda'>
          <ListagemTabela
            dados={tabelaItens}
            pagina={pagina}
            totalRegistros={totalRegistros}
            setPagina={setPagina}
            ITENS_POR_PAGINA={ITENS_POR_PAGINA}
            onItemClick={tabelaItemClick}
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
