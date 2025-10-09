import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { DefaultOptionType } from "antd/es/select";
import { Col, Form, FormProps, Row } from "antd";
import SelectForm from "~/components/select-form";
import { SelectValueType } from '~/domain/type/select';
import { Campos } from "~/domain/enums/campos-cadastro-item";
import configuracaoItemService from '~/services/configuracaoItem-service';
import {
    validarCampoForm
} from '~/utils/funcoes';


const CompetenciaHabilidade: React.FC<FormProps> = ({ form }) => {

    const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
    const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);    

    const campoCompetencia = Campos.competencia;
    const campoHabilidade = Campos.habilidade;    
    
    const matrizIdForm = Form.useWatch(Campos.matriz, form);
    const competenciaIdForm = Form.useWatch(Campos.competencia, form);    

    const popularCampoSelectForm = useCallback(
        async (
            param: SelectValueType,
            nomeCampo: Campos,
            setLista: Dispatch<SetStateAction<DefaultOptionType[]>>,
        ) => {

            let resposta: DefaultOptionType[] = [];
            const parametroValido = !validarCampoForm(param);
            switch (nomeCampo) {
                case Campos.competencia:
                    if (parametroValido)                        
                        resposta = await configuracaoItemService.obterCompetenciasMatriz(param);                        
                    break;
                case Campos.habilidade:
                    if (parametroValido)
                        resposta = await configuracaoItemService.obterHabilidadesCompetencia(param);
                    break;
                default:
                    break;
            }

            if (resposta?.length) {
                setLista(resposta);
                if (resposta.length === 1) {
                    if (Campos.quantidadeAlternativas === nomeCampo) {
                        form?.setFieldValue(nomeCampo, resposta[0]);
                    } else {
                        form?.setFieldValue(nomeCampo, resposta[0]?.value);
                    }
                }
            } else {
                setLista([]);
                form?.setFieldValue(nomeCampo, null);
            }
        },
        [form],
    );
   
    useEffect(() => {
        popularCampoSelectForm(matrizIdForm, campoCompetencia, setListaCompetencias);
        
    }, [matrizIdForm, campoCompetencia, popularCampoSelectForm]);

    useEffect(() => {
        popularCampoSelectForm(competenciaIdForm, campoHabilidade, setListaHabilidades);
    }, [competenciaIdForm, campoHabilidade, popularCampoSelectForm]);

    return (
        <>
            <div className='card'>
                <div className='card-titulo'>
                    Competências e habilidades
                </div>
                <div className='card-subtitulo'>
                    Vincule o item às competências e habilidades.
                </div>
                <div className='card-corpo'>
                    <Row>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaCompetencias}
                                nomeCampo={campoCompetencia}
                                label={'Competência'}
                                campoObrigatorio={true}
                            />
                        </Col>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaHabilidades}
                                nomeCampo={campoHabilidade}
                                label={'Habilidade'}
                                campoObrigatorio={true}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default CompetenciaHabilidade;
