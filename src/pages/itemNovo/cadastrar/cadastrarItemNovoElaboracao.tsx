import React, { useCallback, useState } from "react";
import { Button, Form, FormProps, notification, Spin } from 'antd';

//css
import './cadastrarItemNovo.css';
import CadastrarItemHeaderComponent from "./cadastrarItemHeaderComponent";
import CadastrarItemRodapeComponent from "./cadastrarItemRodapeComponent";

const CadastrarItemNovoElaboracao: React.FC<FormProps> = ({ form }) => {

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

                    <div className='cadastrarItem-corpo'>
                        <div className='cadastrarItem-titulo-corpo'>
                            <div className='cadastrarItem-titulo'>
                                Edite o item
                            </div>
                            <div className='cadastrarItem-subtitulo'>
                                Esses dados garantem que o item esteja alinhado à matriz de avaliação e possa ser aplicado corretamente.
                            </div>
                        </div>



                        <div className='cadastrarItem-botoes'>
                            <div className='cadastrarItem-btn'>
                                <Button className='btnVoltar'
                                // onClick={voltar}
                                >
                                    Voltar
                                </Button>
                            </div>
                            <div className='cadastrarItem-btn'>
                                <Button
                                    type='primary'
                                    // onClick={() => salvarItem(true)}
                                    // disabled={bloquearBtnSalvarRascunho}
                                    className='btnRascunho'
                                >
                                    Salvar rascunho
                                </Button>
                            </div>
                            <div className='cadastrarItem-btn'>
                                <Button className='btnAvancar'
                                // onClick={voltar}
                                >Avançar</Button>
                            </div>
                        </div>
                    </div>
                    <CadastrarItemRodapeComponent />
                </Form>
            </Spin>
        </>
    );
};

export default CadastrarItemNovoElaboracao;