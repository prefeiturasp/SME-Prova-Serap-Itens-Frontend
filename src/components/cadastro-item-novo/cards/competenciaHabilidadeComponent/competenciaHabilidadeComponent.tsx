import React, { useCallback, useEffect, useState } from 'react';
import { DefaultOptionType } from "antd/es/select";
import { Col, Form, Row } from "antd";
import SelectForm from "~/components/select-form";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import configuracaoItemService from '~/services/configuracaoItem-service';
import { validarCampoForm } from '~/utils/funcoes';

interface Props {
  form: any;
  cardName: string;
}

const CompetenciaHabilidade = ({ form, cardName }: Props) => {
    const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
    const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);

    const campoCompetencia = Campos.competencia;
    const campoHabilidade = Campos.habilidade;

    const matrizIdForm = Form.useWatch(Campos.matriz, form);
    const competenciaIdForm = Form.useWatch(Campos.competencia, form);    
    
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
                            nomeCampo={[cardName, campoCompetencia]}
                            label="Competência"
                            campoObrigatorio={true}
                        />
                    </Col>
                    <Col xs={24} md={12} className="card-campo">
                        <SelectForm
                            form={form}
                            options={listaHabilidades}
                            nomeCampo={[cardName,campoHabilidade]}
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
