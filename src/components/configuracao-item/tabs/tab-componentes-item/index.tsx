import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { Col, Form, FormProps, Row, Radio } from 'antd';
import SelectForm from '~/components/select-form';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { ComponentesItemProps } from '~/redux/modules/cadastro-item/item/reducers';
import { DefaultOptionType } from 'antd/lib/select';
import { CheckboxOptionType } from 'antd/es/checkbox/Group';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { setComponentesItem } from '~/redux/modules/cadastro-item/item/actions';
import { SelectValueType } from '~/domain/type/select';
import './tabComponentesItemStyles.css';

interface TabComponentesItemProps extends FormProps {
    testeNome: string;
}

const ComponentesItem: React.FC<TabComponentesItemProps> = ({ form }) => {

    const dispatch = useDispatch();
    const item = useSelector((state: AppState) => state.item);
    const componentesItem = useSelector((state: AppState) => state.componentesItem);

    const campoCompetencia = Campos.competencia;
    const campoHabilidade = Campos.habilidade;
    const campoAnoMatriz = Campos.anoMatriz;
    const campoDificuldadeSugerida = Campos.dificuldadeSugerida;

    const matrizIdForm = Form.useWatch(Campos.matriz, form);
    const competenciaIdForm = Form.useWatch(Campos.competencia, form);
    const anoMatrizForm = Form.useWatch(campoAnoMatriz, form);
    const dificuldadeSugeridaForm = Form.useWatch(campoDificuldadeSugerida, form);
    const habilidadeForm = Form.useWatch(campoHabilidade, form);

    const [objTabComponentesItem, setObjTabComponentesItem] =
        useState<ComponentesItemProps>(componentesItem);
    const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
    const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);
    const [listaAnosMatriz, setListaAnosMatriz] = useState<CheckboxOptionType[]>([]);

    const initListaDificuldadeSugerida: CheckboxOptionType[] =
        [{ label: '1 - Muito Fácil', value: 5 },
        { label: '2 - Fácil', value: 1 },
        { label: '3 - Médio', value: 2 },
        { label: '4 - Difícil', value: 3 },
        { label: '5 - Muito Difícil', value: 4 },];
    const [listaDificuldadeSugerida, setListaDificuldadeSugerida] = useState<CheckboxOptionType[]>(initListaDificuldadeSugerida);

    const converterListaAnosMatriz = (lista?: DefaultOptionType[]) => {
        if (!lista || lista?.length == 0 || lista == null || lista == undefined)
            return [];
        const retorno = lista.map((item) => {
            return { value: item.value, label: item.label } as CheckboxOptionType
        });
        return retorno;
    };

    const popularCampoSelectForm = useCallback(
        async (
            param: SelectValueType,
            nomeCampo: Campos,
            setLista: Dispatch<SetStateAction<DefaultOptionType[]>>,
        ) => {

            let resposta: DefaultOptionType[] = [];
            switch (nomeCampo) {
                case Campos.competencia:
                    if (!param || param == null || param == undefined) return [];
                    resposta = await configuracaoItemService.obterCompetenciasMatriz(param);
                    break;
                case Campos.habilidade:
                    if (!param || param == null || param == undefined) return [];
                    resposta = await configuracaoItemService.obterHabilidadesCompetencia(param);
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

        }, [form]);

    const obterAnosMatriz = useCallback(async () => {
        if (!matrizIdForm || matrizIdForm == null || matrizIdForm == undefined) {
            setListaAnosMatriz([]);
            return false;
        }
        const resposta = await configuracaoItemService.obterAnosMatriz(matrizIdForm);
        if (resposta?.length) {
            setListaAnosMatriz(converterListaAnosMatriz(resposta));
            if (resposta.length === 1) form?.setFieldValue(campoAnoMatriz, resposta[0].value);
        } else {
            setListaAnosMatriz([]);
            form?.setFieldValue(campoAnoMatriz, null);
        }
    }, [form, matrizIdForm]);

    useEffect(() => {
        popularCampoSelectForm(matrizIdForm, campoCompetencia, setListaCompetencias);
        obterAnosMatriz();
    }, [matrizIdForm, campoCompetencia, popularCampoSelectForm]);

    useEffect(() => {
        popularCampoSelectForm(competenciaIdForm, campoHabilidade, setListaHabilidades);
    }, [competenciaIdForm, campoHabilidade, item, dispatch, popularCampoSelectForm]);

    useEffect(() => {
        const novoObj: ComponentesItemProps = {
            competencia: competenciaIdForm,
            habilidade: habilidadeForm,
            anoMatriz: anoMatrizForm,
            dificuldadeSugerida: dificuldadeSugeridaForm,
        };
        setObjTabComponentesItem(novoObj);
    }, [competenciaIdForm, anoMatrizForm, dificuldadeSugeridaForm, habilidadeForm]);

    useEffect(() => {
        dispatch(setComponentesItem(objTabComponentesItem));
    }, [objTabComponentesItem, dispatch]);

    return (
        <>
            <Row gutter={10}>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaCompetencias}
                        nomeCampo={campoCompetencia}
                        label={'Competência'}
                        rules={[]}
                    ></SelectForm>
                </Col>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaHabilidades}
                        nomeCampo={campoHabilidade}
                        label={'Habilidade'}
                        rules={[]}
                    ></SelectForm>
                </Col>
                <Col span={8}>
                </Col>
            </Row>
            <hr />
            <Row gutter={10}>
                <Col span={8}>
                    <Form.Item label='Selecione o ano' name={campoAnoMatriz}>
                        <Radio.Group options={listaAnosMatriz} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={10}>
                <Col span={10}>
                    <Form.Item label='Dificuldade sugerida' name={campoDificuldadeSugerida}>
                        <Radio.Group
                            className='dificuldadeSugerida'
                            id='rblDificuldadeSugerida'
                            buttonStyle='solid'
                            optionType='button'
                            options={listaDificuldadeSugerida}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};

export default ComponentesItem;
