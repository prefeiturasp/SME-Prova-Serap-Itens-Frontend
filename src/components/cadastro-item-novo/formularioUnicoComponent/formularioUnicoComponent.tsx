import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { CheckboxOptionType, Col, Form, FormProps, Row, Spin, Radio } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { SelectValueType } from '~/domain/type/select';

// form personalizados
import SelectForm from '~/components/select-form';
import TextArea from "antd/es/input/TextArea";
import InputTag from "~/components/input-tag";
import TipoItem from "~/components/cadastro-item/campos/tipo-item";
import { CampoNumero } from "~/components/cadastro-item/campo-numero";

// Redux
// import { ConfiguracaoItemNovoProps } from '~/redux/modules/cadastroItem-novo/itemNovo/reducers';

//services
import configuracaoItemService from '~/services/configuracaoItem-service';

//utils
import {
  converterListaParaCheckboxOption,
  ruleCampoArrayStringObrigatorioForm,
  ruleCampoObrigatorioForm,
  validarCampoForm
} from "~/utils/funcoes";

//css
import '../cards/identificacaoComponent/identificacaoComponent.css';
import '../cards/caracteristicasItemComponet/caracteristicaItemComponent.css';

const FormularioUnico: React.FC<FormProps> = ({ form }) => {

  // campos
  const campoCodigo = Campos.codigo;
  const campoAreaConhecimento = Campos.areaConhecimento;
  const campoDisciplina = Campos.disciplinas;
  const campoMatriz = Campos.matriz;
  const campoAnoMatriz = Campos.anoMatriz;

  const campoCompetencia = Campos.competencia;
  const campoHabilidade = Campos.habilidade;

  const campoDificuldadeSugerida = Campos.dificuldadeSugerida;
  const campoNivelItem = Campos.nivelItem;
  const campoQuantidadeAlternativas = Campos.quantidadeAlternativas;
  const campoTipoItem = Campos.tipoItem;
  const campoSituacaoItem = Campos.situacaoItem;

  const campoAssunto = Campos.assunto;
  const campoSubAssunto = Campos.subAssunto;
  const campoPalavraChave = Campos.palavraChave;
  const campoSentencaDescritora = Campos.sentencaDescritora;
  const campoObservacao = Campos.observacao;

  const campoDiscriminacao = Campos.discriminacao;
  const campoDificuldade = Campos.dificuldade;
  const campoAcertoCasual = Campos.acertoCasual;
  const campoParametroBTransformado = Campos.parametroBTransformado;
  const campoMediaDesvioPadrao = Campos.mediaDesvioPadrao;

  // watchers
  // const codigoForm = Form.useWatch(campoCodigo, form);
  const areaConhecimentoIdForm = Form.useWatch(Campos.areaConhecimento, form);
  const disciplinaIdForm = Form.useWatch(Campos.disciplinas, form);
  const matrizIdForm = Form.useWatch(Campos.matriz, form);
  // const anoMatrizIdForm = Form.useWatch(Campos.anoMatriz, form);

  const competenciaIdForm = Form.useWatch(Campos.competencia, form);
  // const habilidadeIdForm = Form.useWatch(Campos.habilidade, form);

  const dificuldadeSugeridaIdForm = Form.useWatch(campoDificuldadeSugerida, form);
  const nivelItemIdForm = Form.useWatch(campoNivelItem, form);
  const quantidadeAlternativasForm = Form.useWatch(campoQuantidadeAlternativas, form);
  // const tipoItemIdForm = Form.useWatch(campoTipoItem, form);
  // const situacaoItemIdForm = Form.useWatch(campoSituacaoItem, form);

  const assuntoIdForm = Form.useWatch(campoAssunto, form);
  // const subAssuntoIdForm = Form.useWatch(campoSubAssunto, form);
  // const palavrasChaveForm = Form.useWatch(campoPalavraChave, form);
  // const sentencaDescritoraForm = Form.useWatch(campoSentencaDescritora, form);
  // const observacaoForm = Form.useWatch(campoObservacao, form);

  // const discriminacaoForm = Form.useWatch(campoDiscriminacao, form);
  // const dificuldadeForm = Form.useWatch(campoDificuldade, form);
  // const acertoCasualForm = Form.useWatch(campoAcertoCasual, form);
  // const parametroBTransformadoForm = Form.useWatch(campoParametroBTransformado, form);
  // const mediaDesvioPadraoForm = Form.useWatch(campoMediaDesvioPadrao, form);


  // listas
  const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
  const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
  const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);
  const [listaAnosMatriz, setListaAnosMatriz] = useState<DefaultOptionType[]>([]);

  const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
  const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);

  const [listaDificuldadeSugerida, setListaDificuldadeSugerida] = useState<CheckboxOptionType[]>([]);
  const [carregandoDificuldadeSugerida, setCarregandoDificuldadeSugerida] = useState<boolean>(false);
  const [listaNivelItem, setListaNivelItem] = useState<DefaultOptionType[]>([]);
  const [listaQuantidadeAlternativas, setListaQuantidadeAlternativas] = useState<DefaultOptionType[]>([]);
  const [listaTiposItem, setListaTiposItem] = useState<DefaultOptionType[]>([]);
  const [listaSituacoesItem, setListaSituacoesItem] = useState<DefaultOptionType[]>([]);

  const [listaAssuntos, setListaAssuntos] = useState<DefaultOptionType[]>([]);
  const [listaSubAssuntos, setListaSubAssuntos] = useState<DefaultOptionType[]>([]);
  
  // ✅ Estado local para palavras-chave (necessário para exibição das tags)
  const [palavrasChave, setPalavrasChave] = useState<string[] | undefined>([]);

  // const [objTabConfiguracaoItemNovo, setObjTabConfiguracaoItemNovo] =
  //   useState<ConfiguracaoItemNovoProps>({} as ConfiguracaoItemNovoProps);
 


  //carregamento dos selects
  const popularCampoSelectForm = useCallback(
    async (
      param: SelectValueType,
      nomeCampo: Campos,
      setLista: Dispatch<SetStateAction<DefaultOptionType[]>>,
    ) => {
      let resposta: DefaultOptionType[] = [];
      const parametroValido = !validarCampoForm(param);

      switch (nomeCampo) {
        case Campos.areaConhecimento:
          resposta = await configuracaoItemService.obterAreaConhecimento();
          break;
        case Campos.disciplinas:
          if (parametroValido)
            resposta = await configuracaoItemService.obterDisciplinas(param);
          break;
        case Campos.matriz:
          if (parametroValido)
            resposta = await configuracaoItemService.obterMatriz(param);
          break;
        case Campos.competencia:
          if (parametroValido)
            resposta = await configuracaoItemService.obterCompetenciasMatriz(param);
          break;
        case Campos.habilidade:
          if (parametroValido)
            resposta = await configuracaoItemService.obterHabilidadesCompetencia(param);
          break;
        case Campos.quantidadeAlternativas:
          resposta = await configuracaoItemService.obterQuantidadeAlternativas();
          break;
        case Campos.tipoItem:
          resposta = await configuracaoItemService.obterTiposItem();
          break;
        case Campos.situacaoItem:
          resposta = await configuracaoItemService.obterSituacoesItem();
          break;
        case Campos.assunto:
          if (parametroValido)
            resposta = await configuracaoItemService.obterAssuntos(param);
          break;
        case Campos.subAssunto:
          if (parametroValido)
            resposta = await configuracaoItemService.obterSubAssuntos(param);
          break;
        default:
          break;
      }

      if (resposta?.length) {
        setLista(resposta);        
      }
    },
    [form],
  );

  const obterAnosMatriz = useCallback(async () => {
    if (!matrizIdForm) {
      setListaAnosMatriz([]);
      return;
    }
    const resposta = await configuracaoItemService.obterAnosMatriz(matrizIdForm);
    if (resposta?.length) {
      setListaAnosMatriz(resposta);
      if (resposta.length === 1) form?.setFieldValue(campoAnoMatriz, resposta[0].value);
    } else {
      setListaAnosMatriz([]);
      form?.setFieldValue(campoAnoMatriz, null);
    }
  }, [form, matrizIdForm, campoAnoMatriz]);

  // Dificuldade sugerida
  const obterListaDificuldadeSugerida = useCallback(async () => {
    setCarregandoDificuldadeSugerida(true);
    const resposta = await configuracaoItemService.obterDificuldadeSugerida();
    if (resposta?.length > 0) {
      setListaDificuldadeSugerida(converterListaParaCheckboxOption(resposta));
     
    } else {
      setListaDificuldadeSugerida([]);
      form?.setFieldValue(campoDificuldadeSugerida, null);
    }
    setCarregandoDificuldadeSugerida(false);
  }, [form, campoDificuldadeSugerida]);

  // nivelitems
  const obterListaNivelItem = useCallback(async () => {
    setCarregandoDificuldadeSugerida(true);
    const resposta = await configuracaoItemService.obterNivelItem();
    if (resposta?.length > 0) {
      setListaNivelItem(resposta);
    } else {
      setListaNivelItem([]);
      form?.setFieldValue(campoNivelItem, null);
    }
    setCarregandoDificuldadeSugerida(false);
  }, [form, campoNivelItem]);

  //fim carregamento dos selects

  //cascata dos selects
  const obterAreaConhecimento = useCallback(() => {
    popularCampoSelectForm(null, campoAreaConhecimento, setListaAreaConhecimento);
  }, [campoAreaConhecimento, popularCampoSelectForm]);

  useEffect(() => {
    obterAreaConhecimento();
  }, [obterAreaConhecimento]);

  useEffect(() => {
    popularCampoSelectForm(areaConhecimentoIdForm, campoDisciplina, setListaDisciplinas);
  }, [areaConhecimentoIdForm, campoDisciplina, popularCampoSelectForm]);

  useEffect(() => {
    popularCampoSelectForm(disciplinaIdForm, campoMatriz, setListaMatriz);
  }, [disciplinaIdForm, campoMatriz, popularCampoSelectForm]);

  useEffect(() => {
    obterAnosMatriz();
  }, [matrizIdForm, campoAnoMatriz, obterAnosMatriz]);

  // 🔹 Atualiza competências quando muda a matriz
  useEffect(() => {
    popularCampoSelectForm(matrizIdForm, campoCompetencia, setListaCompetencias);
  }, [matrizIdForm, campoCompetencia, popularCampoSelectForm]);

  // 🔹 Atualiza habilidades quando muda a competência
  useEffect(() => {
    popularCampoSelectForm(competenciaIdForm, campoHabilidade, setListaHabilidades);
  }, [competenciaIdForm, campoHabilidade, popularCampoSelectForm]);

  // 🔹 Atualiza listas conforme dependências
  useEffect(() => {
    if (disciplinaIdForm)
      popularCampoSelectForm(disciplinaIdForm, campoAssunto, setListaAssuntos);
  }, [disciplinaIdForm, popularCampoSelectForm, campoAssunto]);

  useEffect(() => {
    if (assuntoIdForm)
      popularCampoSelectForm(assuntoIdForm, campoSubAssunto, setListaSubAssuntos);
  }, [assuntoIdForm, popularCampoSelectForm, campoSubAssunto]);

  useEffect(() => {
    const valorInicial = form?.getFieldValue(campoPalavraChave);
    if (valorInicial && Array.isArray(valorInicial)) {
      setPalavrasChave(valorInicial);
    }
  }, [form, campoPalavraChave]);

  //fim cascata dos selects


  // Os Efeitos
  useEffect(() => {
    form?.resetFields();
  }, [form, listaAreaConhecimento]);

  useEffect(() => {
    obterListaDificuldadeSugerida();
    obterListaNivelItem();
    popularCampoSelectForm(null, campoQuantidadeAlternativas, setListaQuantidadeAlternativas);
    popularCampoSelectForm(null, campoTipoItem, setListaTiposItem);
    popularCampoSelectForm(null, campoSituacaoItem, setListaSituacoesItem);

  }, []);

  // Fim dos Efeitos


  return (
    <>
      <div className='card'>
        <div className='card-titulo'>Identificação</div>
        <div className='card-subtitulo'>
          Defina a localização desta questão na matriz curricular.
        </div>
        <div className='card-corpo'>
          <div className="esconder">
            {/* <Form.Item label='Código'>
              <Input
                disabled={true}
                placeholder='Código Item'
                value={configuracaoItem?.codigo > 0 ? configuracaoItem.codigo : ''}
              />
            </Form.Item> */}
            <Form.Item
                label='codigo'
                name={campoCodigo}
              >
                <CampoNumero
                  value={form?.getFieldValue(campoCodigo)}
                  onChange={(valor) => form?.setFieldValue(campoCodigo, valor)}
                  placeholder='codigo' />
              </Form.Item>
          </div>
          <Row>
            <Col xs={24} md={12} className='card-campo'>
              <SelectForm
                form={form}
                options={listaAreaConhecimento}
                nomeCampo={campoAreaConhecimento}
                label={'Área de conhecimento'}
                campoObrigatorio={true}
                disabled={false}
              />
            </Col>
            <Col xs={24} md={12} className='card-campo'>
              <SelectForm
                form={form}
                options={listaDisciplinas}
                nomeCampo={campoDisciplina}
                label={'Componente curricular'}
                campoObrigatorio={true}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12} className='card-campo'>
              <SelectForm
                form={form}
                options={listaMatriz}
                nomeCampo={campoMatriz}
                label={'Matriz de avaliação'}
                campoObrigatorio={true}
              />
            </Col>
            <Col xs={24} md={12} className='card-campo'>
              <SelectForm
                form={form}
                options={listaAnosMatriz}
                nomeCampo={campoAnoMatriz}
                label={'Ano (ano escolar)'}
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
                nomeCampo={campoCompetencia}
                label="Competência"
                campoObrigatorio={true}
              />
            </Col>
            <Col xs={24} md={12} className="card-campo">
              <SelectForm
                form={form}
                options={listaHabilidades}
                nomeCampo={campoHabilidade}
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
                name={campoDificuldadeSugerida}
                rules={ruleCampoObrigatorioForm(dificuldadeSugeridaIdForm)}
              >
                <Spin size="small" spinning={carregandoDificuldadeSugerida}>
                  <Radio.Group
                    className="dificuldadeSugeridaCadastroItem"
                    id="rblDificuldadeSugerida"
                    buttonStyle="solid"
                    optionType="button"
                    options={listaDificuldadeSugerida}
                    defaultValue={5}
                  />
                </Spin>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} className="card-campo">
              <SelectForm
                form={form}
                options={listaNivelItem}
                nomeCampo={campoNivelItem}
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
                nomeCampo={campoQuantidadeAlternativas}
                label="Categoria do item e quantidade de alternativas*"
                campoObrigatorio={true}
                disabled={!nivelItemIdForm}
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
                disabled={!quantidadeAlternativasForm}
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
                nomeCampo={campoSituacaoItem}
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
                nomeCampo={campoAssunto}
                label={'Assunto'}
                campoObrigatorio={false}
                disabled={!disciplinaIdForm}
                labelInValue={false}
              />
            </Col>
            <Col xs={24} md={8} className='card-campo'>
              <SelectForm
                form={form}
                options={listaSubAssuntos}
                nomeCampo={campoSubAssunto}
                label={'Subassunto'}
                campoObrigatorio={false}
                disabled={!assuntoIdForm}
                labelInValue={false}
              />
            </Col>
            <Col xs={24} md={8} className='card-campo'>
              <Form.Item
                label='Palavra-chave'
                name={campoPalavraChave}
                rules={ruleCampoArrayStringObrigatorioForm(palavrasChave || [])}
              >
                <InputTag
                  valueForm={palavrasChave}
                  tags={palavrasChave}
                  setTags={(v) => {
                    const novasTags = v || [];
                    setPalavrasChave(novasTags);
                    form?.setFieldValue(campoPalavraChave, novasTags);
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
                name={campoSentencaDescritora}
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
                name={campoObservacao}
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
                name={campoDiscriminacao}
              >
                <CampoNumero
                  value={form?.getFieldValue(campoDiscriminacao)}
                  onChange={(valor) => form?.setFieldValue(campoDiscriminacao, valor)}
                  placeholder='Exemplo: 1' />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} className='card-campo'>
              <Form.Item
                label='Dificuldade'
                name={campoDificuldade}
              >
                <CampoNumero
                  value={form?.getFieldValue(campoDificuldade)}
                  onChange={(valor) => form?.setFieldValue(campoDificuldade, valor)}
                  placeholder='Exemplo: 2' />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} className='card-campo'>
              <Form.Item
                label='Acerto casual'
                name={campoAcertoCasual}
              >
                <CampoNumero
                  value={form?.getFieldValue(campoAcertoCasual)}
                  onChange={(valor) => form?.setFieldValue(campoAcertoCasual, valor)}
                  placeholder='Exemplo: 3' />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={24} md={12} className='card-campo'>
              <Form.Item
                label='Parâmetro b transformado'
                name={campoParametroBTransformado}
              >
                <CampoNumero
                  value={form?.getFieldValue(campoParametroBTransformado)}
                  onChange={(valor) => form?.setFieldValue(campoParametroBTransformado, valor)}
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
                name={campoMediaDesvioPadrao}
              >
                <CampoNumero
                  value={form?.getFieldValue(campoMediaDesvioPadrao)}
                  onChange={(valor) => form?.setFieldValue(campoMediaDesvioPadrao, valor)}
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