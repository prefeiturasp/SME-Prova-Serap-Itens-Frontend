import React, { useCallback } from "react";
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

interface FiltroNovoProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    // codigoItem: string;
    // filtroDados: Filtro;
}

const FiltroPrincipalNovoComponent: React.FC<FiltroNovoProps> = ({ open, setOpen, }) => {

    const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
    const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
    const [jaInicializado, setJaInicializado] = useState(false);

    const [formId] = useState(() => `filtro-lateral-${Date.now()}-${Math.random().toString(36)}`);
    const [formFiltroLateral] = Form.useForm();

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

                const resposta = await configuracaoItemService.obterDisciplinas(filtroLocal.areaConhecimento);
                if (resposta?.length) {
                    setListaDisciplinas(resposta);
                    if (resposta.length === 1) {
                        formFiltroLateral?.setFieldValue(CamposFiltroItens.disciplinaFiltro, resposta[0].value);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            if (filtroLocal.disciplinaFiltro) {
                formFiltroLateral?.setFieldValue(CamposFiltroItens.disciplinaFiltro, filtroLocal.diciplinaFiltro);

                // const [respostaMatriz, respostaAssuntos] = await Promise.all([
                //     configuracaoItemService.obterMatriz(filtroLocal.disciplina),
                //     configuracaoItemService.obterAssuntos(filtroLocal.disciplina)
                // ]);

                // Matriz
                // if (respostaMatriz?.length) {
                //     setListaMatriz(respostaMatriz);
                //     if (respostaMatriz.length === 1) {
                //         formFiltroLateral?.setFieldValue(CamposFiltroItens.matriz, respostaMatriz[0].value);
                //     }
                // }

                // Assuntos
                // if (respostaAssuntos?.length) {
                //     setListaAssuntos(respostaAssuntos);
                //     if (respostaAssuntos.length === 1) {
                //         formFiltroLateral?.setFieldValue(CamposFiltroItens.assunto, respostaAssuntos[0].value);
                //     }
                // }

                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // 3️⃣ Matriz → carrega anos + competências
            // if (filtroLocal.matriz) {
            //     form?.setFieldValue(Campos.matriz, filtroLocal.matriz);

            //     const [respostaAnos, respostaCompetencias] = await Promise.all([
            //         configuracaoItemService.obterAnosMatriz(filtroLocal.matriz),
            //         configuracaoItemService.obterCompetenciasMatriz(filtroLocal.matriz)
            //     ]);

            //     // Anos da matriz
            //     if (respostaAnos?.length) {
            //         setListaAnosMatriz(respostaAnos);
            //         if (respostaAnos.length === 1) {
            //             form?.setFieldValue(Campos.anoMatriz, respostaAnos[0].value);
            //         }
            //     }

            //     // Competências
            //     if (respostaCompetencias?.length) {
            //         setListaCompetencias(respostaCompetencias);
            //         if (respostaCompetencias.length === 1) {
            //             form?.setFieldValue(Campos.competencia, respostaCompetencias[0].value);
            //         }
            //     }

            //     await new Promise(resolve => setTimeout(resolve, 300));
            // }

            // 4️⃣ Ano da matriz (se ainda não foi definido)
            // if (filtroLocal.anoMatriz && form?.getFieldValue(Campos.anoMatriz) !== filtroLocal.anoMatriz) {
            //     form?.setFieldValue(Campos.anoMatriz, filtroLocal.anoMatriz);
            //     await new Promise(resolve => setTimeout(resolve, 200));
            // }

            // 5️⃣ Competência → carrega habilidades
            // if (filtroLocal.competencia) {
            //     form?.setFieldValue(Campos.competencia, filtroLocal.competencia);

            //     const resposta = await configuracaoItemService.obterHabilidadesCompetencia(filtroLocal.competencia);
            //     if (resposta?.length) {
            //         setListaHabilidades(resposta);
            //         if (resposta.length === 1) {
            //             form?.setFieldValue(Campos.habilidade, resposta[0].value);
            //         }
            //     }

            //     await new Promise(resolve => setTimeout(resolve, 300));
            // }

            // 6️⃣ Assunto → carrega subassuntos
            // if (filtroLocal.assunto) {
            //     form?.setFieldValue(Campos.assunto, filtroLocal.assunto);

            //     const resposta = await configuracaoItemService.obterSubAssuntos(filtroLocal.assunto);
            //     if (resposta?.length) {
            //         setListaSubAssuntos(resposta);
            //         if (resposta.length === 1) {
            //             form?.setFieldValue(Campos.subAssunto, resposta[0].value);
            //         }
            //     }

            //     await new Promise(resolve => setTimeout(resolve, 300));
            // }

            // 7️⃣ Finalização - campos que não têm cascata

            // if (filtroLocal.habilidade) {
            //     form?.setFieldValue(Campos.habilidade, filtroLocal.habilidade);
            // }

            // if (filtroLocal.subAssunto) {
            //     form?.setFieldValue(Campos.subAssunto, filtroLocal.subAssunto);
            // }

            // Campos simples (sem cascata)
            // const camposSimples = {
            //     situacaoItem: Campos.situacaoItem,
            //     tipoItem: Campos.tipoItem,
            //     quantidadeAlternativas: Campos.quantidadeAlternativas,
            //     dificuldadeSugerida: Campos.dificuldadeSugerida,
            //     nivelItem: Campos.nivelItem,
            //     discriminacao: Campos.discriminacao,
            //     dificuldade: Campos.dificuldade,
            //     acertoCasual: Campos.acertoCasual,
            //     palavrasChave: Campos.palavraChave,
            //     parametroBTransformado: Campos.parametroBTransformado,
            //     mediaDesvioPadrao: Campos.mediaDesvioPadrao,
            //     sentencaDescritora: Campos.sentencaDescritora,
            //     observacao: Campos.observacao,
            // };

            // Object.keys(camposSimples).forEach(key => {
            //     const value = filtroLocal[key];
            //     const formFieldName = (camposSimples as any)[key];
            //     if (value !== undefined && value !== null && formFieldName) {
            //         form?.setFieldValue(formFieldName, value);
            //     }
            // });

            // Palavras-chave (tratamento especial)
            // if (filtroLocal.palavrasChave && Array.isArray(filtroLocal.palavrasChave)) {
            //     setPalavrasChave(filtroLocal.palavrasChave);
            //     form?.setFieldValue(Campos.palavraChave, filtroLocal.palavrasChave);
            // }

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
                //carregarListasBasicas()
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

        //Limpa campos dependentes
        formFiltroLateral.setFieldValue(CamposFiltroItens.disciplinaFiltro, null);
        // formFiltroLateral.setFieldValue(CamposFiltroItens.anoMatrizFiltro, null);
        // formFiltroLateral.setFieldValue(CamposFiltroItens.categoriaItemFiltro, null);
        // formFiltroLateral.setFieldValue(CamposFiltroItens.dificuldadeSugeridaFiltro, null);        
        // formFiltroLateral.setFieldValue(CamposFiltroItens.situacaoItemFiltro, null);
        // formFiltroLateral.setFieldValue(CamposFiltroItens.matrizFiltro, null);
        // formFiltroLateral.setFieldValue(CamposFiltroItens.competenciaFiltro, null);
        // formFiltroLateral.setFieldValue(CamposFiltroItens.habilidadeFiltro, null);        
        // formFiltroLateral.setFieldValue(CamposFiltroItens.informacoesEstatisticasFiltro, null);        
        // formFiltroLateral.setFieldValue(CamposFiltroItens.palavraChaveFiltro, null);

        // Limpa listas dependentes
        setListaDisciplinas([]);
        // setListaMatriz([]);
        // setListaAnosMatriz([]);
        // setListaCompetencias([]);
        // setListaHabilidades([]);

        // Carrega disciplinas se área selecionada
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

        // Limpa campos dependentes
        formFiltroLateral.setFieldValue(CamposFiltroItens.matrizFiltro, null);
        // formFiltroLateral.setFieldValue(CamposFiltroItens.anoMatrizFiltro, null);
        // formFiltroLateral.setFieldValue(CamposFiltroItens.competenciaFiltro, null);
        // formFiltroLateral.setFieldValue(CamposFiltroItens.habilidadeFiltro, null);

        // Limpa listas dependentes
        // setListaMatriz([]);
        // setListaAnosMatriz([]);
        // setListaCompetencias([]);
        // setListaHabilidades([]);
        // setListaAssuntos([]);
        // setListaSubAssuntos([]);

        if (value && !validarCampoForm(value)) {
            const [respostaMatriz, respostaAssuntos] = await Promise.all([
                configuracaoItemService.obterMatriz(value),
                configuracaoItemService.obterAssuntos(value)
            ]);

            // if (respostaMatriz?.length) {
            //     setListaMatriz(respostaMatriz);
            //     if (respostaMatriz.length === 1) {
            //         form?.setFieldValue(CamposFiltroItens.matrizFiltro, respostaMatriz[0].value);
            //     }
            // } else {
            //     setListaMatriz([]);
            // }

            // Assuntos
            //   if (respostaAssuntos?.length) {
            //     setListaAssuntos(respostaAssuntos);
            //     if (respostaAssuntos.length === 1) {
            //       form?.setFieldValue(CamposFiltroItens.assunto, respostaAssuntos[0].value);
            //     }
            //   } else {
            //     setListaAssuntos([]);
            //   }
        }
    };

    const handleApplyFilters = () => {
        const values = formFiltroLateral.getFieldsValue(true);

        // let palavrasChaveArray: string[] | null = null;
        // if (values?.palavraChave) {
        //     if (Array.isArray(values.palavraChave)) {
        //         const palavrasValidas = values.palavraChave.filter((p: string) => p && p.trim());
        //         palavrasChaveArray = palavrasValidas.length > 0 ? palavrasValidas : null;
        //     } else if (typeof values.palavraChave === 'string' && values.palavraChave.trim()) {
        //         palavrasChaveArray = values.palavraChave.includes(';')
        //             ? values.palavraChave.split(';').filter((p: string) => p && p.trim()).map((p: string) => p.trim())
        //             : [values.palavraChave.trim()];
        //     }
        // }

        const filtroDto: CamposFiltroItensProps = {
            areaConhecimentoFiltro: values.areaConhecimentoFiltro || null,
            disciplinaFiltro: values.disciplinaFiltro || null,
        }
        console.log('Aplicar filtros:', filtroDto);

        const itemFiltro = localStorage.getItem('itemFiltro');
        const itemFiltroAtualizado = JSON.parse(itemFiltro || '{}');
        itemFiltroAtualizado.filtroLateral = filtroDto;
        localStorage.setItem('itemFiltro', JSON.stringify(itemFiltroAtualizado));

        // const consoleLog = localStorage.getItem('itemFiltro');
        // console.log('itemFiltro atualizado no localStorage:', consoleLog);

        setOpen(false);
    };

    const handleResetFilters = () => {
        //Desenvolver lógica de reset dos filtros
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