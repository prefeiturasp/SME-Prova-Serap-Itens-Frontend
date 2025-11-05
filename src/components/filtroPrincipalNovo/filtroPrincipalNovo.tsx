import {
    Button,
    Divider,
    Drawer,
    Form,
    Space,
} from "antd";
import { useEffect, useCallback, useState } from "react";
import "./filtroPrincipalNovo.css"
import SelectForm from "../select-form";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { SelectValueType } from "~/domain/type/select";
import { DefaultOptionType } from 'antd/lib/select';
import { validarCampoForm } from "~/utils/funcoes";
import configuracaoItemService from "~/services/configuracaoItem-service";


interface FiltroNovoProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    // codigoItem: string;
    // filtroDados: Filtro;
}

const FiltroPrincipalNovo: React.FC<FiltroNovoProps> = ({ open, setOpen, }) => {
    //const activeTab = useSelector((state: RootState) => state.tab.activeTab);
    //const filtrosSelecionados = useSelector((state: RootState) => state.filtros);
    //const dispatch = useDispatch();

    //const [selectedFilters, setSelectedFilters] = useState<Filtro>(filtrosSelecionados);
    // listas
    const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
    const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
    const [form] = Form.useForm();

    // ✅ useEffect - Carregamento inicial + Cascata Automática
      useEffect(() => {
        const inicializarFormulario = async () => {
          // 1️⃣ Carrega listas iniciais sempre
          await Promise.all([
            carregarAreaConhecimento(),
            //carregarListasBasicas()
          ]);
    
          // 2️⃣ Verifica se precisa executar cascata automática
        //   const voltandoParaPrimeiraTela = localStorage.getItem('voltandoParaPrimeiraTela') === 'true';
        //   const itemSalvoStr = localStorage.getItem('itemAtual');
    
        //   if (voltandoParaPrimeiraTela || itemSalvoStr) {
        //     console.log('🔄 Detectado dados no localStorage - executando cascata automática...');
        //     localStorage.removeItem('voltandoParaPrimeiraTela'); // Limpa flag
    
        //     // Aguarda um pouco para garantir que as listas iniciais foram carregadas
        //     setTimeout(() => {
        //       executarCascataAutomatica();
        //     }, 500);
    
        //     return; // Não faz reset se tem dados para carregar
        //   }
    
          // 3️⃣ Reset inteligente apenas se formulário vazio E sem dados no localStorage
          // Aguarda o componente estar totalmente renderizado
          setTimeout(() => {
            const valores = form?.getFieldsValue();
            const formularioVazio = !valores || Object.keys(valores).length === 0 ||
              Object.values(valores).every(v => !v || (Array.isArray(v) && v.length === 0));
      
            if (formularioVazio) {
              console.log('🧹 Formulário vazio - aplicando reset limpo...');
              form?.resetFields();
              form?.setFields(Object.keys(form?.getFieldsValue() || {}).map(name => ({
                name,
                errors: []
              })));
            }
          }, 100); // Aumentei para 100ms para garantir que o Form esteja conectado
        };
    
        inicializarFormulario();
      }, []); // Dependência da função de cascata removido(executarCascataAutomatica) 

    // Carrega Área de Conhecimento (inicial)
    const carregarAreaConhecimento = useCallback(async () => {
        const resposta = await configuracaoItemService.obterAreaConhecimento();
        setListaAreaConhecimento(resposta?.length ? resposta : []);
    }, []);

    // 1️⃣ Área → Disciplinas
    const handleAreaConhecimentoChange = useCallback(async (value: SelectValueType) => {
        // Garante que o form está conectado antes de fazer operações
        if (!form) {
            console.warn('⚠️ Form não está disponível ainda');
            return;
        }

        // Limpa campos dependentes
        form.setFieldValue(Campos.disciplinas, null);
        form.setFieldValue(Campos.matriz, null);
        form.setFieldValue(Campos.anoMatriz, null);
        form.setFieldValue(Campos.competencia, null);
        form.setFieldValue(Campos.habilidade, null);
        form.setFieldValue(Campos.assunto, null);
        form.setFieldValue(Campos.subAssunto, null);

        // Limpa listas dependentes
        setListaDisciplinas([]);
        // setListaMatriz([]);
        // setListaAnosMatriz([]);
        // setListaCompetencias([]);
        // setListaHabilidades([]);
        // setListaAssuntos([]);
        // setListaSubAssuntos([]);

        // Carrega disciplinas se área selecionada
        if (value && !validarCampoForm(value)) {
            const resposta = await configuracaoItemService.obterDisciplinas(value);
            if (resposta?.length) {
                setListaDisciplinas(resposta);
                if (resposta?.length === 1 && form) {
                    form.setFieldValue(Campos.disciplinas, resposta[0].value);
                }
            } else {
                setListaDisciplinas([]);
            }
        }
    }, [form]);

    // 2️⃣ Disciplina → Matriz + Assuntos
    const handleDisciplinaChange = useCallback(async (value: SelectValueType) => {
        // Garante que o form está conectado
        if (!form) {
            console.warn('⚠️ Form não está disponível ainda');
            return;
        }

        // Limpa campos dependentes
        form.setFieldValue(Campos.matriz, null);
        form.setFieldValue(Campos.anoMatriz, null);
        form.setFieldValue(Campos.competencia, null);
        form.setFieldValue(Campos.habilidade, null);
        form.setFieldValue(Campos.assunto, null);
        form.setFieldValue(Campos.subAssunto, null);

        // Limpa listas dependentes
        // setListaMatriz([]);
        // setListaAnosMatriz([]);
        // setListaCompetencias([]);
        // setListaHabilidades([]);
        // setListaAssuntos([]);
        // setListaSubAssuntos([]);

        if (value && !validarCampoForm(value)) {
            // Carrega Matriz e Assuntos em paralelo
            // const [respostaMatriz, respostaAssuntos] = await Promise.all([
            //     configuracaoItemService.obterMatriz(value),
            //     configuracaoItemService.obterAssuntos(value)
            // ]);

            // Matriz
            //   if (respostaMatriz?.length) {
            //     setListaMatriz(respostaMatriz);
            //     if (respostaMatriz.length === 1) {
            //       form?.setFieldValue(Campos.matriz, respostaMatriz[0].value);
            //     }
            //   } else {
            //     setListaMatriz([]);
            //   }

            // Assuntos
            //   if (respostaAssuntos?.length) {
            //     setListaAssuntos(respostaAssuntos);
            //     if (respostaAssuntos.length === 1) {
            //       form?.setFieldValue(Campos.assunto, respostaAssuntos[0].value);
            //     }
            //   } else {
            //     setListaAssuntos([]);
            //   }
        }
    }, [form]);

    useEffect(() => {
        if (open) {
            //setSelectedFilters(filtrosSelecionados);
        }
    }, [open]);

    //const initialValue: number = filtroDados.nivelMinimo;
    //const limit: number = filtroDados.nivelMaximo;
    // const generateOptions = () => {
    //     const options = [];
    //     for (let i = initialValue; i <= limit; i += 25) {
    //         options.push(i);
    //     }
    //     return options;
    // };

    const handleResetFilters = () => {
        // setSelectedFilters({
        //     niveis: [],
        //     niveisAbaPrincipal: [
        //         { texto: "Abaixo do Básico", valor: 1 },
        //         { texto: "Básico", valor: 2 },
        //         { texto: "Adequado", valor: 3 },
        //         { texto: "Avançado", valor: 4 },
        //     ],
        //     anosEscolares: [],
        //     componentesCurriculares: [],
        //     anosEscolaresRadio: [filtroDados.anosEscolares[0]],
        //     componentesCurricularesRadio: [filtroDados.componentesCurriculares[0]],
        //     nomeEstudante: "",
        //     eolEstudante: "",
        //     nivelMinimo: filtroDados.nivelMinimo,
        //     nivelMinimoEscolhido: filtroDados.nivelMinimo,
        //     nivelMaximo: filtroDados.nivelMaximo,
        //     nivelMaximoEscolhido: filtroDados.nivelMaximo,
        //     turmas: [],
        //     variacoes: [],
        // });
    };

    const handleApplyFilters = () => {
        //dispatch(setFilters(selectedFilters));
        setOpen(false);
    };

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
                <Form form={form} layout="vertical">
                    <Divider className="separador" />
                    <div className="filtro-secao">
                        <h3 className="filtro-titulo">Area Conhecimento</h3>
                        <SelectForm
                            form={form}
                            options={listaAreaConhecimento}
                            nomeCampo={Campos.areaConhecimento}
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
                            form={form}
                            options={listaDisciplinas}
                            nomeCampo={Campos.disciplinas}
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
            </Drawer>
        </>
    )
};

export default FiltroPrincipalNovo;
