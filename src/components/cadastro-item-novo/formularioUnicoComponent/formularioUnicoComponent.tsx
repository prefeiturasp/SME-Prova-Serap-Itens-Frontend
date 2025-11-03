import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, FormProps, Row, Radio } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { SelectValueType } from '~/domain/type/select';
import { Campos } from "~/domain/enums/campos-cadastro-item";

// form personalizados
import SelectForm from '~/components/select-form';
import TextArea from "antd/es/input/TextArea";
import InputTag from "~/components/input-tag";
import TipoItem from "~/components/cadastro-item/campos/tipo-item";
import { CampoNumero } from "~/components/cadastro-item/campo-numero";

// Lógica de população movida para cadastrarItemNovo.tsx

//services
import configuracaoItemService from '~/services/configuracaoItem-service';

//utils
import {
  // converterListaParaCheckboxOption, // Não precisamos mais - fazemos conversão manual
  // ruleCampoArrayStringObrigatorioForm, // Removido - palavrasChave não é obrigatório
  ruleCampoObrigatorioForm,
  validarCampoForm
} from "~/utils/funcoes";

//css
import '../cards/identificacaoComponent/identificacaoComponent.css';
import '../cards/caracteristicasItemComponet/caracteristicaItemComponent.css';

// ✅ Dificuldade sugerida agora é HTML direto - constante removida

