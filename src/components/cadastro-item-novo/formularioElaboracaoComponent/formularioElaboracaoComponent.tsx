import React, { useEffect, useState } from "react";
import { Col, Form, FormProps, Input, Row, Radio, Modal, Button, Card, Space, Typography } from "antd";
import { TextEditor } from "~/components/lib/editor";
import { EditOutlined, PlayCircleOutlined, PauseCircleOutlined, DownloadOutlined, SoundOutlined } from '@ant-design/icons';

const { Text } = Typography;

//css
import './formularioElaboracaoComponent.css';

// components personalizados
import UploadArquivosSME from "~/components/lib/upload";
import ButtonPrimary from "~/components/lib/button/primary";

// Enums
import { Campos } from "~/domain/enums/campos-cadastro-item";

//services
import arquivoService from "~/services/arquivo-service";

const MOCK_VIDEO_URLS = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
];

const MOCK_AUDIO_URLS = [
    "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    // "https://file-examples.com/storage/feb42d72566dd2085bca1b7/2017/11/file_example_WAV_1MG.wav"
    // "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",    
    // "https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a",
    
];

const MOCK_VIDEO_UPLOADED = {
    url: MOCK_VIDEO_URLS[0],
    name: 'video-exemplo.mp4',
    size: 1048576, // 1MB
    type: 'video/mp4',
    status: 'done',
    uid: `video-mock-${Date.now()}`,
};

