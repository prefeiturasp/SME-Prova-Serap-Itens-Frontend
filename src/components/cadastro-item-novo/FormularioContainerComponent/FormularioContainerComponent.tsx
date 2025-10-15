import React, { useCallback, useEffect, useState } from "react";
import { Form, notification } from 'antd';
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useGerarItemSalvar } from "~/hook/useGerarItemSalvar/useGerarItemSalvar";
import { ItemNovoDto } from "~/domain/dto/itemNovo-dto";
import configuracaoItemService from "~/services/configuracaoItem-service";
import { ConfiguracaoItemNovoProps } from "~/domain/interface/IConfiguracaoItemNovoProps";


const FormularioContainerComponent = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const gerarItemSalvar = useGerarItemSalvar(form);

    const [carregando, setCarregando] = useState<boolean>(false);

    const [itemAtual, setItemAtual] = useState<ItemNovoDto | null>(null);

    const [objTabConfiguracaoItem, setObjTabConfiguracaoItem] = useState<ConfiguracaoItemNovoProps>({
        codigo: '',
        areaConhecimento: null,
        disciplina: null,
        matriz: null,
        competencia: null,
        habilidade: null,
        anoMatriz: null,
        assunto: null,
        subAssunto: null,
        situacaoItem: null,
        tipoItem: null,
        quantidadeAlternativas: null,
        dificuldadeSugerida: null,
        discriminacao: null,
        dificuldade: null,
        nivelItem: null,
        acertoCasual: null,
        palavrasChave: [],
        parametroBTransformado: null,
        mediaDesvioPadrao: null,
        sentencaDescritora: '',
        observacao: '',
    });

    type tipoMsg = 'success' | 'info' | 'warning' | 'error';
    const [api, contextHolder] = notification.useNotification();
    const mensagem = useCallback(
        async (tipo: tipoMsg, titulo: string, msg: string) => {
            api[tipo]({ message: titulo, description: msg });
        },
        [api],
    );

    const obterDadosItem = useCallback(
        async (id: number) => {
            setCarregando(true);
            try {
                const resp = await configuracaoItemService.obterItem(id);
                const configuracaoItemRetorno: ConfiguracaoItemNovoProps = {
                    ...objTabConfiguracaoItem,
                    codigo: resp?.data?.codigoItem,
                };
                const itemNovo: ItemNovoDto = { ...resp.data, id, /* outros campos se necessário */ };
                setObjTabConfiguracaoItem(configuracaoItemRetorno);
                setItemAtual(itemNovo); // substitui o Redux
            } catch (err: any) {
                console.log("Erro", err.message);
                mensagem("error", "Erro", "Falha ao obter item");
            } finally {
                setCarregando(false);
            }
        },
        [mensagem, objTabConfiguracaoItem]
    );


    const inserirRascunhoItem = useCallback(
        async (item: ItemNovoDto) => {
            try {
                const resp = await configuracaoItemService.salvarRascunhoItemNovo(item);
                await obterDadosItem(resp.data); // mantém preenchendo form e estado
                mensagem("success", "Sucesso", "Rascunho de item cadastrado com sucesso");
            } catch (err: any) {
                console.log("Erro", err.message);
                mensagem("error", "Erro", "Ocorreu um erro ao cadastrar o rascunho");
            }
        },
        [mensagem, obterDadosItem]
    );


    // const inserirItem = useCallback(
    //     async (item: ItemNovoDto) => {
    //         setCarregando(true);
    //         try {
    //             const resp = await configuracaoItemService.salvarItemNovo(item);

    //             // Atualiza os estados locais
    //             const configuracaoItemRetorno: ConfiguracaoItemNovoProps = {
    //                 ...objTabConfiguracaoItem,
    //                 codigo: resp?.data?.codigoItem,
    //             };
    //             const itemNovo: ItemNovoDto = { ...resp.data, id: resp.data.id }; // ou outros campos se necessário

    //             setObjTabConfiguracaoItem(configuracaoItemRetorno);
    //             setItemAtual(itemNovo);

    //             // Opcional: atualizar o form, se precisar
    //             // form.setFieldsValue({ ... }); 

    //             mensagem('success', 'Sucesso', 'Item cadastrado com sucesso');
    //         } catch (err: any) {
    //             console.log('Erro', err.message);
    //             mensagem('error', 'Erro', 'Ocorreu um erro ao cadastrar o item');
    //         } finally {
    //             setCarregando(false);
    //         }
    //     },
    //     [mensagem, objTabConfiguracaoItem]
    // );

    const handleSalvarRascunho = useCallback(
        async (rascunho = false) => {
            setCarregando(true);
            const itemSalvar = gerarItemSalvar();
            if (itemAtual?.id) {
                setTimeout(() => {
                    mensagem('info', 'Atenção', `Item já cadastrado, id:${itemAtual.id}`);
                }, 0);
            } else {
                if (rascunho) {
                    await inserirRascunhoItem(itemSalvar);
                } else {
                    //await inserirItem(itemSalvar); // caso você implemente
                }
            }
            setCarregando(false);
        },
        [itemAtual, gerarItemSalvar, inserirRascunhoItem, mensagem]
        //inserirItem
    );


    const handleAvancar = async () => {
        await handleSalvarRascunho();
        navigate('/itens/novo/pagina2');
    };

    const handleVoltar = () => {
        navigate("/");
    };

    const handleVoltarPrimeiraPagina = () => {
        console.log("🔙 Voltando para página 1 com form:", form.getFieldsValue());
        navigate("/itens/novo/pagina1");
    };

    const { id } = useParams();
    useEffect(() => {
        if (id) {
            // Buscar no backend e preencher o form
            // api.get(`/itens/${id}`).then(res => {
            //     // form.setFieldsValue(res.data);
            // });
        }
    }, [id]);


    // type tipoMsg = 'success' | 'info' | 'warning' | 'error';
    // const [api, contextHolder] = notification.useNotification();
    // const mensagem = useCallback(
    //     async (tipo: tipoMsg, titulo: string, msg: string) => {
    //         api[tipo]({ message: titulo, description: msg });
    //     },
    //     [api],
    // );



    return (
        <>
            {contextHolder}
            <Form form={form} layout="vertical">
                <Outlet context={{
                    form, handleSalvarRascunho,
                    handleAvancar, handleVoltar,
                    handleVoltarPrimeiraPagina
                }} />
            </Form>
        </>
    );
};

export default FormularioContainerComponent;
