import React, { useCallback, useEffect, useState } from 'react';
import { DefaultOptionType } from "antd/es/select";
import { Col, Form, FormProps, Row } from "antd";
import SelectForm from "~/components/select-form";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import configuracaoItemService from '~/services/configuracaoItem-service';
import { validarCampoForm } from '~/utils/funcoes';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { setConfiguracaoItemNovo } from '~/redux/modules/cadastroItem-novo/itemNovo/actions';

const CompetenciaHabilidade: React.FC<FormProps> = ({ form }) => {
    const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
    const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);

    const campoCompetencia = Campos.competencia;
    const campoHabilidade = Campos.habilidade;

    const matrizIdForm = Form.useWatch(Campos.matriz, form);
    const competenciaIdForm = Form.useWatch(Campos.competencia, form);
    const habilidadeIdForm = Form.useWatch(Campos.habilidade, form);

    // Redux
    const dispatch = useDispatch();
    const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);

    // 🔹 Popular selects
    const popularCampoSelectForm = useCallback(
        async (
            param: number | string | null,
            nomeCampo: Campos,
            setLista: React.Dispatch<React.SetStateAction<DefaultOptionType[]>>
        ) => {
            let resposta: DefaultOptionType[] = [];
            const parametroValido = !validarCampoForm(param);

            if (!parametroValido) {
                setLista([]);
                form?.setFieldValue(nomeCampo, null);
                return;
            }

            switch (nomeCampo) {
                case Campos.competencia:
                    resposta = await configuracaoItemService.obterCompetenciasMatriz(param);
                    break;
                case Campos.habilidade:
                    resposta = await configuracaoItemService.obterHabilidadesCompetencia(param);
                    break;
                default:
                    break;
            }

            setLista(resposta || []);
            if (resposta?.length === 1) {
                form?.setFieldValue(nomeCampo, resposta[0]?.value);
            }
        },
        [form],
    );

    // 🔹 Atualiza competências quando muda a matriz
    useEffect(() => {
        popularCampoSelectForm(matrizIdForm, campoCompetencia, setListaCompetencias);
    }, [matrizIdForm, campoCompetencia, popularCampoSelectForm]);

    // 🔹 Atualiza habilidades quando muda a competência
    useEffect(() => {
        popularCampoSelectForm(competenciaIdForm, campoHabilidade, setListaHabilidades);
    }, [competenciaIdForm, campoHabilidade, popularCampoSelectForm]);

    // 🔹 Atualiza Redux diretamente (sem objeto intermediário)
    useEffect(() => {
        dispatch(            
            setConfiguracaoItemNovo({
                ...configuracaoItemNovo,
                competencia: form?.getFieldValue(campoCompetencia)?.valor ?? form?.getFieldValue(campoCompetencia),
                habilidade: form?.getFieldValue(campoHabilidade)?.valor ?? form?.getFieldValue(campoHabilidade),
            }),
        );
    }, [competenciaIdForm, habilidadeIdForm, dispatch]);

    return (
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
    );
};

export default CompetenciaHabilidade;