const MOCK_AUDIO_UPLOADED = {
    url: MOCK_AUDIO_URLS[0],
    name: 'audio-exemplo.wav',
    size: 512000, // 500KB
    type: 'audio/wav',
    status: 'done',
    uid: `audio-mock-${Date.now()}`,
};

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

    // Estado para controlar a visibilidade do modal
    const [isModalAVisible, setIsModalAVisible] = useState(false);
    const [isModalBVisible, setIsModalBVisible] = useState(false);
    const [isModalCVisible, setIsModalCVisible] = useState(false);
    const [isModalDVisible, setIsModalDVisible] = useState(false);

    // Estados para preview de mídia
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    // 🛡️ Estados para controlar se os TextEditors devem ser renderizados (proteção contra erro de produção)
    const [renderTextEditorA, setRenderTextEditorA] = useState(true);
    const [renderTextEditorB, setRenderTextEditorB] = useState(true);
    const [renderTextEditorC, setRenderTextEditorC] = useState(true);
    const [renderTextEditorD, setRenderTextEditorD] = useState(true);

    //Exibe os valores do radio
    const [alternativaA, setAlternativaA] = useState<string>('');
    const [alternativaB, setAlternativaB] = useState<string>('');
    const [alternativaC, setAlternativaC] = useState<string>('');
    const [alternativaD, setAlternativaD] = useState<string>('');

    const [justificativaA, setJustificativaA] = useState<string>('');
    const [justificativaB, setJustificativaB] = useState<string>('');
    const [justificativaC, setJustificativaC] = useState<string>('');
    const [justificativaD, setJustificativaD] = useState<string>('');

    const handleAlternativaAChange = (value: string) => {
        setAlternativaA(value || '');
    };
    const handleAlternativaBChange = (value: string) => {
        setAlternativaB(value || '');
    };
    const handleAlternativaCChange = (value: string) => {
        setAlternativaC(value || '');
    };
    const handleAlternativaDChange = (value: string) => {
        setAlternativaD(value || '');
    };
    const handleJustificativaAChange = (value: string) => {
        setJustificativaA(value || '');
    };
    const handleJustificativaBChange = (value: string) => {
        setJustificativaB(value || '');
    };
    const handleJustificativaCChange = (value: string) => {
        setJustificativaC(value || '');
    };
    const handleJustificativaDChange = (value: string) => {
        setJustificativaD(value || '');
    };

    // 🛡️ Função helper para renderização condicional de TextEditor
    const renderTextEditorSafe = (shouldRender: boolean, value: string, onChange: (value: any) => void, placeholder: string) => {
        if (shouldRender) {
            return (
                <TextEditor
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            );
        }
        return <div style={{ minHeight: '100px', backgroundColor: '#f5f5f5' }}>Carregando...</div>;
    };

    // 🎬 Funções para controle de mídia
    const handleVideoPlay = async () => {
        const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
        if (videoElement) {
            try {
                if (isVideoPlaying) {
                    videoElement.pause();
                    setIsVideoPlaying(false);
                    console.log('🎬 Vídeo pausado');
                } else {
                    await videoElement.play();
                    setIsVideoPlaying(true);
                    console.log('🎬 Vídeo reproduzindo');
                }
            } catch (error) {
                console.error('❌ Erro ao reproduzir vídeo:', error);
                setIsVideoPlaying(false);
            }
        } else {
            console.warn('⚠️ Elemento de vídeo não encontrado');
        }
    };

    const handleAudioPlay = async () => {
        const audioElement = document.getElementById('preview-audio') as HTMLAudioElement;
        if (audioElement) {
            try {
                if (isAudioPlaying) {
                    audioElement.pause();
                    setIsAudioPlaying(false);
                    console.log('🎵 Áudio pausado');
                } else {
                    await audioElement.play();
                    setIsAudioPlaying(true);
                    console.log('🎵 Áudio reproduzindo');
                }
            } catch (error) {
                console.error('❌ Erro ao reproduzir áudio:', error);
                setIsAudioPlaying(false);
            }
        } else {
            console.warn('⚠️ Elemento de áudio não encontrado');
        }
    };

    const handleDownloadVideo = () => {
        if (videoUrl) {
            const link = document.createElement('a');
            link.href = videoUrl;
            link.download = 'video-exemplo.mp4';
            link.click();
        }
    };

    const handleDownloadAudio = () => {
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = 'audio-exemplo.wav';
            link.click();
        }
    };

    useEffect(() => {
        const itemSalvo = localStorage.getItem('itemAtual');
        if (itemSalvo) {
            try {
                const item = JSON.parse(itemSalvo);

                const safeString = (value: any): string => {
                    if (value === null || value === undefined) return '';
                    return String(value);
                };

                setAlternativaA(safeString(item.elaboracao?.alternativaA));
                setAlternativaB(safeString(item.elaboracao?.alternativaB));
                setAlternativaC(safeString(item.elaboracao?.alternativaC));
                setAlternativaD(safeString(item.elaboracao?.alternativaD));
                setJustificativaA(safeString(item.elaboracao?.justificativaA));
                setJustificativaB(safeString(item.elaboracao?.justificativaB));
                setJustificativaC(safeString(item.elaboracao?.justificativaC));
                setJustificativaD(safeString(item.elaboracao?.justificativaD));
            } catch (error) {
                console.error('❌ Erro ao carregar dados do localStorage:', error);

                setAlternativaA('');
                setAlternativaB('');
                setAlternativaC('');
                setAlternativaD('');
                setJustificativaA('');
                setJustificativaB('');
                setJustificativaC('');
                setJustificativaD('');
            }
        }
    }, []);

    const showModal = (nomeModal: string) => {
        switch (nomeModal) {
            case "modalA":
                setIsModalAVisible(true);
                break;
            case "modalB":
                setIsModalBVisible(true);
                break;
            case "modalC":
                setIsModalCVisible(true);
                break;
            case "modalD":
                setIsModalDVisible(true);
                break;
            default:
                break;
        }
    };

    const handleOk = (nomeModal: string) => {
        switch (nomeModal) {
            case "modalA":
                setIsModalAVisible(false);
                break;
            case "modalB":
                setIsModalBVisible(false);
                break;
            case "modalC":
                setIsModalCVisible(false);
                break;
            case "modalD":
                setIsModalDVisible(false);
                break;
            default:
                break;
        }
    };

    const handleCancel = (nomeModal: string) => {
        switch (nomeModal) {

            case "modalA":
                // 🛡️ Desabilita TextEditor temporariamente para evitar erro em produção
                setRenderTextEditorA(false);

                setTimeout(() => {
                    setIsModalAVisible(false);
                    setAlternativaA('');
                    setJustificativaA('');
                    form?.resetFields([campoAlternativaA, campoJustificativaA]);

                    const itemAtualA = localStorage.getItem('itemAtual');
                    if (itemAtualA) {
                        const item = JSON.parse(itemAtualA);
                        if (item.elaboracao) {
                            item.elaboracao.alternativaA = '';
                            item.elaboracao.justificativaA = '';
                            localStorage.setItem('itemAtual', JSON.stringify(item));
                        }
                    }

                    // 🔄 Reabilita TextEditor após fechar modal
                    setTimeout(() => setRenderTextEditorA(true), 100);
                }, 50);
                break;
            case "modalB":
                // 🛡️ Desabilita TextEditor temporariamente para evitar erro em produção
                setRenderTextEditorB(false);

                setTimeout(() => {
                    setIsModalBVisible(false);
                    setAlternativaB('');
                    setJustificativaB('');
                    form?.resetFields([campoAlternativaB, campoJustificativaB]);

                    const itemAtualB = localStorage.getItem('itemAtual');
                    if (itemAtualB) {
                        const item = JSON.parse(itemAtualB);
                        if (item.elaboracao) {
                            item.elaboracao.alternativaB = '';
                            item.elaboracao.justificativaB = '';
                            localStorage.setItem('itemAtual', JSON.stringify(item));
                        }
                    }

                    // 🔄 Reabilita TextEditor após fechar modal
                    setTimeout(() => setRenderTextEditorB(true), 100);
                }, 50);
                break;
            case "modalC":
                // 🛡️ Desabilita TextEditor temporariamente para evitar erro em produção
                setRenderTextEditorC(false);

                setTimeout(() => {
                    setIsModalCVisible(false);
                    setAlternativaC('');
                    setJustificativaC('');
                    form?.resetFields([campoAlternativaC, campoJustificativaC]);

                    const itemAtualC = localStorage.getItem('itemAtual');
                    if (itemAtualC) {
                        const item = JSON.parse(itemAtualC);
                        if (item.elaboracao) {
                            item.elaboracao.alternativaC = '';
                            item.elaboracao.justificativaC = '';
                            localStorage.setItem('itemAtual', JSON.stringify(item));
                        }
                    }

                    // 🔄 Reabilita TextEditor após fechar modal
                    setTimeout(() => setRenderTextEditorC(true), 100);
                }, 50);
                break;
            case "modalD":
                // 🛡️ Desabilita TextEditor temporariamente para evitar erro em produção
                setRenderTextEditorD(false);

                setTimeout(() => {
                    setIsModalDVisible(false);
                    setAlternativaD('');
                    setJustificativaD('');
                    form?.resetFields([campoAlternativaD, campoJustificativaD]);

                    const itemAtualD = localStorage.getItem('itemAtual');
                    if (itemAtualD) {
                        const item = JSON.parse(itemAtualD);
                        if (item.elaboracao) {
                            item.elaboracao.alternativaD = '';
                            item.elaboracao.justificativaD = '';
                            localStorage.setItem('itemAtual', JSON.stringify(item));
                        }
                    }

                    // 🔄 Reabilita TextEditor após fechar modal
                    setTimeout(() => setRenderTextEditorD(true), 100);
                }, 50);
                break;
            default:
                break;
        }
    };

    // 🎬 MOCK: Simular que vídeo e áudio já foram feitos upload
    useEffect(() => {
        const mockTimer = setTimeout(() => {
            if (form) {
                console.log('🎬 Simulando upload já feito - Vídeo e Áudio');

                // Simula vídeo já carregado
                form.setFieldValue(campoVideo, [MOCK_VIDEO_UPLOADED]);
                setVideoUrl(MOCK_VIDEO_UPLOADED.url);

                // Simula áudio já carregado  
                form.setFieldValue(campoAudio, [MOCK_AUDIO_UPLOADED]);
                setAudioUrl(MOCK_AUDIO_UPLOADED.url);

                console.log('✅ Mock aplicado:', {
                    video: {
                        name: MOCK_VIDEO_UPLOADED.name,
                        url: MOCK_VIDEO_UPLOADED.url,
                        fallbackUrls: MOCK_VIDEO_URLS
                    },
                    audio: {
                        name: MOCK_AUDIO_UPLOADED.name,
                        url: MOCK_AUDIO_UPLOADED.url,
                        fallbackUrls: MOCK_AUDIO_URLS
                    }
                });

                // Testa conectividade das URLs
                console.log('🔍 Testando URLs de mídia...');

                // Testa vídeo
                fetch(MOCK_VIDEO_UPLOADED.url, { method: 'HEAD' })
                    .then(response => {
                        console.log('✅ URL do vídeo acessível:', response.status, response.statusText);
                    })
                    .catch(error => console.warn('⚠️ URL do vídeo inacessível:', error.message));

                // Testa múltiplas URLs de áudio
                const audioTests = [                    
                    'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
                    // "https://file-examples.com/storage/feb42d72566dd2085bca1b7/2017/11/file_example_WAV_1MG.wav",
                    // 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a',
                    // 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
                ];

                audioTests.forEach((url, index) => {
                    fetch(url, { method: 'HEAD' })
                        .then(response => {
                            console.log(`✅ Áudio ${index + 1} acessível:`, response.status, url.split('/').pop());
                        })
                        .catch(error => {
                            console.warn(`⚠️ Áudio ${index + 1} inacessível:`, error.message, url.split('/').pop());
                        });
                });
            }
        }, 1000); // Aguarda 1 segundo para simular carregamento

        return () => clearTimeout(mockTimer);
    }, [form]);

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
                            <Radio.Group className="card-radio-component">
                                <Radio value="A" className="card-corpo-radio card-corpo-radio-escuro">
                                    <div className="card-radio-flex">
                                        <div className="card-elaboracao-radio-texto">
                                            Alternativa A
                                        </div>
                                        <div className="card-elaboracao-radio-buttom">
                                            <Button className="azulPadrao" icon={<EditOutlined />}
                                                onClick={() => showModal("modalA")}>
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="card-radio-dados">
                                        <div className={`${alternativaA || justificativaA
                                            ? "mostrar-card" : "esconder-card"} `}>
                                            <div>
                                                <div className="card-radio-label">Alternativa:</div>
                                                <div className="card-radio-texto" dangerouslySetInnerHTML={{ __html: alternativaA || '' }} />
                                            </div>
                                            <div>
                                                <div className="card-radio-label">Justificativa:</div>
                                                <div className="card-radio-texto" dangerouslySetInnerHTML={{ __html: justificativaA || '' }} />

                                            </div>
                                        </div>
                                    </div>
                                </Radio>

                                <Radio value="B" className="card-corpo-radio">
                                    <div className="card-radio-flex">
                                        <div className="card-elaboracao-radio-texto">
                                            Alternativa B
                                        </div>
                                        <div className="card-elaboracao-radio-buttom">
                                            <Button className="azulPadrao" type="primary" icon={<EditOutlined />}
                                                onClick={() => showModal("modalB")}>
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="card-radio-dados">
                                        <div className={`${alternativaB || justificativaB
                                            ? "mostrar-card" : "esconder-card"} `}>
                                            <div>
                                                <div className="card-radio-label">Alternativa:</div>
                                                <div className="card-radio-texto" dangerouslySetInnerHTML={{ __html: alternativaB || '' }} />
                                            </div>
                                            <div>
                                                <div className="card-radio-label">Justificativa:</div>
                                                <div className="card-radio-texto" dangerouslySetInnerHTML={{ __html: justificativaB || '' }} />
                                            </div>
                                        </div>
                                    </div>
                                </Radio>
                                <Radio value="C" className="card-corpo-radio card-corpo-radio-escuro">
                                    <div className="card-radio-flex">
                                        <div className="card-elaboracao-radio-texto">
                                            Alternativa C
                                        </div>
                                        <div className="card-elaboracao-radio-buttom">
                                            <Button className="azulPadrao" icon={<EditOutlined />}
                                                onClick={() => showModal("modalC")}>
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="card-radio-dados">
                                        <div className={`${alternativaC || justificativaC
                                            ? "mostrar-card" : "esconder-card"} `}>
                                            <div>
                                                <div className="card-radio-label">Alternativa:</div>
                                                <div className="card-radio-texto" dangerouslySetInnerHTML={{ __html: alternativaC || '' }} />
                                            </div>
                                            <div>
                                                <div className="card-radio-label">Justificativa:</div>
                                                <div className="card-radio-texto" dangerouslySetInnerHTML={{ __html: justificativaC || '' }} />
                                            </div>
                                        </div>
                                    </div>
                                </Radio>
                                <Radio value="D" className="card-corpo-radio">
                                    <div className="card-radio-flex">
                                        <div className="card-elaboracao-radio-texto">
                                            Alternativa D
                                        </div>
                                        <div className="card-elaboracao-radio-buttom">
                                            <Button className="azulPadrao" icon={<EditOutlined />}
                                                onClick={() => showModal("modalD")}>
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="card-radio-dados">
                                        <div className={`${alternativaD || justificativaD
                                            ? "mostrar-card" : "esconder-card"} `}>
                                            <div>
                                                <div className="card-radio-label">Alternativa:</div>
                                                <div className="card-radio-texto" dangerouslySetInnerHTML={{ __html: alternativaD || '' }} />
                                            </div>
                                            <div>
                                                <div className="card-radio-label">Justificativa:</div>
                                                <div className="card-radio-texto" dangerouslySetInnerHTML={{ __html: justificativaD || '' }} />
                                            </div>
                                        </div>
                                    </div>
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>

                <Modal
                    title="Alternativa A"
                    open={isModalAVisible}
                    onOk={() => handleOk("modalA")}
                    onCancel={() => handleCancel("modalA")}
                    okText="Finalizar"
                    maskClosable={false}
                    okButtonProps={{ style: { background: '#5A94D6' } }}
                    cancelButtonProps={{ style: { background: '#FFFFFF', color: '#5A94D8' } }}
                    closable={false}
                    keyboard={false}
                >
                    <div className='alternativa-corpo-elaboracao card-alternativa-ajuste' style={{ marginBottom: 24 }}>
                        <Row>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoAlternativaA}
                                    label='A) Alternativa Correta'
                                    style={{ marginBottom: 4 }}
                                >
                                    {renderTextEditorSafe(
                                        renderTextEditorA,
                                        alternativaA,
                                        handleAlternativaAChange,
                                        'Descreva a alternativa que será exibida aos estudantes...'
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoJustificativaA}
                                    label='Justificativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    {renderTextEditorSafe(
                                        renderTextEditorA,
                                        justificativaA,
                                        handleJustificativaAChange,
                                        'O estudante possivelmente assinalou essa alternativa porque...'
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Modal>

                <Modal
                    title="Alternativa B"
                    open={isModalBVisible}
                    onOk={() => handleOk("modalB")}
                    onCancel={() => handleCancel("modalB")}
                    okText="Finalizar"
                    maskClosable={false}
                    okButtonProps={{ style: { background: '#5A94D6' } }}
                    cancelButtonProps={{ style: { background: '#FFFFFF', color: '#5A94D8' } }}
                    closable={false}
                    keyboard={false}
                >
                    <div className='alternativa-corpo-elaboracao card-alternativa-ajuste'>
                        <Row>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoAlternativaB}
                                    label='B) Alternativa Correta'
                                    style={{ marginBottom: 4 }}
                                >
                                    {renderTextEditorSafe(
                                        renderTextEditorB,
                                        alternativaB,
                                        handleAlternativaBChange,
                                        'Descreva a alternativa que será exibida aos estudantes...'
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoJustificativaB}
                                    label='Justificativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    {renderTextEditorSafe(
                                        renderTextEditorB,
                                        justificativaB,
                                        handleJustificativaBChange,
                                        'O estudante possivelmente assinalou essa alternativa porque...'
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Modal>

                <Modal
                    title="Alternativa C"
                    open={isModalCVisible}
                    onOk={() => handleOk("modalC")}
                    onCancel={() => handleCancel("modalC")}
                    okText="Finalizar"
                    maskClosable={false}
                    okButtonProps={{ style: { background: '#5A94D6' } }}
                    cancelButtonProps={{ style: { background: '#FFFFFF', color: '#5A94D8' } }}
                    closable={false}
                    keyboard={false}
                >
                    <div className='alternativa-corpo-elaboracao card-alternativa-ajuste'>
                        <Row>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoAlternativaC}
                                    label='C) Alternativa Correta'
                                    style={{ marginBottom: 4 }}
                                >
                                    {renderTextEditorSafe(
                                        renderTextEditorC,
                                        alternativaC,
                                        handleAlternativaCChange,
                                        'Descreva a alternativa que será exibida aos estudantes...'
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoJustificativaC}
                                    label='Justificativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    {renderTextEditorSafe(
                                        renderTextEditorC,
                                        justificativaC,
                                        handleJustificativaCChange,
                                        'O estudante possivelmente assinalou essa alternativa porque...'
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Modal>

                <Modal
                    title="Alternativa D"
                    open={isModalDVisible}
                    onOk={() => handleOk("modalD")}
                    onCancel={() => handleCancel("modalD")}
                    okText="Finalizar"
                    maskClosable={false}
                    okButtonProps={{ style: { background: '#5A94D6' } }}
                    cancelButtonProps={{ style: { background: '#FFFFFF', color: '#5A94D8' } }}
                    closable={false}
                    keyboard={false}
                >
                    <div className='alternativa-corpo-elaboracao card-alternativa-ajuste'>
                        <Row>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoAlternativaD}
                                    label='D) Alternativa Correta'
                                    style={{ marginBottom: 4 }}
                                >
                                    {renderTextEditorSafe(
                                        renderTextEditorD,
                                        alternativaD,
                                        handleAlternativaDChange,
                                        'Descreva a alternativa que será exibida aos estudantes...'
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} className='card-campo-elaboracao'>
                                <Form.Item
                                    name={campoJustificativaD}
                                    label='Justificativa'
                                    style={{ marginBottom: 4 }}
                                >
                                    {renderTextEditorSafe(
                                        renderTextEditorD,
                                        justificativaD,
                                        handleJustificativaDChange,
                                        'O estudante possivelmente assinalou essa alternativa porque...'
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Modal>
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
                        <div className="card-video-corpo card-video-corpo-primeiro">
                            <p className="titulo">Arquivo</p>
                            <UploadArquivosSME
                                form={form}
                                isDraggerUpload={false}
                                uploadService={arquivoService.uploadVideo}
                                formItemProps={{
                                    name: campoVideo,
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
                                <ButtonPrimary className="card-video-buttom">
                                    Escolher outro vídeo
                                </ButtonPrimary>
                                <p className="descricao">Formatos suportados: .mp4, .MOV, .WEBM até 10MB</p>
                            </UploadArquivosSME>

                            {/* 🎬 Preview do Vídeo */}
                            {videoUrl && (
                                <Card
                                    title="Preview do Vídeo"
                                    size="small"
                                    style={{ marginTop: 16 }}
                                    extra={
                                        <Space>
                                            <Button
                                                type="primary"
                                                icon={isVideoPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                                onClick={handleVideoPlay}
                                                size="small"
                                            >
                                                {isVideoPlaying ? 'Pausar' : 'Reproduzir'}
                                            </Button>
                                            <Button
                                                icon={<DownloadOutlined />}
                                                onClick={handleDownloadVideo}
                                                size="small"
                                            >
                                                Download
                                            </Button>
                                        </Space>
                                    }
                                >
                                    <video
                                        id="preview-video"
                                        width="100%"
                                        controls
                                        preload="metadata"
                                        crossOrigin="anonymous"
                                        style={{ maxHeight: '200px', borderRadius: '6px' }}
                                        onPlay={() => {
                                            console.log('🎬 Evento onPlay disparado');
                                            setIsVideoPlaying(true);
                                        }}
                                        onPause={() => {
                                            console.log('⏸️ Evento onPause disparado');
                                            setIsVideoPlaying(false);
                                        }}
                                        onEnded={() => {
                                            console.log('🏁 Evento onEnded disparado');
                                            setIsVideoPlaying(false);
                                        }}
                                        onLoadedMetadata={() => {
                                            console.log('📊 Metadados do vídeo carregados');
                                        }}
                                        onError={(e) => {
                                            console.error('❌ Erro no vídeo:', e);
                                        }}
                                    >
                                        {MOCK_VIDEO_URLS.map((url, index) => (
                                            <source key={index} src={url} type="video/mp4" />
                                        ))}
                                        <Text type="secondary">
                                            Seu navegador não suporta o elemento de vídeo ou as URLs não estão acessíveis.
                                            <br />
                                            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                                                Clique aqui para abrir o vídeo diretamente
                                            </a>
                                        </Text>
                                    </video>
                                    <div style={{ marginTop: 8 }}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            📁 {MOCK_VIDEO_UPLOADED.name} • {(MOCK_VIDEO_UPLOADED.size / 1024 / 1024).toFixed(1)} MB
                                        </Text>
                                    </div>
                                </Card>
                            )}

                        </div>
                    </Col>
                    <Col xs={24} md={12} className='card-campo-elaboracao'>
                        <div className="card-video-corpo">
                            <p className="titulo">Arquivo</p>
                            <UploadArquivosSME
                                form={form}
                                isDraggerUpload={false}
                                uploadService={arquivoService.uploadAudio}
                                formItemProps={{
                                    name: campoAudio,
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
                                <ButtonPrimary className="card-video-buttom">
                                    Escolher outro áudio
                                </ButtonPrimary>
                                <p className="descricao">Formatos suportados:
                                    MP3, WAV até 10MB</p>
                            </UploadArquivosSME>

                            {/* 🎵 Preview do Áudio */}
                            {audioUrl && (
                                <Card
                                    title="Preview do Áudio"
                                    size="small"
                                    style={{ marginTop: 16 }}
                                    extra={
                                        <Space>
                                            <Button
                                                type="primary"
                                                icon={isAudioPlaying ? <PauseCircleOutlined /> : <SoundOutlined />}
                                                onClick={handleAudioPlay}
                                                size="small"
                                            >
                                                {isAudioPlaying ? 'Pausar' : 'Reproduzir'}
                                            </Button>
                                            <Button
                                                icon={<DownloadOutlined />}
                                                onClick={handleDownloadAudio}
                                                size="small"
                                            >
                                                Download
                                            </Button>
                                        </Space>
                                    }
                                >
                                    {/* Player de áudio principal */}
                                    <div style={{ marginBottom: 12 }}>
                                        <audio
                                            id="preview-audio"
                                            controls
                                            preload="auto"
                                            style={{ width: '100%' }}
                                            onPlay={() => {
                                                console.log('🎵 Áudio começou a reproduzir');
                                                setIsAudioPlaying(true);
                                            }}
                                            onPause={() => {
                                                console.log('⏸️ Áudio pausado');
                                                setIsAudioPlaying(false);
                                            }}
                                            onEnded={() => {
                                                console.log('� Áudio terminou');
                                                setIsAudioPlaying(false);
                                            }}
                                            onCanPlayThrough={() => {
                                                console.log('✅ Áudio pode ser reproduzido completamente');
                                            }}
                                            onLoadStart={() => {
                                                console.log('📥 Começou a carregar áudio');
                                            }}
                                            onError={(e) => {
                                                const target = e.target as HTMLAudioElement;
                                                console.error('❌ Erro no áudio:', {
                                                    error: target.error,
                                                    networkState: target.networkState,
                                                    readyState: target.readyState,
                                                    currentSrc: target.currentSrc
                                                });
                                            }}
                                        >                                            
                                            <source src="https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" type="audio/mpeg" />
                                            {/* <source src={"https://file-examples.com/storage/feb42d72566dd2085bca1b7/2017/11/file_example_WAV_1MG.wav"} type="audio/mpeg" /> */}
                                            {/* <source src="https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a" type="audio/mp4" /> */}
                                            {/* <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" /> */}

                                            <p>
                                                Seu navegador não suporta o elemento de áudio.
                                                <br />
                                                <a href="https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" target="_blank" rel="noopener noreferrer">
                                                    Clique aqui para ouvir o áudio diretamente
                                                </a>
                                            </p>
                                        </audio>
                                    </div>

                                    {/* Informações do arquivo */}
                                    <div style={{
                                        padding: '8px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <SoundOutlined style={{ color: '#1890ff' }} />
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            📁 {MOCK_AUDIO_UPLOADED.name} • {(MOCK_AUDIO_UPLOADED.size / 1024).toFixed(1)} KB • Status: {isAudioPlaying ? 'Reproduzindo' : 'Pausado'}
                                        </Text>
                                    </div>

                                    {/* Links de teste direto */}
                                    <div style={{ marginTop: 8 }}>
                                        <Text type="secondary" style={{ fontSize: '11px' }}>
                                            Teste direto: {' '}
                                            <a href="https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" target="_blank" rel="noopener noreferrer">
                                                MP3
                                            </a>
                                            {' | '}
                                            <a href="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" target="_blank" rel="noopener noreferrer">
                                                WAV
                                            </a>
                                        </Text>
                                    </div>
                                </Card>
                            )}
                        </div>
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