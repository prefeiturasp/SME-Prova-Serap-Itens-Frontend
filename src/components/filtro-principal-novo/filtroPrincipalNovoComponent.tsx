import React from "react";
import {
    Button,
    Divider,
    Drawer,
    Form,
    Space,
} from "antd";
import { useEffect, useState } from "react";
import "./filtroPrincipalNovoComponent.css";
import SelectForm from "../select-form";
import { CamposFiltroItens } from "~/domain/enums/campos-filtro-itens";
import { SelectValueType } from "~/domain/type/select";
import { DefaultOptionType } from 'antd/lib/select';
import { validarCampoForm } from "~/utils/funcoes";
import configuracaoItemService from "~/services/configuracaoItem-service";
import { CamposFiltroItensProps } from "~/domain/interfaces/camposFiltroItensProps";
import InputTag from "../input-tag";

interface FiltroNovoProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    // codigoItem: string;
    // filtroDados: Filtro;
}



const FiltroPrincipalNovoComponent: React.FC<FiltroNovoProps> = ({ open, setOpen, }) => {

    const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
    const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
    const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);
    const [listaAnosMatriz, setListaAnosMatriz] = useState<DefaultOptionType[]>([]);
    const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
    const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);
    const [listaQuantidadeAlternativas, setListaQuantidadeAlternativas] = useState<DefaultOptionType[]>([]);
    const [listaSituacoesItem, setListaSituacoesItem] = useState<DefaultOptionType[]>([]);
    const [palavraChaveFiltro, setPalavraChaveFiltro] = useState<string[] | undefined>([]);
    const [listaDificuldadeSugerida, setListaDificuldadeSugerida] = useState<DefaultOptionType[]>([]);
    const [listaInformacoesEstatisticas, setListaInformacoesEstatisticas] = useState<DefaultOptionType[]>([]);

    
    const [jaInicializado, setJaInicializado] = useState(false);

    const [formId] = useState(() => `filtro-lateral-${Date.now()}-${Math.random().toString(36)}`);
    const [formFiltroLateral] = Form.useForm();

    const infoEsta = [
            {
                descricao: "contém informações",
                label: "contém informações",
                valor: 'true',
                value: 'true'
            },
            {
                descricao: "não contém informações",
                label: "não contém informações",
                valor: 'false',
                value: 'false'
            }
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
                formFiltroLateral?.setFieldValue(CamposFiltroItens.areaConhecimentoFiltro, filtroLocal.areaConhecimentoFiltro);

                const resposta = await configuracaoItemService.obterDisciplinas(filtroLocal.areaConhecimentoFiltro);
                if (resposta?.length) {
                    setListaDisciplinas(resposta);
                    if (resposta.length === 1) {
                        formFiltroLateral?.setFieldValue(CamposFiltroItens.disciplinaFiltro, resposta[0].value);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            if (filtroLocal.disciplinaFiltro) {
                formFiltroLateral?.setFieldValue(CamposFiltroItens.disciplinaFiltro, filtroLocal.disciplinaFiltro);

                const respostaMatriz = await configuracaoItemService.obterMatriz(filtroLocal.disciplinaFiltro)

                if (respostaMatriz?.length) {
                    setListaMatriz(respostaMatriz);
                    if (respostaMatriz.length === 1) {
                        formFiltroLateral?.setFieldValue(CamposFiltroItens.matrizFiltro, respostaMatriz[0].value);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }


            if (filtroLocal.matrizFiltro) {
                formFiltroLateral?.setFieldValue(CamposFiltroItens.matrizFiltro, filtroLocal.matrizFiltro);

                const [respostaAnos, respostaCompetencias] = await Promise.all([
                    configuracaoItemService.obterAnosMatriz(filtroLocal.matrizFiltro),
                    configuracaoItemService.obterCompetenciasMatriz(filtroLocal.matrizFiltro)
                ]);

                if (respostaAnos?.length) {
                    setListaAnosMatriz(respostaAnos);
                    if (respostaAnos.length === 1) {
                        formFiltroLateral?.setFieldValue(CamposFiltroItens.anoMatrizFiltro, respostaAnos[0].value);
                    }
                }

                if (respostaCompetencias?.length) {
                    setListaCompetencias(respostaCompetencias);
                    if (respostaCompetencias.length === 1) {
                        formFiltroLateral?.setFieldValue(CamposFiltroItens.competenciaFiltro, respostaCompetencias[0].value);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            if (filtroLocal.anoMatrizFiltro && formFiltroLateral?.getFieldValue(CamposFiltroItens.anoMatrizFiltro) !== filtroLocal.anoMatrizFiltro) {
                formFiltroLateral?.setFieldValue(CamposFiltroItens.anoMatrizFiltro, filtroLocal.anoMatrizFiltro);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (filtroLocal.competenciaFiltro) {
                formFiltroLateral?.setFieldValue(CamposFiltroItens.competenciaFiltro, filtroLocal.competenciaFiltro);

                const resposta = await configuracaoItemService.obterHabilidadesCompetencia(filtroLocal.competenciaFiltro);
                if (resposta?.length) {
                    setListaHabilidades(resposta);
                    if (resposta.length === 1) {
                        formFiltroLateral?.setFieldValue(CamposFiltroItens.habilidadeFiltro, resposta[0].value);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            if (filtroLocal.habilidadeFiltro) {
                formFiltroLateral?.setFieldValue(CamposFiltroItens.habilidadeFiltro, filtroLocal.habilidadeFiltro);
            }

            const camposSimples = {
                situacaoItemFiltro: CamposFiltroItens.situacaoItemFiltro,
                categoriaItemFiltro: CamposFiltroItens.categoriaItemFiltro,
                dificuldadeSugeridaFiltro: CamposFiltroItens.dificuldadeSugeridaFiltro,
                palavraChaveFiltro: CamposFiltroItens.palavraChaveFiltro,
                informacoesEstatisticasFiltro: CamposFiltroItens.informacoesEstatisticasFiltro,
            };

            Object.keys(camposSimples).forEach(key => {
                const value = filtroLocal[key];
                const formFieldName = (camposSimples as any)[key];
                if (value !== undefined && value !== null && formFieldName) {
                    formFiltroLateral?.setFieldValue(formFieldName, value);
                }
            });

            if (filtroLocal.palavraChaveFiltro && Array.isArray(filtroLocal.palavraChaveFiltro)) {
                setPalavraChaveFiltro(filtroLocal.palavraChaveFiltro);
                formFiltroLateral?.setFieldValue(CamposFiltroItens.palavraChaveFiltro, filtroLocal.palavraChaveFiltro);
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

            await Promise.all([
                carregarAreaConhecimento(),
                carregarListasBasicas()
            ]);

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
                const formularioVazio = !valores ||
                    Object.keys(valores || {}).length === 0 ||
                    Object.values(valores || {}).every(v => !v || (Array.isArray(v) && v?.length === 0));

                if (formularioVazio) {
                    formFiltroLateral.resetFields();
                    const fieldKeys = Object.keys(formFiltroLateral.getFieldsValue() || {});
                    if (fieldKeys?.length > 0) {
                        formFiltroLateral.setFields(fieldKeys.map(name => ({
                            name,
                            errors: []
                        })));
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
                configuracaoItemService.obterCompetenciasMatriz(value)
            ]);

            if (respostaAnos?.length) {
                setListaAnosMatriz(respostaAnos);
                if (respostaAnos.length === 1) {
                    formFiltroLateral?.setFieldValue(CamposFiltroItens.anoMatrizFiltro, respostaAnos[0].value);
                }
            }

            if (respostaCompetencias?.length) {
                setListaCompetencias(respostaCompetencias);
                if (respostaCompetencias.length === 1) {
                    formFiltroLateral?.setFieldValue(CamposFiltroItens.competenciaFiltro, respostaCompetencias[0].value);
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
            } else if (typeof values.palavraChaveFiltro === 'string' && values.palavraChaveFiltro.trim()) {
                palavrasChaveArray = values.palavraChaveFiltro.includes(';')
                    ? values.palavraChaveFiltro.split(';').filter((p: string) => p && p.trim()).map((p: string) => p.trim())
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
        }
        console.log('Aplicar filtros:', filtroDto);

        const itemFiltro = localStorage.getItem('itemFiltro');
        const itemFiltroAtualizado = JSON.parse(itemFiltro || '{}');
        itemFiltroAtualizado.filtroLateral = filtroDto;
        localStorage.setItem('itemFiltro', JSON.stringify(itemFiltroAtualizado));

        
        setOpen(false);
    };

    const handleResetFilters = () => {
        localStorage.removeItem('itemFiltro');
        setOpen(false);
    }

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
                title="Filtrar"
                placement="right"
                width={400}
                open={open}
                onClose={handleClose}
                destroyOnClose={false}
            >
                <Form.Provider>
                    <Form form={formFiltroLateral}
                        layout="vertical"
                        id={formId}
                        name={formId}
                        preserve={false}
                    >
                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Area Conhecimento</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaAreaConhecimento}
                                nomeCampo={CamposFiltroItens.areaConhecimentoFiltro}
                                label="Área de conhecimento"
                                campoObrigatorio={true}
                                disabled={false}
                                onChange={handleAreaConhecimentoChange}
                            />
                        </div>

                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Disciplina</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaDisciplinas}
                                nomeCampo={CamposFiltroItens.disciplinaFiltro}
                                label="Componente curricular"
                                campoObrigatorio={true}
                                onChange={handleDisciplinaChange}
                            />
                        </div>

                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Matriz</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaMatriz}
                                nomeCampo={CamposFiltroItens.matrizFiltro}
                                label="Matriz de avaliação"
                                campoObrigatorio={true}
                                onChange={handleMatrizChange}
                            />
                        </div>
                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Ano</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaAnosMatriz}
                                nomeCampo={CamposFiltroItens.anoMatrizFiltro}
                                label="Ano (ano escolar)"
                                campoObrigatorio={true}
                            />
                        </div>
                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Competencia</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaCompetencias}
                                nomeCampo={CamposFiltroItens.competenciaFiltro}
                                label="Competência"
                                campoObrigatorio={true}
                                onChange={handleCompetenciaChange}
                            />
                        </div>
                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Habilidade</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaHabilidades}
                                nomeCampo={CamposFiltroItens.habilidadeFiltro}
                                label="Habilidade"
                                campoObrigatorio={true}
                            />
                        </div>
                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Quantidade</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaQuantidadeAlternativas}
                                nomeCampo={CamposFiltroItens.categoriaItemFiltro}
                                label="Categoria do item e quantidade de alternativas*"
                                campoObrigatorio={true}
                                labelInValue={false}
                            />
                        </div>
                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Dificuldade Sugerida</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaDificuldadeSugerida}
                                nomeCampo={CamposFiltroItens.dificuldadeSugeridaFiltro}
                                label="Dificuldade Sugerida"
                                campoObrigatorio={true}
                                labelInValue={false}
                            />
                        </div>
                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Situação</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaSituacoesItem}
                                nomeCampo={CamposFiltroItens.situacaoItemFiltro}
                                label="Situação do item"
                                campoObrigatorio={true}
                                labelInValue={false}
                            />
                        </div>

                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Informações estatisticas</h3>
                            <SelectForm
                                form={formFiltroLateral}
                                options={listaInformacoesEstatisticas}
                                nomeCampo={CamposFiltroItens.informacoesEstatisticasFiltro}
                                label="Informações Estatísticas"
                                campoObrigatorio={true}
                                labelInValue={false}
                            />
                        </div>

                        <Divider className="separador" />
                        <div className="filtro-secao">
                            <h3 className="filtro-titulo">Palavra Chave</h3>
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
                                        formFiltroLateral?.setFieldValue(CamposFiltroItens.palavraChaveFiltro, novasTags);
                                    }}
                                />
                            </Form.Item>
                            <div className="caracteristicasItemTexto">
                                <p>Digite uma palavra e pressione "Enter" para adicioná-la.</p>
                            </div>

                        </div>

                        <Divider className="separador" />
                        <Space size="small" wrap>
                            <Button className="botao-remover" onClick={handleResetFilters}>
                                Remover Filtros
                            </Button>
                            <Button
                                type="primary"
                                className="botao-filtrar"
                                onClick={handleApplyFilters}
                            >
                                Filtrar
                            </Button>
                        </Space>
                    </Form>
                </Form.Provider>
            </Drawer>
        </>
    )
};

export default FiltroPrincipalNovoComponent;