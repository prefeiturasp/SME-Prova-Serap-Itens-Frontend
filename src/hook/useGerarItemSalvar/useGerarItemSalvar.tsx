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
            codigoItem: values?.codigoItem ?? '',

            areaConhecimentoId: values?.identificacaoCard?.AreaConhecimento ?? null,
            disciplinaId: values?.identificacaoCard?.disciplinas ?? null,
            matrizId: values?.identificacaoCard?.matriz ?? null,
            anoMatrizId: values?.identificacaoCard?.anoMatriz ?? null,

            competenciaId: values?.compHabiCard?.competencia ?? null,
            habilidadeId: values?.compHabiCard?.habilidade ?? null,

            dificuldadeSugeridaId: values?.caracteristicasCard?.dificuldadeSugerida ?? null,
            nivelItem: values?.caracteristicasCard?.nivelItem ?? null,
            quantidadeAlternativasId: values?.caracteristicasCard?.quantidadeAlternativas ?? null,
            tipoItem: values?.caracteristicasCard?.tipoItem ?? null,
            situacao: values?.caracteristicasCard?.situacaoItem ?? null,

            assuntoId: values?.classificacaoCard?.assunto ?? null,
            subAssuntoId: values?.classificacaoCard?.subAssunto ?? null,
            palavrasChave: values?.classificacaoCard?.palavraChave ?? [],
            sentencaDescritora: values?.classificacaoCard?.sentencaDescritora ?? '',
            observacao: values?.classificacaoCard?.observacao ?? '',

            discriminacao: values?.informacoesCard?.discriminacao || null,
            dificuldade: values?.informacoesCard?.dificuldade || null,
            acertoCasual: values?.informacoesCard?.acertoCasual || null,
            parametroBTransformado: values?.informacoesCard?.parametroBTransformado || null,
            mediaEhDesvio: values?.informacoesCard?.mediaDesvioPadrao || null,

            textoBase: values?.textoBase ?? '',
            fonte: values?.fonte ?? '',
            enunciado: values?.enunciado ?? '',

            alternativasDto: [],
            arquivoVideoId: values?.video?.[0]?.idFile ?? null,
            arquivoAudioId: values?.audio?.[0]?.idFile ?? null,
        };

        // 👇 Se tiver alternativas no form, trata aqui
        if (values?.alternativasDto?.length) {
            dto.alternativasDto = values.alternativasDto.map((item: AltenativaDto) => {
                const correta = item.numeracao === values?.alternativaCorreta;
                return { ...item, correta };
            });
        }

        return dto;
    }, [form]);

    return gerarItemSalvar;
}