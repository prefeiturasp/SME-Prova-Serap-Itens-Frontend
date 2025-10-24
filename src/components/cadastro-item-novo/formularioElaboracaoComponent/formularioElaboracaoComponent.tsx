import React from "react";
import { Col, Form, FormProps, Input, Row, Typography, Radio } from "antd";
import { TextEditor } from "~/components/lib/editor";

//css
import './formularioElaboracaoComponent.css';

// components personalizados
import UploadArquivosSME from "~/components/lib/upload";
import ButtonPrimary from "~/components/lib/button/primary";

// icones
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";

// Enums
import { Campos } from "~/domain/enums/campos-cadastro-item";

//services
import arquivoService from "~/services/arquivo-service";

const FormularioElaboracaoComponent: React.FC<FormProps> = ({ form }) => {
    if (!form) {
        return null;
    }

    // Campos
    const campoTextoBase = Campos.textoBase;
    const campoFonte = Campos.fonte;
    const campoEnunciado = Campos.enunciado;
    const campoCodigoItem = Campos.codigoItem;
    const campoVideo = Campos.video;
    const campoAudio = Campos.audio;
    const campoAlternativaA = Campos.alternativaA;
    const campoJustificativaA = Campos.justificativaA;
    const campoAlternativaB = Campos.alternativaB;
    const campoJustificativaB = Campos.justificativaB;
    const campoAlternativaC = Campos.alternativaC;
    const campoJustificativaC = Campos.justificativaC;
    const campoAlternativaD = Campos.alternativaD;
    const campoJustificativaD = Campos.justificativaD;
    const campoAlternativaCorreta = Campos.alternativaCorreta;



    return (
        <>
            <div className='card-elaboracao'>
                <div className='card-titulo-elaboracao'>Contexto do item</div>
                <div className='card-subtitulo-elaboracao'>
                    Forneça o contexto necessário para a compreensão do item.
                </div>
                <div className='card-corpo'>
                    <Row>
                        <Col xs={24} md={24} className='card-campo-elaboracao'>
                            <Form.Item
                                name={campoTextoBase}
                                label='Texto base'
                                style={{ marginBottom: 4 }}
                            >
                                <TextEditor
                                    placeholder='Descreva o texto que servirá como base para o item. Deixe em branco se o item for independente...'
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} className='card-campo-elaboracao'>
                            <Form.Item name={campoFonte} label='Fonte de pesquisa'>
                                <Input
                                    placeholder='Insira o link'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            </div>

            <div className='card-elaboracao'>
                <div className='card-titulo-elaboracao'>Enunciado do item</div>
                <div className='card-subtitulo-elaboracao'>
                    Formule o item que será aplicado aos estudantes.
                </div>
                <div className='card-corpo'>
                    <Row>
                        <Col xs={24} md={24} className='card-campo-elaboracao'>
                            <Form.Item
                                name={campoEnunciado}
                                label='Enunciado do item'
                                style={{ marginBottom: 4 }}
                            >
                                <TextEditor
                                    placeholder='Descreva o item que será feito aos estudantes...'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            </div>


            <div className='card-elaboracao'>
                <div className='card-titulo-elaboracao'>Alternativas</div>
                <div className='card-subtitulo-elaboracao'>
                    Configure as alternativas do item. Marque qual é a alternativa correta.
                </div>
                <div className='card-corpo'>
                    <Row style={{ marginBottom: 16 }}>
                        <Col xs={24}>
                            <Form.Item name={campoAlternativaCorreta} label="Alternativa correta">
                                <Radio.Group>
                                    <Radio value="A">A</Radio>
                                    <Radio value="B">B</Radio>
                                    <Radio value="C">C</Radio>
                                    <Radio value="D">D</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Alternativa A */}
                    <div className='alternativa-corpo-elaboracao' style={{ marginBottom: 24 }}>
                        <Row>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoAlternativaA}
                                    label='A) Alternativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    <TextEditor
                                        placeholder='Descreva a alternativa que será exibida aos estudantes...'
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoJustificativaA}
                                    label='Justificativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    <TextEditor
                                        placeholder='O estudante possivelmente assinalou essa alternativa porque...'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Alternativa B */}
                    <div className='alternativa-corpo-elaboracao'>
                        <Row>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoAlternativaB}
                                    label='B) Alternativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    <TextEditor
                                        placeholder='Descreva a alternativa que será exibida aos estudantes...'
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoJustificativaB}
                                    label='Justificativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    <TextEditor
                                        placeholder='O estudante possivelmente assinalou essa alternativa porque...'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Alternativa C */}
                    <div className='alternativa-corpo-elaboracao'>
                        <Row>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoAlternativaC}
                                    label='C) Alternativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    <TextEditor
                                        placeholder='Descreva a alternativa que será exibida aos estudantes...'
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoJustificativaC}
                                    label='Justificativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    <TextEditor
                                        placeholder='O estudante possivelmente assinalou essa alternativa porque...'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Alternativa D */}
                    <div className='alternativa-corpo-elaboracao'>
                        <Row>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoAlternativaD}
                                    label='D) Alternativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    <TextEditor
                                        placeholder='Descreva a alternativa que será exibida aos estudantes...'
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoJustificativaD}
                                    label='Justificativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    <TextEditor
                                        placeholder='O estudante possivelmente assinalou essa alternativa porque...'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>


            <div className='card-elaboracao'>
                <div className='card-titulo-elaboracao'>Recursos de acessibilidade</div>
                <div className='card-subtitulo-elaboracao'>
                    Insira arquivos de mídia para complementar o item
                </div>
                <div className='card-corpo'>
                    <Row>
                        <Col xs={24} md={12} className='card-campo-elaboracao'>
                            <UploadArquivosSME
                                form={form}
                                isDraggerUpload={false}
                                uploadService={arquivoService.uploadVideo}
                                formItemProps={{
                                    name: campoVideo,
                                    label: 'Vídeo',
                                }}
                                uploadProps={{
                                    maxCount: 1,
                                    showUploadList: {
                                        downloadIcon: false,
                                    },
                                }}
                                tiposArquivosPermitidos={[
                                    'video/mp4',
                                    'video/webm',
                                    'video/ogg',
                                    'application/ogg',
                                    'video/x-flv',
                                    'application/x-mpegURL',
                                    'video/MP2T',
                                    'video/3gpp',
                                    'video/quicktime',
                                    'video/x-msvideo',
                                    'video/x-ms-wmv',
                                ]}
                            >
                                <ButtonPrimary
                                    icon={<FontAwesomeIcon icon={faCloudUpload} style={{ marginRight: 5 }} />}
                                >
                                    UPLOAD VÍDEO
                                </ButtonPrimary>
                                <Typography.Text>Tamanho máximo 10MB</Typography.Text>
                            </UploadArquivosSME>
                        </Col>
                        <Col xs={24} md={12} className='card-campo-elaboracao'>
                            <UploadArquivosSME
                                form={form}
                                isDraggerUpload={false}
                                uploadService={arquivoService.uploadAudio}
                                formItemProps={{
                                    name: campoAudio,
                                    label: 'Áudio',
                                }}
                                uploadProps={{
                                    maxCount: 1,
                                    showUploadList: {
                                        downloadIcon: false,
                                    },
                                }}
                                tiposArquivosPermitidos={[
                                    'audio/mpeg',
                                    'audio/mp4',
                                    'audio/mp3',
                                    'audio/vnd.wav',
                                    'audio/x-ms-wma',
                                    'audio/ogg',
                                ]}
                            >
                                <ButtonPrimary
                                    icon={<FontAwesomeIcon icon={faCloudUpload} style={{ marginRight: 5 }} />}
                                >
                                    UPLOAD ÁUDIO
                                </ButtonPrimary>
                                <Typography.Text>Tamanho máximo 10MB</Typography.Text>
                            </UploadArquivosSME>
                        </Col>
                    </Row>
                </div>
            </div>


            <div className='card-elaboracao'>
                <div className='card-titulo-elaboracao'>Código do item</div>
                <div className='card-subtitulo-elaboracao'>
                    Um código será gerado automaticamente após o preenchimento das informações anteriores. Você pode usar o sugerido ou digitar um de sua preferência.
                </div>
                <div className='card-corpo'>
                    <Row>
                        <Col xs={24} md={24} className='card-campo-elaboracao'>
                            <Form.Item name={campoCodigoItem} label='Código do item'>
                                <Input
                                    placeholder='Digite o código...'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );

}

export default FormularioElaboracaoComponent;