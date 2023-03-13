import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { Col, Form, FormProps, Row, Input } from 'antd';
import SelectForm from '~/components/select-form';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { ConfiguracaoItemProps } from '~/redux/modules/cadastro-item/item/reducers';
import { setConfiguracaoItem } from '~/redux/modules/cadastro-item/item/actions';
import { DefaultOptionType } from 'antd/lib/select';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { SelectValueType } from '~/domain/type/select';
import { Separador } from '~/components/cadastro-item/elementos';
import ModeloMatriz from '~/components/cadastro-item/modelo-matriz';
import NivelEnsino from '~/components/cadastro-item/nivel-ensino';

const ConfiguracaoItem: React.FC<FormProps> = ({ form }) => {

    const dispatch = useDispatch();
    const configuracaoItem = useSelector((state: AppState) => state.configuracaoItem);
    const matriz = useSelector((state: AppState) => state.matriz);
    const disciplina = useSelector((state: AppState) => state.disciplina);

    const [objTabConfiguracaoItem, setObjTabConfiguracaoItem] =
        useState<ConfiguracaoItemProps>(configuracaoItem);
    const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
    const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
    const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);

    const [modelomatriz, setModeloMatriz] = useState<string>(matriz.modelo);
    const [nivelEnsino, setNivelEnsino] = useState<string>(disciplina.nivelEnsino);

    const campoAreaConhecimento = Campos.areaConhecimento;
    const campoDisciplina = Campos.disciplinas;
    const campoMatriz = Campos.matriz;

    const areaConhecimentoIdForm = Form.useWatch(Campos.areaConhecimento, form);
    const disciplinaidForm = Form.useWatch(Campos.disciplinas, form);
    const matrizIdForm = Form.useWatch(Campos.matriz, form);

    const popularCampoSelectForm = useCallback(
        async (
            param: SelectValueType,
            nomeCampo: Campos,
            setLista: Dispatch<SetStateAction<DefaultOptionType[]>>,
        ) => {

            let resposta: DefaultOptionType[] = [];
            switch (nomeCampo) {
                case Campos.areaConhecimento:
                    resposta = await configuracaoItemService.obterAreaConhecimento();
                    break;
                case Campos.disciplinas:
                    resposta = await configuracaoItemService.obterDisciplinas(param);
                    break;
                case Campos.matriz:
                    resposta = await configuracaoItemService.obterMatriz(param);
                    break;
                default:
                    break;
            }

            if (resposta?.length) {
                setLista(resposta);
                if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
            } else {
                setLista([]);
                form?.setFieldValue(nomeCampo, null);
            }
        },
        [form],
    );

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
        popularCampoSelectForm(disciplinaidForm, campoMatriz, setListaMatriz);
    }, [disciplinaidForm, campoMatriz, popularCampoSelectForm]);

    useEffect(() => {
        form?.resetFields();
    }, [form, listaAreaConhecimento]);

    useEffect(() => {
        const novoObj: ConfiguracaoItemProps = {
            codigo: configuracaoItem.codigo,
            areaConhecimento: areaConhecimentoIdForm,
            disciplina: disciplinaidForm,
            matriz: matrizIdForm,
        };
        setObjTabConfiguracaoItem(novoObj);
    }, [disciplinaidForm, areaConhecimentoIdForm, matrizIdForm, configuracaoItem]);

    useEffect(() => {
        dispatch(setConfiguracaoItem(objTabConfiguracaoItem));
    }, [objTabConfiguracaoItem, dispatch]);

    return (
        <>
            <Row gutter={2}>
                <Col span={8}>
                    <Form.Item label='Código'>
                        <Input
                            disabled={true}
                            placeholder='Código Item'
                            value={configuracaoItem?.codigo > 0 ? configuracaoItem.codigo : ''}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={10}>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaAreaConhecimento}
                        nomeCampo={campoAreaConhecimento}
                        label={'Área de conhecimento'}
                        campoObrigatorio={true}
                    />
                </Col>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaDisciplinas}
                        nomeCampo={campoDisciplina}
                        label={'Componente curricular'}
                        campoObrigatorio={true}
                    />
                </Col>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaMatriz}
                        nomeCampo={campoMatriz}
                        label={'Matriz de avaliação'}
                        campoObrigatorio={true}
                    />
                </Col>
            </Row>
            <Separador />
            <Row gutter={10}>
                <Col>
                    <ModeloMatriz
                        setModeloMatriz={setModeloMatriz}
                        modelo={modelomatriz}
                        form={form}
                    ></ModeloMatriz>
                </Col>
            </Row>
            <Row gutter={10}>
                <Col>
                    <NivelEnsino
                        setNivelEnsino={setNivelEnsino}
                        nivelEnsino={nivelEnsino}
                        form={form}
                    ></NivelEnsino>
                </Col>
            </Row>
        </>
    );
};

export default React.memo(ConfiguracaoItem);