const FormularioUnico: React.FC<FormProps> = ({ form }) => {


  // Detectar dados vindos do "Voltar" (via localStorage/estados do pai)


  // 🚀 CAMPOS SIMPLIFICADOS - usando strings diretas ao invés de constantes
  // Remoção de ~20 linhas de declarações desnecessárias

  // 🚀 WATCHERS REMOVIDOS - agora usa onChange direto!
  // Eliminação completa de Form.useWatch para evitar conflitos e re-renders

  // listas
  const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
  const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
  const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);
  const [listaAnosMatriz, setListaAnosMatriz] = useState<DefaultOptionType[]>([]);

  const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
  const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);

  // ✅ Dificuldade sugerida - HTML FIXO para máxima performance e confiabilidade
  const [listaNivelItem, setListaNivelItem] = useState<DefaultOptionType[]>([]);
  const [listaQuantidadeAlternativas, setListaQuantidadeAlternativas] = useState<DefaultOptionType[]>([]);
  const [listaTiposItem, setListaTiposItem] = useState<DefaultOptionType[]>([]);
  const [listaSituacoesItem, setListaSituacoesItem] = useState<DefaultOptionType[]>([]);

  const [listaAssuntos, setListaAssuntos] = useState<DefaultOptionType[]>([]);
  const [listaSubAssuntos, setListaSubAssuntos] = useState<DefaultOptionType[]>([]);

  // ✅ Estado local para palavras-chave (necessário para exibição das tags)
  const [palavrasChave, setPalavrasChave] = useState<string[] | undefined>([]);

  // 🚀 HANDLERS onChange - Cascata limpa e sequencial

  // Carrega Área de Conhecimento (inicial)
  const carregarAreaConhecimento = useCallback(async () => {
    const resposta = await configuracaoItemService.obterAreaConhecimento();
    setListaAreaConhecimento(resposta?.length ? resposta : []);
  }, []);

  // 1️⃣ Área → Disciplinas
  const handleAreaConhecimentoChange = useCallback(async (value: SelectValueType) => {
    // Limpa campos dependentes
    form?.setFieldValue(Campos.disciplinas, null);
    form?.setFieldValue(Campos.matriz, null);
    form?.setFieldValue(Campos.anoMatriz, null);
    form?.setFieldValue(Campos.competencia, null);
    form?.setFieldValue(Campos.habilidade, null);
    form?.setFieldValue(Campos.assunto, null);
    form?.setFieldValue(Campos.subAssunto, null);

    // Limpa listas dependentes
    setListaDisciplinas([]);
    setListaMatriz([]);
    setListaAnosMatriz([]);
    setListaCompetencias([]);
    setListaHabilidades([]);
    setListaAssuntos([]);
    setListaSubAssuntos([]);

    // Carrega disciplinas se área selecionada
    if (value && !validarCampoForm(value)) {
      const resposta = await configuracaoItemService.obterDisciplinas(value);
      if (resposta?.length) {
        setListaDisciplinas(resposta);
        if (resposta.length === 1) {
          form?.setFieldValue(Campos.disciplinas, resposta[0].value);
        }
      } else {
        setListaDisciplinas([]);
      }
    }
  }, [form]);

  // 2️⃣ Disciplina → Matriz + Assuntos
  const handleDisciplinaChange = useCallback(async (value: SelectValueType) => {
    // Limpa campos dependentes
    form?.setFieldValue(Campos.matriz, null);
    form?.setFieldValue(Campos.anoMatriz, null);
    form?.setFieldValue(Campos.competencia, null);
    form?.setFieldValue(Campos.habilidade, null);
    form?.setFieldValue(Campos.assunto, null);
    form?.setFieldValue(Campos.subAssunto, null);

    // Limpa listas dependentes
    setListaMatriz([]);
    setListaAnosMatriz([]);
    setListaCompetencias([]);
    setListaHabilidades([]);
    setListaAssuntos([]);
    setListaSubAssuntos([]);

    if (value && !validarCampoForm(value)) {
      // Carrega Matriz e Assuntos em paralelo
      const [respostaMatriz, respostaAssuntos] = await Promise.all([
        configuracaoItemService.obterMatriz(value),
        configuracaoItemService.obterAssuntos(value)
      ]);

      // Matriz
      if (respostaMatriz?.length) {
        setListaMatriz(respostaMatriz);
        if (respostaMatriz.length === 1) {
          form?.setFieldValue(Campos.matriz, respostaMatriz[0].value);
        }
      } else {
        setListaMatriz([]);
      }

      // Assuntos
      if (respostaAssuntos?.length) {
        setListaAssuntos(respostaAssuntos);
        if (respostaAssuntos.length === 1) {
          form?.setFieldValue(Campos.assunto, respostaAssuntos[0].value);
        }
      } else {
        setListaAssuntos([]);
      }
    }
  }, [form]);

  // 3️⃣ Matriz → Ano + Competências
  const handleMatrizChange = useCallback(async (value: SelectValueType) => {
    // Limpa campos dependentes
    form?.setFieldValue(Campos.anoMatriz, null);
    form?.setFieldValue(Campos.competencia, null);
    form?.setFieldValue(Campos.habilidade, null);

    // Limpa listas dependentes
    setListaAnosMatriz([]);
    setListaCompetencias([]);
    setListaHabilidades([]);

    if (value && !validarCampoForm(value)) {
      // Carrega Anos e Competências em paralelo
      const [respostaAnos, respostaCompetencias] = await Promise.all([
        configuracaoItemService.obterAnosMatriz(value),
        configuracaoItemService.obterCompetenciasMatriz(value)
      ]);

      // Anos da matriz
      if (respostaAnos?.length) {
        setListaAnosMatriz(respostaAnos);
        if (respostaAnos.length === 1) {
          form?.setFieldValue(Campos.anoMatriz, respostaAnos[0].value);
        }
      }

      // Competências
      if (respostaCompetencias?.length) {
        setListaCompetencias(respostaCompetencias);
        if (respostaCompetencias.length === 1) {
          form?.setFieldValue(Campos.competencia, respostaCompetencias[0].value);
        }
      } else {
        setListaCompetencias([]);
      }
    }
  }, [form]);

  // 4️⃣ Competência → Habilidades
  const handleCompetenciaChange = useCallback(async (value: SelectValueType) => {
    // Limpa campos dependentes
    form?.setFieldValue(Campos.habilidade, null);
    setListaHabilidades([]);

    if (value && !validarCampoForm(value)) {
      const resposta = await configuracaoItemService.obterHabilidadesCompetencia(value);
      if (resposta?.length) {
        setListaHabilidades(resposta);
        if (resposta.length === 1) {
          form?.setFieldValue(Campos.habilidade, resposta[0].value);
        }
      } else {
        setListaHabilidades([]);
      }
    }
  }, [form]);

  // 5️⃣ Assunto → SubAssuntos
  const handleAssuntoChange = useCallback(async (value: SelectValueType) => {
    // Limpa campos dependentes
    form?.setFieldValue(Campos.subAssunto, null);
    setListaSubAssuntos([]);

    if (value && !validarCampoForm(value)) {
      const resposta = await configuracaoItemService.obterSubAssuntos(value);
      if (resposta?.length) {
        setListaSubAssuntos(resposta);
        if (resposta.length === 1) {
          form?.setFieldValue(Campos.subAssunto, resposta[0].value);
        }
      } else {
        setListaSubAssuntos([]);
      }
    }
  }, [form]);

  // 🚀 Carregamento de listas básicas (sem cascata)
  const carregarListasBasicas = useCallback(async () => {
    const [nivelItem, quantidadeAlternativas, tiposItem, situacoesItem] = await Promise.all([
      configuracaoItemService.obterNivelItem(),
      configuracaoItemService.obterQuantidadeAlternativas(),
      configuracaoItemService.obterTiposItem(),
      configuracaoItemService.obterSituacoesItem()
    ]);

    setListaNivelItem(nivelItem?.length ? nivelItem : []);
    setListaQuantidadeAlternativas(quantidadeAlternativas?.length ? quantidadeAlternativas : []);
    setListaTiposItem(tiposItem?.length ? tiposItem : []);
    setListaSituacoesItem(situacoesItem?.length ? situacoesItem : []);
  }, []);



  //fim cascata dos selects

  // 🔄 CASCATA AUTOMÁTICA - Executada quando há dados no localStorage
  const executarCascataAutomatica = useCallback(async () => {
    console.log('🔄 Iniciando cascata automática...');

    try {
      const itemSalvoStr = localStorage.getItem('itemAtual');
      if (!itemSalvoStr) {
        console.log('📂 Nenhum dados no localStorage - cascata automática cancelada');
        return;
      }

      const itemSalvo = JSON.parse(itemSalvoStr);
      const config = itemSalvo.configuracao;

      if (!config) {
        console.log('⚠️ Configuração não encontrada no localStorage');
        return;
      }

      console.log('📋 Dados encontrados no localStorage:', config);

      // 🔄 Sequência de cascata automática (igual manual, mas sem interação do usuário)

      // 1️⃣ Área → carrega disciplinas
      if (config.areaConhecimento) {
        console.log('📝 [1/7] Processando área do conhecimento...');
        form?.setFieldValue(Campos.areaConhecimento, config.areaConhecimento);

        const resposta = await configuracaoItemService.obterDisciplinas(config.areaConhecimento);
        if (resposta?.length) {
          setListaDisciplinas(resposta);
          if (resposta.length === 1) {
            form?.setFieldValue(Campos.disciplinas, resposta[0].value);
            console.log('✅ Auto-selecionada disciplina única:', resposta[0].value);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 300)); // Aguarda processamento
      }

      // 2️⃣ Disciplina → carrega matriz + assuntos
      if (config.disciplina) {
        console.log('📝 [2/7] Processando disciplina...');
        form?.setFieldValue(Campos.disciplinas, config.disciplina);

        const [respostaMatriz, respostaAssuntos] = await Promise.all([
          configuracaoItemService.obterMatriz(config.disciplina),
          configuracaoItemService.obterAssuntos(config.disciplina)
        ]);

        // Matriz
        if (respostaMatriz?.length) {
          setListaMatriz(respostaMatriz);
          if (respostaMatriz.length === 1) {
            form?.setFieldValue(Campos.matriz, respostaMatriz[0].value);
            console.log('✅ Auto-selecionada matriz única:', respostaMatriz[0].value);
          }
        }

        // Assuntos
        if (respostaAssuntos?.length) {
          setListaAssuntos(respostaAssuntos);
          if (respostaAssuntos.length === 1) {
            form?.setFieldValue(Campos.assunto, respostaAssuntos[0].value);
            console.log('✅ Auto-selecionado assunto único:', respostaAssuntos[0].value);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 3️⃣ Matriz → carrega anos + competências
      if (config.matriz) {
        console.log('📝 [3/7] Processando matriz...');
        form?.setFieldValue(Campos.matriz, config.matriz);

        const [respostaAnos, respostaCompetencias] = await Promise.all([
          configuracaoItemService.obterAnosMatriz(config.matriz),
          configuracaoItemService.obterCompetenciasMatriz(config.matriz)
        ]);

        // Anos da matriz
        if (respostaAnos?.length) {
          setListaAnosMatriz(respostaAnos);
          if (respostaAnos.length === 1) {
            form?.setFieldValue(Campos.anoMatriz, respostaAnos[0].value);
            console.log('✅ Auto-selecionado ano único:', respostaAnos[0].value);
          }
        }

        // Competências
        if (respostaCompetencias?.length) {
          setListaCompetencias(respostaCompetencias);
          if (respostaCompetencias.length === 1) {
            form?.setFieldValue(Campos.competencia, respostaCompetencias[0].value);
            console.log('✅ Auto-selecionada competência única:', respostaCompetencias[0].value);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 4️⃣ Ano da matriz (se ainda não foi definido)
      if (config.anoMatriz && form?.getFieldValue(Campos.anoMatriz) !== config.anoMatriz) {
        console.log('📝 [4/7] Definindo ano da matriz específico...');
        form?.setFieldValue(Campos.anoMatriz, config.anoMatriz);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 5️⃣ Competência → carrega habilidades
      if (config.competencia) {
        console.log('📝 [5/7] Processando competência...');
        form?.setFieldValue(Campos.competencia, config.competencia);

        const resposta = await configuracaoItemService.obterHabilidadesCompetencia(config.competencia);
        if (resposta?.length) {
          setListaHabilidades(resposta);
          if (resposta.length === 1) {
            form?.setFieldValue(Campos.habilidade, resposta[0].value);
            console.log('✅ Auto-selecionada habilidade única:', resposta[0].value);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 6️⃣ Assunto → carrega subassuntos
      if (config.assunto) {
        console.log('📝 [6/7] Processando assunto...');
        form?.setFieldValue(Campos.assunto, config.assunto);

        const resposta = await configuracaoItemService.obterSubAssuntos(config.assunto);
        if (resposta?.length) {
          setListaSubAssuntos(resposta);
          if (resposta.length === 1) {
            form?.setFieldValue(Campos.subAssunto, resposta[0].value);
            console.log('✅ Auto-selecionado subassunto único:', resposta[0].value);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 7️⃣ Finalização - campos que não têm cascata
      console.log('📝 [7/7] Definindo campos finais...');

      if (config.habilidade) {
        form?.setFieldValue(Campos.habilidade, config.habilidade);
      }

      if (config.subAssunto) {
        form?.setFieldValue(Campos.subAssunto, config.subAssunto);
      }

      // Campos simples (sem cascata)
      const camposSimples = {
        situacaoItem: Campos.situacaoItem,
        tipoItem: Campos.tipoItem,
        quantidadeAlternativas: Campos.quantidadeAlternativas,
        dificuldadeSugerida: Campos.dificuldadeSugerida,
        nivelItem: Campos.nivelItem,
        discriminacao: Campos.discriminacao,
        dificuldade: Campos.dificuldade,
        acertoCasual: Campos.acertoCasual,
        palavrasChave: Campos.palavraChave,
        parametroBTransformado: Campos.parametroBTransformado,
        mediaDesvioPadrao: Campos.mediaDesvioPadrao,
        sentencaDescritora: Campos.sentencaDescritora,
        observacao: Campos.observacao,
      };

      Object.keys(camposSimples).forEach(key => {
        const value = config[key];
        const formFieldName = (camposSimples as any)[key];
        if (value !== undefined && value !== null && formFieldName) {
          form?.setFieldValue(formFieldName, value);
          console.log(`📝 Campo ${formFieldName} restaurado:`, value);
        }
      });

      // Palavras-chave (tratamento especial)
      if (config.palavrasChave && Array.isArray(config.palavrasChave)) {
        setPalavrasChave(config.palavrasChave);
        form?.setFieldValue(Campos.palavraChave, config.palavrasChave);
      }

      console.log('✅ Cascata automática finalizada com sucesso!');

    } catch (error) {
      console.error('❌ Erro na cascata automática:', error);
    }
  }, [form]);

  // Helper functions para validação de campos dependentes
  const disciplinaIdForm = form?.getFieldValue(Campos.disciplinas);
  const assuntoIdForm = form?.getFieldValue(Campos.assunto);

  // ✅ useEffect - Carregamento inicial + Cascata Automática
  useEffect(() => {
    const inicializarFormulario = async () => {
      // 1️⃣ Carrega listas iniciais sempre
      await Promise.all([
        carregarAreaConhecimento(),
        carregarListasBasicas()
      ]);

      // 2️⃣ Verifica se precisa executar cascata automática
      const voltandoParaPrimeiraTela = localStorage.getItem('voltandoParaPrimeiraTela') === 'true';
      const itemSalvoStr = localStorage.getItem('itemAtual');

      if (voltandoParaPrimeiraTela || itemSalvoStr) {
        console.log('🔄 Detectado dados no localStorage - executando cascata automática...');
        localStorage.removeItem('voltandoParaPrimeiraTela'); // Limpa flag

        // Aguarda um pouco para garantir que as listas iniciais foram carregadas
        setTimeout(() => {
          executarCascataAutomatica();
        }, 500);

        return; // Não faz reset se tem dados para carregar
      }

      // 3️⃣ Reset inteligente apenas se formulário vazio E sem dados no localStorage
      const valores = form?.getFieldsValue();
      const formularioVazio = !valores || Object.keys(valores).length === 0 ||
        Object.values(valores).every(v => !v || (Array.isArray(v) && v.length === 0));

      if (formularioVazio) {
        console.log('🧹 Formulário vazio - aplicando reset limpo...');
        setTimeout(() => {
          form?.resetFields();
          form?.setFields(Object.keys(form?.getFieldsValue() || {}).map(name => ({
            name,
            errors: []
          })));
        }, 50);
      }
    };

    inicializarFormulario();
  }, [executarCascataAutomatica]); // Dependência da função de cascata

  return (
    <>
      <div className='card'>
        <div className='card-titulo'>Identificação</div>
        <div className='card-subtitulo'>
          Defina a localização desta questão na matriz curricular.
        </div>
        <div className='card-corpo'>
          <Row>
            <Col xs={24} md={12} className='card-campo'>
              <SelectForm
                form={form}
                options={listaAreaConhecimento}
                nomeCampo={Campos.areaConhecimento}
                label="Área de conhecimento"
                campoObrigatorio={true}
                disabled={false}
                onChange={handleAreaConhecimentoChange}
              />
            </Col>
            <Col xs={24} md={12} className='card-campo'>
              <SelectForm
                form={form}
                options={listaDisciplinas}
                nomeCampo={Campos.disciplinas}
                label="Componente curricular"
                campoObrigatorio={true}
                onChange={handleDisciplinaChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12} className='card-campo'>
              <SelectForm
                form={form}
                options={listaMatriz}
                nomeCampo={Campos.matriz}
                label="Matriz de avaliação"
                campoObrigatorio={true}
                onChange={handleMatrizChange}
              />
            </Col>
            <Col xs={24} md={12} className='card-campo'>
              <SelectForm
                form={form}
                options={listaAnosMatriz}
                nomeCampo={Campos.anoMatriz}
                label="Ano (ano escolar)"
                campoObrigatorio={true}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className="card">
        <div className="card-titulo">Competências e habilidades</div>
        <div className="card-subtitulo">
          Vincule o item às competências e habilidades.
        </div>
        <div className="card-corpo">
          <Row>
            <Col xs={24} md={12} className="card-campo">
              <SelectForm
                form={form}
                options={listaCompetencias}
                nomeCampo={Campos.competencia}
                label="Competência"
                campoObrigatorio={true}
                onChange={handleCompetenciaChange}
              />
            </Col>
            <Col xs={24} md={12} className="card-campo">
              <SelectForm
                form={form}
                options={listaHabilidades}
                nomeCampo={Campos.habilidade}
                label="Habilidade"
                campoObrigatorio={true}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className="card">
        <div className="card-titulo">Características do item</div>
        <div className="card-subtitulo">Configure as propriedades técnicas do item</div>
        <div className="card-corpo">
          <Row>
            <Col xs={24} md={12} className="card-campo">
              <Form.Item
                label="Dificuldade sugerida"
                name={Campos.dificuldadeSugerida}
                rules={ruleCampoObrigatorioForm(form?.getFieldValue(Campos.dificuldadeSugerida))}
              >
                {/* 🏃‍♂️ HTML FIXO: Opções conhecidas para carregamento instantâneo */}
                <Radio.Group
                  className="dificuldadeSugeridaCadastroItem"
                  id="rblDificuldadeSugerida"
                  buttonStyle="solid"
                  optionType="button"
                  onChange={(e) => form?.setFieldValue(Campos.dificuldadeSugerida, e.target.value)}
                >
                  <Radio value={5}>1 - Muito Fácil</Radio>
                  <Radio value={1}>2 - Fácil</Radio>
                  <Radio value={2}>3 - Médio</Radio>
                  <Radio value={3}>4 - Difícil</Radio>
                  <Radio value={4}>5 - Muito Difícil</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} className="card-campo">
              <SelectForm
                form={form}
                options={listaNivelItem}
                nomeCampo={Campos.nivelItem}
                label="Nível do Item"
                campoObrigatorio={false}
                labelInValue={false}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={24} md={24} className="card-campo">
              <SelectForm
                form={form}
                options={listaQuantidadeAlternativas}
                nomeCampo={Campos.quantidadeAlternativas}
                label="Categoria do item e quantidade de alternativas*"
                campoObrigatorio={true}
                disabled={!form?.getFieldValue(Campos.nivelItem)}
                labelInValue={false}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={24} md={12} className="card-campo">
              <TipoItem
                form={form}
                options={listaTiposItem}
                campoObrigatorio={true}
                disabled={!form?.getFieldValue(Campos.quantidadeAlternativas)}
              />
              <div className="caracteristicasItemTexto">
                <p>
                  <b>Observação:</b> Dicotômico apresenta apenas duas opções (certo/errado).<br />
                  Politômico apresenta várias opções com graus de resposta (classificações ou níveis).
                </p>
              </div>
            </Col>

            <Col xs={24} md={12} className="card-campo">
              <SelectForm
                form={form}
                options={listaSituacoesItem}
                nomeCampo={Campos.situacaoItem}
                label="Situação do item"
                campoObrigatorio={true}
                labelInValue={false}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className='card'>
        <div className='card-titulo'>Classificação por tema</div>
        <div className='card-subtitulo'>
          Organize o item por assuntos e palavras-chave para facilitar a busca
        </div>
        <div className='card-corpo'>
          <Row>
            <Col xs={24} md={8} className='card-campo'>
              <SelectForm
                form={form}
                options={listaAssuntos}
                nomeCampo={Campos.assunto}
                label={'Assunto'}
                campoObrigatorio={false}
                disabled={!disciplinaIdForm}
                labelInValue={false}
                onChange={handleAssuntoChange}
              />
            </Col>
            <Col xs={24} md={8} className='card-campo'>
              <SelectForm
                form={form}
                options={listaSubAssuntos}
                nomeCampo={Campos.subAssunto}
                label={'Subassunto'}
                campoObrigatorio={false}
                disabled={!assuntoIdForm}
                labelInValue={false}
              />
            </Col>
            <Col xs={24} md={8} className='card-campo'>
              <Form.Item
                label='Palavra-chave'
                name={Campos.palavraChave}
                // Campo não obrigatório - sem validação obrigatória
                rules={[]}
              >
                <InputTag
                  valueForm={palavrasChave}
                  tags={palavrasChave}
                  setTags={(v) => {
                    const novasTags = v || [];
                    setPalavrasChave(novasTags);
                    form?.setFieldValue(Campos.palavraChave, novasTags);
                  }}
                />
              </Form.Item>
              <div className="caracteristicasItemTexto">
                <p>Digite uma palavra e pressione "Enter" para adicioná-la.</p>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={24} md={12} className='card-campo'>
              <Form.Item
                label='Sentença Descritora'
                name={Campos.sentencaDescritora}
              >
                <TextArea
                  rows={4}
                  placeholder="Descreva a habilidade ou competência específica avaliada pelo item..."
                  maxLength={100}
                />
              </Form.Item>
              <div className="caracteristicasItemTexto">
                <p>Insira até 100 caracteres</p>
              </div>
            </Col>

            <Col xs={24} md={12} className='card-campo'>
              <Form.Item
                label='Observação'
                name={Campos.observacao}
              >
                <TextArea
                  rows={4}
                  placeholder="Adicione observações sobre a questão, orientações para aplicação ou outras informações importantes..."
                  maxLength={100}
                />
              </Form.Item>
              <div className="caracteristicasItemTexto">
                <p>Insira até 100 caracteres</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className='card'>
        <div className='card-titulo'>
          Informações estatísticas
        </div>
        <div className='card-subtitulo'>
          Configure as informações estatísticas do item
        </div>
        <div className='card-corpo'>
          <Row>
            <Col xs={24} md={8} className='card-campo'>
              <Form.Item
                label='Discriminação'
                name={Campos.discriminacao}
              >
                <CampoNumero
                  value={form?.getFieldValue(Campos.discriminacao)}
                  onChange={(valor) => form?.setFieldValue(Campos.discriminacao, valor)}
                  placeholder='Exemplo: 1' />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} className='card-campo'>
              <Form.Item
                label='Dificuldade'
                name={Campos.dificuldade}
              >
                <CampoNumero
                  value={form?.getFieldValue(Campos.dificuldade)}
                  onChange={(valor) => form?.setFieldValue(Campos.dificuldade, valor)}
                  placeholder='Exemplo: 2' />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} className='card-campo'>
              <Form.Item
                label='Acerto casual'
                name={Campos.acertoCasual}
              >
                <CampoNumero
                  value={form?.getFieldValue(Campos.acertoCasual)}
                  onChange={(valor) => form?.setFieldValue(Campos.acertoCasual, valor)}
                  placeholder='Exemplo: 3' />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={24} md={12} className='card-campo'>
              <Form.Item
                label='Parâmetro b transformado'
                name={Campos.parametroBTransformado}
              >
                <CampoNumero
                  value={form?.getFieldValue(Campos.parametroBTransformado)}
                  onChange={(valor) => form?.setFieldValue(Campos.parametroBTransformado, valor)}
                  placeholder='Exemplo: 4'
                />
              </Form.Item>
              <div className="caracteristicasItemTexto">
                <p>
                  Indica em que ponto da escala de proficiência a questão está localizada.
                </p>
              </div>
            </Col>
            <Col xs={24} md={12} className='card-campo'>
              <Form.Item
                label='Média e desvio padrão'
                name={Campos.mediaDesvioPadrao}
              >
                <CampoNumero
                  value={form?.getFieldValue(Campos.mediaDesvioPadrao)}
                  onChange={(valor) => form?.setFieldValue(Campos.mediaDesvioPadrao, valor)}
                  placeholder="Exemplo: 5"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>

    </>
  );
};

export default FormularioUnico;