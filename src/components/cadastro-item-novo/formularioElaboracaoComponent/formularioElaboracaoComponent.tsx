import React, { useEffect, useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { Col, Form, FormProps, Input, Row, Radio, Modal, Button } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { TextEditor } from '~/components/lib/editor';
import { EditOutlined } from '@ant-design/icons';
import './formularioElaboracaoComponent.css';
import UploadArquivosSME from '~/components/lib/upload';
import ButtonPrimary from '~/components/lib/button/primary';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { VideoArquivoDto, AudioArquivoDto } from '~/domain/dto/ArquivoMidiaDto';
import arquivoService from '~/services/arquivo-service';
import { PreViewVideoAudio } from '~/components/lib/preViewVideoAudio/preViewVideoAudio';
import { atualizarItemAtual, lerItemAtual } from '~/utils/item-atual-storage';
import { htmlSeguro } from '~/utils/html-seguro';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { Select } from 'antd';

interface VideoAudioProps {
  videoTemp?: VideoArquivoDto;
  audioTemp?: AudioArquivoDto;
  videoSalvo?: VideoArquivoDto;
  audioSalvo?: AudioArquivoDto;
}

const FormularioElaboracaoComponent: React.FC<
  FormProps & {
    videoCaminho: string;
    audioCaminho: string;
    videoAudioData?: VideoAudioProps;
    setVideoAudioData?: Dispatch<SetStateAction<VideoAudioProps>>;
    setVideoCaminho?: Dispatch<SetStateAction<string>>;
    setAudioCaminho?: Dispatch<SetStateAction<string>>;
  }
> = ({
  form,
  videoCaminho,
  audioCaminho,
  videoAudioData,
  setVideoAudioData,
  setVideoCaminho,
  setAudioCaminho,
}) => {
  if (!form) {
    return null;
  }

  const [listaSituacoesItem, setListaSituacoesItem] = useState<DefaultOptionType[]>([]);

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

  const [isModalAVisible, setIsModalAVisible] = useState(false);
  const [isModalBVisible, setIsModalBVisible] = useState(false);
  const [isModalCVisible, setIsModalCVisible] = useState(false);
  const [isModalDVisible, setIsModalDVisible] = useState(false);



  const [renderTextEditorA, setRenderTextEditorA] = useState(true);
  const [renderTextEditorB, setRenderTextEditorB] = useState(true);
  const [renderTextEditorC, setRenderTextEditorC] = useState(true);
  const [renderTextEditorD, setRenderTextEditorD] = useState(true);

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



  const videoFormItemProps = useMemo(() => ({ name: campoVideo }), [campoVideo]);
  const videoUploadProps = useMemo(
    () => ({
      maxCount: 1,
      showUploadList: {
        showDownloadIcon: false,
        showRemoveIcon: true,
        showPreviewIcon: false,
      },
    }),
    [],
  );
  const videoTiposArquivos = useMemo(
    () => [
      'video/mp4', // MP4
      'video/quicktime', // MOV
      'video/webm', // WEBM
    ],
    [],
  );

  const audioFormItemProps = useMemo(() => ({ name: campoAudio }), [campoAudio]);
  const audioUploadProps = useMemo(
    () => ({
      maxCount: 1,
      showUploadList: {
        showDownloadIcon: false,
        showRemoveIcon: true,
        showPreviewIcon: false,
      },
    }),
    [],
  );
  const audioTiposArquivos = useMemo(
    () => [
      'audio/mpeg', // MP3
      'audio/wav', // WAV
    ],
    [],
  );

  const renderTextEditorSafe = (
    shouldRender: boolean,
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
  ) => {
    if (shouldRender) {
      return <TextEditor value={value || ''} onChange={onChange} placeholder={placeholder} />;
    }
    return <div style={{ minHeight: '100px', backgroundColor: '#f5f5f5' }}>Carregando...</div>;
  };

  const handleVideoUpload = useCallback(
    (videoFile: VideoArquivoDto) => {
      atualizarItemAtual((item) => ({
        ...item,
        videoAudio: {
          ...(item.videoAudio || {}),
          videoTemp: videoFile,
        },
      }));

      if (setVideoAudioData && setVideoCaminho) {
        setVideoAudioData((prev) => ({
          ...prev,
          videoTemp: videoFile,
        }));

        if (videoFile.fileLink) {
          setVideoCaminho(videoFile.fileLink);
        }
      }

      form?.setFieldValue(campoVideo, [videoFile]);
    },
    [setVideoAudioData, setVideoCaminho, form, campoVideo],
  );

  const handleAudioUpload = useCallback(
    (audioFile: AudioArquivoDto) => {
      atualizarItemAtual((item) => ({
        ...item,
        videoAudio: {
          ...(item.videoAudio || {}),
          audioTemp: audioFile,
        },
      }));

      if (setVideoAudioData && setAudioCaminho) {
        setVideoAudioData((prev) => ({
          ...prev,
          audioTemp: audioFile,
        }));

        if (audioFile.fileLink) {
          setAudioCaminho(audioFile.fileLink);
        }
      }

      form?.setFieldValue(campoAudio, [audioFile]);
    },
    [setVideoAudioData, setAudioCaminho, form, campoAudio],
  );

  const carregarDadosDoLocalStorage = useCallback(() => {
    const item = lerItemAtual();
    if (!item || !form || !item.videoAudio) {
      return;
    }

    const videoParaForm = item.videoAudio.videoTemp || item.videoAudio.videoSalvo;
    const audioParaForm = item.videoAudio.audioTemp || item.videoAudio.audioSalvo;

    if (videoParaForm) {
      form.setFieldValue(campoVideo, [videoParaForm]);
    }

    if (audioParaForm) {
      form.setFieldValue(campoAudio, [audioParaForm]);
    }
  }, [form, campoVideo, campoAudio]);

  useEffect(() => {
    carregarDadosDoLocalStorage();
  }, [videoAudioData, carregarDadosDoLocalStorage]);

  useEffect(() => {
    configuracaoItemService.obterSituacoesItem().then((resposta) => {
      setListaSituacoesItem(resposta?.length ? resposta : []);
    });

    const item = lerItemAtual();
    const situacao = (item?.configuracao as any)?.situacaoItem;
    if (situacao !== undefined && situacao !== null) {
      form?.setFieldValue(Campos.situacaoItem, situacao);
    }
  }, []);

  const safeString = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const limparDadosAlternativa = useCallback(
    (
      campoAlternativa: Campos,
      campoJustificativa: Campos,
      alternativaKey: 'alternativaA' | 'alternativaB' | 'alternativaC' | 'alternativaD',
      justificativaKey: 'justificativaA' | 'justificativaB' | 'justificativaC' | 'justificativaD',
    ) => {
      form?.resetFields([campoAlternativa, campoJustificativa]);

      atualizarItemAtual((item) => {
        const elaboracao = {
          ...(item.elaboracao || {}),
          [alternativaKey]: '',
          [justificativaKey]: '',
        };

        return {
          ...item,
          elaboracao,
        };
      });
    },
    [form],
  );

  useEffect(() => {
    try {
      const item = lerItemAtual();
      if (!item) {
        return;
      }
      setAlternativaA(safeString(item.elaboracao?.alternativaA));
      setAlternativaB(safeString(item.elaboracao?.alternativaB));
      setAlternativaC(safeString(item.elaboracao?.alternativaC));
      setAlternativaD(safeString(item.elaboracao?.alternativaD));
      setJustificativaA(safeString(item.elaboracao?.justificativaA));
      setJustificativaB(safeString(item.elaboracao?.justificativaB));
      setJustificativaC(safeString(item.elaboracao?.justificativaC));
      setJustificativaD(safeString(item.elaboracao?.justificativaD));
    } catch {
      setAlternativaA('');
      setAlternativaB('');
      setAlternativaC('');
      setAlternativaD('');
      setJustificativaA('');
      setJustificativaB('');
      setJustificativaC('');
      setJustificativaD('');
    }
  }, []);

  const showModal = useCallback((nomeModal: string) => {
    switch (nomeModal) {
      case 'modalA':
        setIsModalAVisible(true);
        break;
      case 'modalB':
        setIsModalBVisible(true);
        break;
      case 'modalC':
        setIsModalCVisible(true);
        break;
      case 'modalD':
        setIsModalDVisible(true);
        break;
      default:
        break;
    }
  }, []);

  const handleOk = (nomeModal: string) => {
    switch (nomeModal) {
      case 'modalA':
        setIsModalAVisible(false);
        break;
      case 'modalB':
        setIsModalBVisible(false);
        break;
      case 'modalC':
        setIsModalCVisible(false);
        break;
      case 'modalD':
        setIsModalDVisible(false);
        break;
      default:
        break;
    }
  };

  const handleCancel = (nomeModal: string) => {
    switch (nomeModal) {
      case 'modalA':
        setRenderTextEditorA(false);
        setIsModalAVisible(false);
        setAlternativaA('');
        setJustificativaA('');
        limparDadosAlternativa(
          campoAlternativaA,
          campoJustificativaA,
          'alternativaA',
          'justificativaA',
        );
        Promise.resolve().then(() => setRenderTextEditorA(true));
        break;
      case 'modalB':
        setRenderTextEditorB(false);
        setIsModalBVisible(false);
        setAlternativaB('');
        setJustificativaB('');
        limparDadosAlternativa(
          campoAlternativaB,
          campoJustificativaB,
          'alternativaB',
          'justificativaB',
        );
        Promise.resolve().then(() => setRenderTextEditorB(true));
        break;
      case 'modalC':
        setRenderTextEditorC(false);
        setIsModalCVisible(false);
        setAlternativaC('');
        setJustificativaC('');
        limparDadosAlternativa(
          campoAlternativaC,
          campoJustificativaC,
          'alternativaC',
          'justificativaC',
        );
        Promise.resolve().then(() => setRenderTextEditorC(true));
        break;
      case 'modalD':
        setRenderTextEditorD(false);
        setIsModalDVisible(false);
        setAlternativaD('');
        setJustificativaD('');
        limparDadosAlternativa(
          campoAlternativaD,
          campoJustificativaD,
          'alternativaD',
          'justificativaD',
        );
        Promise.resolve().then(() => setRenderTextEditorD(true));
        break;
      default:
        break;
    }
  };

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
              <Form.Item name={campoTextoBase} label='Texto base' style={{ marginBottom: 4 }}>
                <TextEditor placeholder='Descreva o texto que servirá como base para o item. Deixe em branco se o item for independente...' />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} className='card-campo-elaboracao'>
              <Form.Item name={campoFonte} label='Fonte de pesquisa'>
                <Input placeholder='Insira o link' />
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
                <TextEditor placeholder='Descreva o item que será feito aos estudantes...' />
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
              <Form.Item name={campoAlternativaCorreta} label='Alternativa correta'>
                <Radio.Group className='card-radio-component'>
                  <Radio value='A' className='card-corpo-radio card-corpo-radio-escuro'>
                    <div className='card-radio-flex'>
                      <div className='card-elaboracao-radio-texto'>Alternativa A</div>
                      <div className='card-elaboracao-radio-buttom'>
                        <Button
                          className='azulPadrao'
                          icon={<EditOutlined />}
                          onClick={() => showModal('modalA')}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                    <div className='card-radio-dados'>
                      <div
                        className={`${
                          alternativaA || justificativaA ? 'mostrar-card' : 'esconder-card'
                        } `}
                      >
                        <div>
                          <div className='card-radio-label'>Alternativa:</div>
                          <div
                            className='card-radio-texto'
                            dangerouslySetInnerHTML={htmlSeguro(alternativaA)}
                          />
                        </div>
                        <div>
                          <div className='card-radio-label'>Justificativa:</div>
                          <div
                            className='card-radio-texto'
                            dangerouslySetInnerHTML={htmlSeguro(justificativaA)}
                          />
                        </div>
                      </div>
                    </div>
                  </Radio>

                  <Radio value='B' className='card-corpo-radio'>
                    <div className='card-radio-flex'>
                      <div className='card-elaboracao-radio-texto'>Alternativa B</div>
                      <div className='card-elaboracao-radio-buttom'>
                        <Button
                          className='azulPadrao'
                          type='primary'
                          icon={<EditOutlined />}
                          onClick={() => showModal('modalB')}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                    <div className='card-radio-dados'>
                      <div
                        className={`${
                          alternativaB || justificativaB ? 'mostrar-card' : 'esconder-card'
                        } `}
                      >
                        <div>
                          <div className='card-radio-label'>Alternativa:</div>
                          <div
                            className='card-radio-texto'
                            dangerouslySetInnerHTML={htmlSeguro(alternativaB)}
                          />
                        </div>
                        <div>
                          <div className='card-radio-label'>Justificativa:</div>
                          <div
                            className='card-radio-texto'
                            dangerouslySetInnerHTML={htmlSeguro(justificativaB)}
                          />
                        </div>
                      </div>
                    </div>
                  </Radio>
                  <Radio value='C' className='card-corpo-radio card-corpo-radio-escuro'>
                    <div className='card-radio-flex'>
                      <div className='card-elaboracao-radio-texto'>Alternativa C</div>
                      <div className='card-elaboracao-radio-buttom'>
                        <Button
                          className='azulPadrao'
                          icon={<EditOutlined />}
                          onClick={() => showModal('modalC')}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                    <div className='card-radio-dados'>
                      <div
                        className={`${
                          alternativaC || justificativaC ? 'mostrar-card' : 'esconder-card'
                        } `}
                      >
                        <div>
                          <div className='card-radio-label'>Alternativa:</div>
                          <div
                            className='card-radio-texto'
                            dangerouslySetInnerHTML={htmlSeguro(alternativaC)}
                          />
                        </div>
                        <div>
                          <div className='card-radio-label'>Justificativa:</div>
                          <div
                            className='card-radio-texto'
                            dangerouslySetInnerHTML={htmlSeguro(justificativaC)}
                          />
                        </div>
                      </div>
                    </div>
                  </Radio>
                  <Radio value='D' className='card-corpo-radio'>
                    <div className='card-radio-flex'>
                      <div className='card-elaboracao-radio-texto'>Alternativa D</div>
                      <div className='card-elaboracao-radio-buttom'>
                        <Button
                          className='azulPadrao'
                          icon={<EditOutlined />}
                          onClick={() => showModal('modalD')}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                    <div className='card-radio-dados'>
                      <div
                        className={`${
                          alternativaD || justificativaD ? 'mostrar-card' : 'esconder-card'
                        } `}
                      >
                        <div>
                          <div className='card-radio-label'>Alternativa:</div>
                          <div
                            className='card-radio-texto'
                            dangerouslySetInnerHTML={htmlSeguro(alternativaD)}
                          />
                        </div>
                        <div>
                          <div className='card-radio-label'>Justificativa:</div>
                          <div
                            className='card-radio-texto'
                            dangerouslySetInnerHTML={htmlSeguro(justificativaD)}
                          />
                        </div>
                      </div>
                    </div>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Modal
            title='Alternativa A'
            open={isModalAVisible}
            onOk={() => handleOk('modalA')}
            onCancel={() => handleCancel('modalA')}
            okText='Finalizar'
            maskClosable={false}
            okButtonProps={{ style: { background: '#5A94D6' } }}
            cancelButtonProps={{ style: { background: '#FFFFFF', color: '#5A94D8' } }}
            closable={false}
            keyboard={false}
          >
            <div
              className='alternativa-corpo-elaboracao card-alternativa-ajuste'
              style={{ marginBottom: 24 }}
            >
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
                      'Descreva a alternativa que será exibida aos estudantes...',
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
                      'O estudante possivelmente assinalou essa alternativa porque...',
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Modal>

          <Modal
            title='Alternativa B'
            open={isModalBVisible}
            onOk={() => handleOk('modalB')}
            onCancel={() => handleCancel('modalB')}
            okText='Finalizar'
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
                      'Descreva a alternativa que será exibida aos estudantes...',
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
                      'O estudante possivelmente assinalou essa alternativa porque...',
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Modal>

          <Modal
            title='Alternativa C'
            open={isModalCVisible}
            onOk={() => handleOk('modalC')}
            onCancel={() => handleCancel('modalC')}
            okText='Finalizar'
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
                      'Descreva a alternativa que será exibida aos estudantes...',
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
                      'O estudante possivelmente assinalou essa alternativa porque...',
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Modal>

          <Modal
            title='Alternativa D'
            open={isModalDVisible}
            onOk={() => handleOk('modalD')}
            onCancel={() => handleCancel('modalD')}
            okText='Finalizar'
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
                      'Descreva a alternativa que será exibida aos estudantes...',
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
                      'O estudante possivelmente assinalou essa alternativa porque...',
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
            <Col xs={24} sm={24} md={24} lg={12} className='card-campo-elaboracao'>
              <div className='card-video-corpo card-video-corpo-primeiro upload-inverted'>
                <div className='video-padding'>
                  <p className='card-video-titulo'>Arquivo</p>
                  <UploadArquivosSME
                    form={form}
                    isDraggerUpload={false}
                    uploadService={arquivoService.uploadVideo}
                    formItemProps={videoFormItemProps}
                    uploadProps={{
                      ...videoUploadProps,
                      onChange: (info: any) => {
                        const { fileList } = info;
                        if (fileList.length > 0) {
                          const file = fileList[fileList.length - 1];
                          if (file.status === 'done' && file.idFile && file.fileLink) {
                            const videoFile: VideoArquivoDto = {
                              idFile: file.idFile,
                              fileLink: file.fileLink,
                              name: file.name,
                              status: 'done',
                              uid: file.uid,
                              type: file.type,
                            };
                            handleVideoUpload(videoFile);
                          }
                        }
                      },
                    }}
                    tiposArquivosPermitidos={videoTiposArquivos}
                  >
                    <ButtonPrimary className='card-video-buttom'>
                      {videoAudioData?.videoSalvo || videoAudioData?.videoTemp
                        ? 'Escolher outro vídeo'
                        : 'Escolher vídeo'}
                    </ButtonPrimary>
                    <p className='descricao'>Formatos suportados: .mp4, .MOV, .WEBM até 10MB</p>
                  </UploadArquivosSME>
                </div>
                <div className='video-antD-edicao'>
                  <PreViewVideoAudio
                    src={videoCaminho}
                    tipo='video/mp4'
                    form={form}
                    campo={campoVideo}
                    fileName={videoAudioData?.videoTemp?.name || videoAudioData?.videoSalvo?.name}
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} className='card-campo-elaboracao'>
              <div className='card-video-corpo upload-inverted'>
                <div className='audio-padding'>
                  <p className='card-video-titulo'>Arquivo</p>
                  <UploadArquivosSME
                    form={form}
                    isDraggerUpload={false}
                    uploadService={arquivoService.uploadAudio}
                    formItemProps={audioFormItemProps}
                    uploadProps={{
                      ...audioUploadProps,
                      onChange: (info: any) => {
                        const { fileList } = info;
                        if (fileList.length > 0) {
                          const file = fileList[fileList.length - 1];

                          if (file.status === 'done' && file.idFile && file.fileLink) {
                            const audioFile: AudioArquivoDto = {
                              idFile: file.idFile,
                              fileLink: file.fileLink,
                              name: file.name,
                              status: 'done',
                              uid: file.uid,
                              type: file.type,
                            };
                            handleAudioUpload(audioFile);
                          }
                        }
                      },
                    }}
                    tiposArquivosPermitidos={audioTiposArquivos}
                  >
                    <ButtonPrimary className='card-video-buttom'>
                      {videoAudioData?.audioSalvo || videoAudioData?.audioTemp
                        ? 'Escolher outro áudio'
                        : 'Escolher áudio'}
                    </ButtonPrimary>
                    <p className='descricao'>Formatos suportados: .MP3, .WAV até 10MB</p>
                  </UploadArquivosSME>
                </div>
                <div className='audio-antD-edicao'>
                  <PreViewVideoAudio
                    src={audioCaminho}
                    tipo='audio/mp3'
                    form={form}
                    campo={campoAudio}
                    fileName={videoAudioData?.audioTemp?.name || videoAudioData?.audioSalvo?.name}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className='card-elaboracao'>
        <div className='card-titulo-elaboracao'>Código do item</div>
        <div className='card-subtitulo-elaboracao'>
          Um código será gerado automaticamente após o preenchimento das informações anteriores.
          Você pode usar o sugerido ou digitar um de sua preferência.
        </div>
        <div className='card-corpo'>
          <Row>
            <Col xs={24} md={24} className='card-campo-elaboracao'>
              <Form.Item name={campoCodigoItem} label='Código do item'>
                <Input placeholder='Digite o código...' />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>

      <div className='card-elaboracao'>
        <div className='card-corpo'>
          <Row>
            <Col xs={24} md={24} className='card-campo-elaboracao'>
              <Form.Item
                name={Campos.situacaoItem}
                label='Situação do item'
              >
                <Select
                  options={listaSituacoesItem}
                  placeholder='Selecione'
                  allowClear
                  showSearch={false}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default FormularioElaboracaoComponent;
