import React from 'react';
import { Button, Drawer, Form } from 'antd';
import { useEffect, useState } from 'react';
import './filtroPrincipalNovoComponent.css';
import SelectForm from '../select-form';
import { CamposFiltroItens } from '~/domain/enums/campos-filtro-itens';
import { SelectValueType } from '~/domain/type/select';
import { DefaultOptionType } from 'antd/lib/select';
import { validarCampoForm } from '~/utils/funcoes';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { CamposFiltroItensProps } from '~/domain/interfaces/camposFiltroItensProps';
import InputTag from '../input-tag';
import { ArrowRightOutlined } from '@ant-design/icons';

interface FiltroNovoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  // codigoItem: string;
  // filtroDados: Filtro;
}

const FiltroPrincipalNovoComponent: React.FC<FiltroNovoProps> = ({ open, setOpen }) => {
  const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
  const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
  const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);
  const [listaAnosMatriz, setListaAnosMatriz] = useState<DefaultOptionType[]>([]);
  const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
  const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);
  const [listaQuantidadeAlternativas, setListaQuantidadeAlternativas] = useState<
    DefaultOptionType[]
  >([]);
  const [listaSituacoesItem, setListaSituacoesItem] = useState<DefaultOptionType[]>([]);
  const [palavraChaveFiltro, setPalavraChaveFiltro] = useState<string[] | undefined>([]);
  const [listaDificuldadeSugerida, setListaDificuldadeSugerida] = useState<DefaultOptionType[]>([]);
  const [listaInformacoesEstatisticas, setListaInformacoesEstatisticas] = useState<
    DefaultOptionType[]
  >([]);

  const [jaInicializado, setJaInicializado] = useState(false);

  const [formId] = useState(() => `filtro-lateral-${Date.now()}-${Math.random().toString(36)}`);
  const [formFiltroLateral] = Form.useForm();

  const infoEsta = [
    {
      descricao: 'contém informações',
      label: 'Contém informações',
      valor: 'true',
      value: 'true',
    },
    {
      descricao: 'não contém informações',
      label: 'Não contém informações',
      valor: 'false',
      value: 'false',
    },
  ];

  const carregarAreaConhecimento = async () => {
    const resposta = await configuracaoItemService.obterAreaConhecimento();
    setListaAreaConhecimento(resposta?.length ? resposta : []);
  };

  const executarCascataAutomatica = async (itemFiltro: string) => {
    //setCarregando?.(true);
    try {
      const itemSalvo = JSON.parse(itemFiltro);
      const filtroLocal = itemSalvo.filtroLateral;
      if (!filtroLocal) {
        return;
      }

      if (filtroLocal.areaConhecimentoFiltro) {
        formFiltroLateral?.setFieldValue(
          CamposFiltroItens.areaConhecimentoFiltro,
          filtroLocal.areaConhecimentoFiltro,
        );

        const resposta = await configuracaoItemService.obterDisciplinas(
          filtroLocal.areaConhecimentoFiltro,
        );
        if (resposta?.length) {
          setListaDisciplinas(resposta);
          if (resposta.length === 1) {
            formFiltroLateral?.setFieldValue(CamposFiltroItens.disciplinaFiltro, resposta[0].value);
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (filtroLocal.disciplinaFiltro) {
        formFiltroLateral?.setFieldValue(
          CamposFiltroItens.disciplinaFiltro,
          filtroLocal.disciplinaFiltro,
        );

        const respostaMatriz = await configuracaoItemService.obterMatriz(
          filtroLocal.disciplinaFiltro,
        );

        if (respostaMatriz?.length) {
          setListaMatriz(respostaMatriz);
          if (respostaMatriz.length === 1) {
            formFiltroLateral?.setFieldValue(
              CamposFiltroItens.matrizFiltro,
              respostaMatriz[0].value,
            );
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (filtroLocal.matrizFiltro) {
        formFiltroLateral?.setFieldValue(CamposFiltroItens.matrizFiltro, filtroLocal.matrizFiltro);

        const [respostaAnos, respostaCompetencias] = await Promise.all([
          configuracaoItemService.obterAnosMatriz(filtroLocal.matrizFiltro),
          configuracaoItemService.obterCompetenciasMatriz(filtroLocal.matrizFiltro),
        ]);

        if (respostaAnos?.length) {
          setListaAnosMatriz(respostaAnos);
          if (respostaAnos.length === 1) {
            formFiltroLateral?.setFieldValue(
              CamposFiltroItens.anoMatrizFiltro,
              respostaAnos[0].value,
            );
          }
        }

        if (respostaCompetencias?.length) {
          setListaCompetencias(respostaCompetencias);
          if (respostaCompetencias.length === 1) {
            formFiltroLateral?.setFieldValue(
              CamposFiltroItens.competenciaFiltro,
              respostaCompetencias[0].value,
            );
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (
        filtroLocal.anoMatrizFiltro &&
        formFiltroLateral?.getFieldValue(CamposFiltroItens.anoMatrizFiltro) !==
        filtroLocal.anoMatrizFiltro
      ) {
        formFiltroLateral?.setFieldValue(
          CamposFiltroItens.anoMatrizFiltro,
          filtroLocal.anoMatrizFiltro,
        );
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (filtroLocal.competenciaFiltro) {
        formFiltroLateral?.setFieldValue(
          CamposFiltroItens.competenciaFiltro,
          filtroLocal.competenciaFiltro,
        );

        const resposta = await configuracaoItemService.obterHabilidadesCompetencia(
          filtroLocal.competenciaFiltro,
        );
        if (resposta?.length) {
          setListaHabilidades(resposta);
          if (resposta.length === 1) {
            formFiltroLateral?.setFieldValue(CamposFiltroItens.habilidadeFiltro, resposta[0].value);
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (filtroLocal.habilidadeFiltro) {
        formFiltroLateral?.setFieldValue(
          CamposFiltroItens.habilidadeFiltro,
          filtroLocal.habilidadeFiltro,
        );
      }

      const camposSimples = {
        situacaoItemFiltro: CamposFiltroItens.situacaoItemFiltro,
        categoriaItemFiltro: CamposFiltroItens.categoriaItemFiltro,
        dificuldadeSugeridaFiltro: CamposFiltroItens.dificuldadeSugeridaFiltro,
        palavraChaveFiltro: CamposFiltroItens.palavraChaveFiltro,
        informacoesEstatisticasFiltro: CamposFiltroItens.informacoesEstatisticasFiltro,
      };

      Object.keys(camposSimples).forEach((key) => {
        const value = filtroLocal[key];
        const formFieldName = (camposSimples as any)[key];
        if (value !== undefined && value !== null && formFieldName) {
          formFiltroLateral?.setFieldValue(formFieldName, value);
        }
      });

      if (filtroLocal.palavraChaveFiltro && Array.isArray(filtroLocal.palavraChaveFiltro)) {
        setPalavraChaveFiltro(filtroLocal.palavraChaveFiltro);
        formFiltroLateral?.setFieldValue(
          CamposFiltroItens.palavraChaveFiltro,
          filtroLocal.palavraChaveFiltro,
        );
      }
    } catch (error) {
      console.error('❌ Erro na cascata automática:', error);
    } finally {
      //setCarregando?.(false);
    }
  };

  useEffect(() => {
    if (!open || jaInicializado) return;

    const inicializarFormulario = async () => {
      setJaInicializado(true);

      await Promise.all([carregarAreaConhecimento(), carregarListasBasicas()]);

      const pegandoFiltro = localStorage.getItem('itemFiltro');
      if (pegandoFiltro) {
        setTimeout(() => {
          executarCascataAutomatica(pegandoFiltro);
        }, 500);
        return;
      }

      setTimeout(() => {
        if (!formFiltroLateral) {
          return;
        }
        const valores = formFiltroLateral.getFieldsValue();
        const formularioVazio =
          !valores ||
          Object.keys(valores || {}).length === 0 ||
          Object.values(valores || {}).every((v) => !v || (Array.isArray(v) && v?.length === 0));

        if (formularioVazio) {
          formFiltroLateral.resetFields();
          const fieldKeys = Object.keys(formFiltroLateral.getFieldsValue() || {});
          if (fieldKeys?.length > 0) {
            formFiltroLateral.setFields(
              fieldKeys.map((name) => ({
                name,
                errors: [],
              })),
            );
          }
        }
      }, 500);
    };

    inicializarFormulario();
  }, [open, jaInicializado]);

  const handleAreaConhecimentoChange = async (value: SelectValueType) => {
    if (!formFiltroLateral) {
      return;
    }

    formFiltroLateral.setFieldValue(CamposFiltroItens.disciplinaFiltro, null);
    formFiltroLateral.setFieldValue(CamposFiltroItens.matrizFiltro, null);
    formFiltroLateral.setFieldValue(CamposFiltroItens.anoMatrizFiltro, null);
    formFiltroLateral.setFieldValue(CamposFiltroItens.competenciaFiltro, null);
    formFiltroLateral.setFieldValue(CamposFiltroItens.habilidadeFiltro, null);

    setListaDisciplinas([]);
    setListaMatriz([]);
    setListaAnosMatriz([]);
    setListaCompetencias([]);
    setListaHabilidades([]);

    if (value && !validarCampoForm(value)) {
      const resposta = await configuracaoItemService.obterDisciplinas(value);
      if (resposta?.length) {
        setListaDisciplinas(resposta);
        if (resposta?.length === 1 && formFiltroLateral) {
          formFiltroLateral.setFieldValue(CamposFiltroItens.disciplinaFiltro, resposta[0].value);
        }
      } else {
        setListaDisciplinas([]);
      }
    }
  };

  const handleDisciplinaChange = async (value: SelectValueType) => {
    if (!formFiltroLateral) {
      return;
    }

    formFiltroLateral.setFieldValue(CamposFiltroItens.matrizFiltro, null);
    formFiltroLateral.setFieldValue(CamposFiltroItens.anoMatrizFiltro, null);
    formFiltroLateral.setFieldValue(CamposFiltroItens.competenciaFiltro, null);
    formFiltroLateral.setFieldValue(CamposFiltroItens.habilidadeFiltro, null);

    setListaMatriz([]);
    setListaAnosMatriz([]);
    setListaCompetencias([]);
    setListaHabilidades([]);

    if (value && !validarCampoForm(value)) {
      const respostaMatriz = await configuracaoItemService.obterMatriz(value);

      if (respostaMatriz?.length) {
        setListaMatriz(respostaMatriz);
        if (respostaMatriz.length === 1) {
          formFiltroLateral?.setFieldValue(CamposFiltroItens.matrizFiltro, respostaMatriz[0].value);
        }
      } else {
        setListaMatriz([]);
      }
    }
  };

  const handleMatrizChange = async (value: SelectValueType) => {
    if (!formFiltroLateral) {
      return;
    }

    formFiltroLateral?.setFieldValue(CamposFiltroItens.anoMatrizFiltro, null);
    formFiltroLateral?.setFieldValue(CamposFiltroItens.competenciaFiltro, null);
    formFiltroLateral?.setFieldValue(CamposFiltroItens.habilidadeFiltro, null);

    setListaAnosMatriz([]);
    setListaCompetencias([]);
    setListaHabilidades([]);

    if (value && !validarCampoForm(value)) {
      const [respostaAnos, respostaCompetencias] = await Promise.all([
        configuracaoItemService.obterAnosMatriz(value),
        configuracaoItemService.obterCompetenciasMatriz(value),
      ]);

      if (respostaAnos?.length) {
        setListaAnosMatriz(respostaAnos);
        if (respostaAnos.length === 1) {
          formFiltroLateral?.setFieldValue(
            CamposFiltroItens.anoMatrizFiltro,
            respostaAnos[0].value,
          );
        }
      }

      if (respostaCompetencias?.length) {
        setListaCompetencias(respostaCompetencias);
        if (respostaCompetencias.length === 1) {
          formFiltroLateral?.setFieldValue(
            CamposFiltroItens.competenciaFiltro,
            respostaCompetencias[0].value,
          );
        }
      } else {
        setListaCompetencias([]);
      }
    }
  };

  const handleCompetenciaChange = async (value: SelectValueType) => {
    if (!formFiltroLateral) {
      return;
    }

    formFiltroLateral?.setFieldValue(CamposFiltroItens.habilidadeFiltro, null);
    setListaHabilidades([]);

    if (value && !validarCampoForm(value)) {
      const resposta = await configuracaoItemService.obterHabilidadesCompetencia(value);
      if (resposta?.length) {
        setListaHabilidades(resposta);
        if (resposta.length === 1) {
          formFiltroLateral?.setFieldValue(CamposFiltroItens.habilidadeFiltro, resposta[0].value);
        }
      } else {
        setListaHabilidades([]);
      }
    }
  };

  const carregarListasBasicas = async () => {
    // if (!formFiltroLateral) {
    //     return;
    // }
    const [quantidadeAlternativas, situacoesItem, dificuldadeSugerida] = await Promise.all([
      configuracaoItemService.obterQuantidadeAlternativas(),
      configuracaoItemService.obterSituacoesItem(),
      configuracaoItemService.obterDificuldadeSugerida(),
    ]);

    setListaQuantidadeAlternativas(quantidadeAlternativas?.length ? quantidadeAlternativas : []);
    setListaSituacoesItem(situacoesItem?.length ? situacoesItem : []);
    setListaDificuldadeSugerida(dificuldadeSugerida?.length ? dificuldadeSugerida : []);

    setListaInformacoesEstatisticas(infoEsta);
  };

  const handleApplyFilters = () => {
    const values = formFiltroLateral.getFieldsValue(true);

    let palavrasChaveArray: string[] | null = null;
    if (values?.palavraChaveFiltro) {
      if (Array.isArray(values.palavraChaveFiltro)) {
        const palavrasValidas = values.palavraChaveFiltro.filter((p: string) => p && p.trim());
        palavrasChaveArray = palavrasValidas.length > 0 ? palavrasValidas : null;
      } else if (
        typeof values.palavraChaveFiltro === 'string' &&
        values.palavraChaveFiltro.trim()
      ) {
        palavrasChaveArray = values.palavraChaveFiltro.includes(';')
          ? values.palavraChaveFiltro
            .split(';')
            .filter((p: string) => p && p.trim())
            .map((p: string) => p.trim())
          : [values.palavraChaveFiltro.trim()];
      }
    }

    const filtroDto: CamposFiltroItensProps = {
      areaConhecimentoFiltro: values.areaConhecimentoFiltro || null,
      disciplinaFiltro: values.disciplinaFiltro || null,
      matrizFiltro: values.matrizFiltro || null,
      anoMatrizFiltro: values.anoMatrizFiltro || null,
      competenciaFiltro: values.competenciaFiltro || null,
      habilidadeFiltro: values.habilidadeFiltro || null,
      categoriaItemFiltro: values.categoriaItemFiltro || null,
      situacaoItemFiltro: values.situacaoItemFiltro || null,
      dificuldadeSugeridaFiltro: values.dificuldadeSugeridaFiltro || null,
      informacoesEstatisticasFiltro: values.informacoesEstatisticasFiltro || null,
      palavraChaveFiltro: palavrasChaveArray,
    };

    const itemFiltro = localStorage.getItem('itemFiltro');
    const itemFiltroAtualizado = JSON.parse(itemFiltro || '{}');
    itemFiltroAtualizado.filtroLateral = filtroDto;
    localStorage.setItem('itemFiltro', JSON.stringify(itemFiltroAtualizado));

    setOpen(false);
  };

  const handleResetFilters = () => {
    localStorage.setItem('itemFiltro', JSON.stringify({})); // zera o conteúdo
    formFiltroLateral.resetFields();
  };

  useEffect(() => {
    if (open) {
      //setSelectedFilters(filtrosSelecionados);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title={
          <div className="drawer-title-custom">
            <svg className='drawer-icone-filtro' width="24" height="24" viewBox="0 0 24 24"
              fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 7C3.75 6.80109 3.82902 6.61032 3.96967 6.46967C4.11032 6.32902 4.30109 6.25 4.5 6.25H19.5C19.6989 6.25 19.8897 6.32902 20.0303 6.46967C20.171 6.61032 20.25 6.80109 20.25 7C20.25 7.19891 20.171 7.38968 20.0303 7.53033C19.8897 7.67098 19.6989 7.75 19.5 7.75H4.5C4.30109 7.75 4.11032 7.67098 3.96967 7.53033C3.82902 7.38968 3.75 7.19891 3.75 7ZM6.25 12C6.25 11.8011 6.32902 11.6103 6.46967 11.4697C6.61032 11.329 6.80109 11.25 7 11.25H17C17.1989 11.25 17.3897 11.329 17.5303 11.4697C17.671 11.6103 17.75 11.8011 17.75 12C17.75 12.1989 17.671 12.3897 17.5303 12.5303C17.3897 12.671 17.1989 12.75 17 12.75H7C6.80109 12.75 6.61032 12.671 6.46967 12.5303C6.32902 12.3897 6.25 12.1989 6.25 12ZM9.25 17C9.25 16.8011 9.32902 16.6103 9.46967 16.4697C9.61032 16.329 9.80109 16.25 10 16.25H14C14.1989 16.25 14.3897 16.329 14.5303 16.4697C14.671 16.6103 14.75 16.8011 14.75 17C14.75 17.1989 14.671 17.3897 14.5303 17.5303C14.3897 17.671 14.1989 17.75 14 17.75H10C9.80109 17.75 9.61032 17.671 9.46967 17.5303C9.32902 17.3897 9.25 17.1989 9.25 17Z" />
            </svg>
            FILTRAR
          </div>
        }
        extra={
          <div className="drawer-extra-content">
            <Button
              className='drawer-btn-sair'
              onClick={handleClose}
              style={{ cursor: 'pointer' }}
            >
              <ArrowRightOutlined className='drawer-seta-sair' />
            </Button>
          </div>
        }
        placement='right'
        width={400}
        open={open}
        closeIcon={false}
        destroyOnClose={false}
        maskClosable={true}
        onClose={handleClose}
        className='drawer-corpo'
      >
        <Form.Provider>
          <Form
            form={formFiltroLateral}
            layout='vertical'
            id={formId}
            name={formId}
            preserve={false}
          >

            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaAreaConhecimento}
                nomeCampo={CamposFiltroItens.areaConhecimentoFiltro}
                label='Área de conhecimento'
                campoObrigatorio={false}
                disabled={false}
                onChange={handleAreaConhecimentoChange}
              />
            </div>

            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaDisciplinas}
                nomeCampo={CamposFiltroItens.disciplinaFiltro}
                label='Componente curricular'
                campoObrigatorio={false}
                onChange={handleDisciplinaChange}
              />
            </div>

            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaMatriz}
                nomeCampo={CamposFiltroItens.matrizFiltro}
                label='Matriz de avaliação'
                campoObrigatorio={false}
                onChange={handleMatrizChange}
              />
            </div>

            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaAnosMatriz}
                nomeCampo={CamposFiltroItens.anoMatrizFiltro}
                label='Ano (ano escolar)'
                campoObrigatorio={false}
              />
            </div>

            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaCompetencias}
                nomeCampo={CamposFiltroItens.competenciaFiltro}
                label='Competência'
                campoObrigatorio={false}
                onChange={handleCompetenciaChange}
              />
            </div>

            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaHabilidades}
                nomeCampo={CamposFiltroItens.habilidadeFiltro}
                label='Habilidade'
                campoObrigatorio={false}
              />
            </div>

            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaQuantidadeAlternativas}
                nomeCampo={CamposFiltroItens.categoriaItemFiltro}
                label='Categoria do item e quantidade de alternativas*'
                campoObrigatorio={false}
                labelInValue={false}
              />
            </div>

            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaDificuldadeSugerida}
                nomeCampo={CamposFiltroItens.dificuldadeSugeridaFiltro}
                label='Dificuldade Sugerida'
                campoObrigatorio={false}
                labelInValue={false}
              />
            </div>
            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaSituacoesItem}
                nomeCampo={CamposFiltroItens.situacaoItemFiltro}
                label='Situação do item'
                campoObrigatorio={false}
                labelInValue={false}
              />
            </div>

            <div className='drawer-filtro-secao drawer-filtro-secao-margin'>
              <SelectForm
                form={formFiltroLateral}
                options={listaInformacoesEstatisticas}
                nomeCampo={CamposFiltroItens.informacoesEstatisticasFiltro}
                label='Informações Estatísticas'
                campoObrigatorio={false}
                labelInValue={false}
              />
            </div>

            <div className='drawer-filtro-secao'>
              <Form.Item
                label='Palavra-chave'
                name={CamposFiltroItens.palavraChaveFiltro}
                // Campo não obrigatório - sem validação obrigatória
                rules={[]}
              >
                <InputTag
                  valueForm={palavraChaveFiltro}
                  tags={palavraChaveFiltro}
                  setTags={(v) => {
                    const novasTags = v || [];
                    setPalavraChaveFiltro(novasTags);
                    formFiltroLateral?.setFieldValue(
                      CamposFiltroItens.palavraChaveFiltro,
                      novasTags,
                    );
                  }}
                />
              </Form.Item>
              <div className='drawer-texto-branco'>
                <p>Digite uma palavra e pressione "Enter" para adicioná-la.</p>
              </div>
            </div>
            <div className='drawer-footer-btns'>
              <div className='drawer-bt-remover'>
                <Button className='botao-remover' onClick={handleResetFilters}>
                  Remover Filtros
                </Button>
              </div>
              <div className='drawer-bt-filtrar'>
                <Button className='botao-filtrar' onClick={handleApplyFilters}>
                  Filtrar
                </Button>
              </div>
            </div>
          </Form>
        </Form.Provider>
      </Drawer>
    </>
  );
};

export default FiltroPrincipalNovoComponent;
