import React, { Component, Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { Button, Col, Form, FormProps, Row, Input, Space, notification, Spin } from 'antd';
import SelectForm from '~/components/select-form';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { setIdCompetencia, setListaCompetencias } from '~/redux/modules/cadastro-item/item/actions';

interface ComponentesItemProps extends FormProps {
    testeNome: string;
}

const ComponentesItem: React.FC<ComponentesItemProps> = ({ form }) => {

    const dispatch = useDispatch();
    const item = useSelector((state: AppState) => state.item);
    const campoCompetencia = Campos.competencia;
    const matrizIdForm = Form.useWatch(Campos.matriz, form);
    const competenciaIdForm = Form.useWatch(Campos.competencia, form);

    const obterCompetenciasMatriz = useCallback(async () => {
        console.log('item.matriz', item.matriz);
        const resposta = await configuracaoItemService.obterCompetenciasMatriz(matrizIdForm);
        console.log('resposta', resposta);
        if (resposta?.length) {
            dispatch(setListaCompetencias(resposta));
            if (resposta.length === 1) form?.setFieldValue(campoCompetencia, resposta[0].value);
        } else {
            dispatch(setListaCompetencias([]));
            form?.setFieldValue(campoCompetencia, null);
        }
    }, [form, matrizIdForm]);

    useEffect(() => {
        if (matrizIdForm && matrizIdForm !== undefined && matrizIdForm !== null)
            obterCompetenciasMatriz();
    }, [matrizIdForm]);

    useEffect(() => {
        dispatch(setIdCompetencia(competenciaIdForm));
    }, [competenciaIdForm]);

    return (
        <>
            <h1>Componentes do item</h1>
            <Row gutter={2}>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={item.listaCompetencias}
                        nomeCampo={campoCompetencia}
                        label={'Competência'}
                        rules={[]}
                    ></SelectForm>
                </Col>
            </Row>
        </>
    );
};

export default ComponentesItem;
