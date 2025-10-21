import { Col, Form, FormProps, notification, Row, Spin } from "antd";
import React, { useCallback, useState } from "react";

//css
import './cadastrarItemNovo.css';
import './cadastrarItemNovoElaboracao.css';
import CadastrarItemHeaderComponent from "./cadastrarItemHeaderComponent";

const CadastrarItemNovoElaboracao: React.FC<FormProps> = ({form}) => {

    const [carregando, setCarregando] = useState<boolean>(false);

    type tipoMsg = 'success' | 'info' | 'warning' | 'error';
    const [api, contextHolder] = notification.useNotification();
    const mensagem = useCallback(
            async (tipo: tipoMsg, titulo: string, msg: string) => {
                api[tipo]({ message: titulo, description: msg });
            },
            [api],
        );

    const initialValuesForm = {}

  return (
    <>
            <Spin size='small'
                spinning={carregando}
            >
                {contextHolder}

                <Form
                    className='form'
                    form={form}
                    layout='vertical'
                    autoComplete='off'
                    initialValues={initialValuesForm}
                    style={{
                        margin: 0,
                    }}
                >
                    {/* <Affix offsetTop={0.1} style={{ marginBottom: 30 }}> */}
                    <CadastrarItemHeaderComponent pagina={2} />
                    

                    {/* </Affix> */}

                </Form>
            </Spin>
        </>
  );
};

export default CadastrarItemNovoElaboracao;