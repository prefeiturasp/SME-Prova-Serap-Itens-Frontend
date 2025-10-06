
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Col, FormProps, Row } from 'antd';
import './identificacaoComponent.css';
import SelectForm from '~/components/select-form';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { DefaultOptionType } from 'antd/lib/select';
import { SelectValueType } from '~/domain/type/select';
import configuracaoItemService from '~/services/configuracaoItem-service';


const IdentificacaoComponent: React.FC<FormProps> = ({ form }) => {

    const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
    const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
    const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);
    const [listaAnosEscolares, setListaAnosEscolares] = useState<DefaultOptionType[]>([]);

    const campoAreaConhecimento = Campos.areaConhecimento;
    const campoDisciplina = Campos.disciplinas;
    const campoMatriz = Campos.matriz;
    const campoAnoEscolar = Campos.anoEscolar;

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
                    console.log('resposta', resposta);
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


    return (
        <>
            <div className='card'>
                <div className='card-titulo'>
                    Identificação
                </div>
                <div className='card-subtitulo'>
                    Defina a localização desta questão na matriz curricular.
                </div>
                <div className='card-corpo'>
                    <Row>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaAreaConhecimento}
                                nomeCampo={campoAreaConhecimento}
                                label={'Área de conhecimento'}
                                campoObrigatorio={true}
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
                                options={listaAnosEscolares}
                                nomeCampo={campoAnoEscolar}
                                label={'Ano (ano escolar)'}
                                campoObrigatorio={true}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default IdentificacaoComponent;