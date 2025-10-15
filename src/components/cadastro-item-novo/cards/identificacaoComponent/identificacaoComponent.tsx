import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Col, Form, Row } from 'antd';
import './identificacaoComponent.css';
import SelectForm from '~/components/select-form';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { DefaultOptionType } from 'antd/lib/select';
import { SelectValueType } from '~/domain/type/select';
import configuracaoItemService from '~/services/configuracaoItem-service';

interface Props {
  form: any;
  cardName: string;
}

const IdentificacaoComponent = ({ form, cardName }: Props) => {
    const campoAreaConhecimento = Campos.areaConhecimento;
    const campoDisciplina = Campos.disciplinas;
    const campoMatriz = Campos.matriz;
    const campoAnoMatriz = Campos.anoMatriz;

    const areaConhecimentoIdForm = Form.useWatch([cardName, campoAreaConhecimento], form);
    const disciplinaIdForm = Form.useWatch([cardName, campoDisciplina], form);
    const matrizIdForm = Form.useWatch([cardName, campoMatriz], form);

    const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
    const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
    const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);
    const [listaAnosMatriz, setListaAnosMatriz] = useState<DefaultOptionType[]>([]);

    
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

    useEffect(() => {
        form?.resetFields();
    }, [form, listaAreaConhecimento]);

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
        popularCampoSelectForm(disciplinaIdForm, campoMatriz, setListaMatriz);
    }, [disciplinaIdForm, campoMatriz, popularCampoSelectForm]);

    useEffect(() => {
        obterAnosMatriz();
    }, [matrizIdForm, campoAnoMatriz, obterAnosMatriz]);

    
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
                                nomeCampo={[cardName, campoAreaConhecimento]}
                                label={'Área de conhecimento'}
                                campoObrigatorio={true}
                                disabled={false}
                            />
                        </Col>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaDisciplinas}
                                nomeCampo={[cardName, campoDisciplina]}
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
                                nomeCampo={[cardName, campoMatriz]}
                                label={'Matriz de avaliação'}
                                campoObrigatorio={true}
                            />
                        </Col>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaAnosMatriz}
                                nomeCampo={[cardName, campoAnoMatriz]}
                                label={'Ano (ano escolar)'}
                                campoObrigatorio={true}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default IdentificacaoComponent;
