import React, { useEffect } from "react";
import { Form} from 'antd';
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useGerarItemSalvar } from "~/hook/useGerarItemSalvar/useGerarItemSalvar";


const FormularioContainerComponent = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const gerarItemSalvar = useGerarItemSalvar(form);


    const handleSalvarRascunho = async () => {
        const dto = gerarItemSalvar();
        console.log('DTO final pra enviar:', dto);
        // Chamar backend
    };

    const handleAvancar = async () => {
        await handleSalvarRascunho();
        navigate('/formulario/pagina2');
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
            <Form form={form} layout="vertical">
                <Outlet context={{ form, handleSalvarRascunho, handleAvancar }} />
            </Form>
        </>
    );
};

export default FormularioContainerComponent;
