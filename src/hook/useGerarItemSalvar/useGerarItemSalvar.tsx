import { useCallback } from 'react';
import { cloneDeep } from 'lodash';
import { FormInstance } from 'antd';
import { ItemNovoDto } from '../../domain/dto/itemNovo-dto';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';

export function useGerarItemSalvar(form: FormInstance) {
    const gerarItemSalvar = useCallback(() => {
        const values = cloneDeep(form.getFieldsValue(true));


        const dto: ItemNovoDto = {
            id: values?.id ?? 0,
            codigoItem: values?.codigoItem ?? 0,

            AreaConhecimentoId: values?.identificacaoCard?.AreaConhecimento ?? null,
            DisciplinaId: values?.identificacaoCard?.disciplinas ?? null,
            MatrizId: values?.identificacaoCard?.matriz ?? null,
            AnoMatrizId: values?.identificacaoCard?.anoMatriz ?? null,

            CompetenciaId: values?.compHabiCard?.competencia ?? null,
            HabilidadeId: values?.compHabiCard?.habilidade ?? null,

            DificuldadeSugeridaId: values?.caracteristicasCard?.dificuldadeSugerida ?? null,
            NivelItem: values?.caracteristicasCard?.nivelItem
                ? Number(values.caracteristicasCard.nivelItem)
                : null,
            QuantidadeAlternativasId: values?.caracteristicasCard?.quantidadeAlternativas ?? null,
            TipoItem: values?.caracteristicasCard?.tipoItem ?? null,
            Situacao: values?.caracteristicasCard?.situacaoItem ?? null,

            AssuntoId: values?.classificacaoCard?.assunto ?? null,
            SubAssuntoId: values?.classificacaoCard?.subAssunto ?? null,
            PalavrasChave: values?.classificacaoCard?.palavraChave ?? [],
            SentencaDescritora: values?.classificacaoCard?.sentencaDescritora ?? '',
            Observacao: values?.classificacaoCard?.observacao ?? '',

            Discriminacao: values?.informacoesCard?.discriminacao || null,
            Dificuldade: values?.informacoesCard?.dificuldade || null,
            AcertoCasual: values?.informacoesCard?.acertoCasual || null,
            ParametroBTransformado: values?.informacoesCard?.parametroBTransformado || null,
            MediaEhDesvio: values?.informacoesCard?.mediaDesvioPadrao || null,

            TextoBase: values?.textoBase ?? '',
            Fonte: values?.fonte ?? '',
            Enunciado: values?.enunciado ?? '',

            AlternativasDto: [],
            ArquivoVideoId: values?.video?.[0]?.idFile ? Number(values.video[0].idFile) : 0,
            ArquivoAudioId: values?.audio?.[0]?.idFile ? Number(values.audio[0].idFile) : 0,

        };

        // 👇 Se tiver alternativas no form, trata aqui
        if (values?.alternativasDto?.length) {
            dto.AlternativasDto = values.alternativasDto.map((item: AltenativaDto) => {
                const correta = item.numeracao === values?.alternativaCorreta;
                return { ...item, correta };
            });
        }

        return dto;
    }, [form]);

    return gerarItemSalvar;
}