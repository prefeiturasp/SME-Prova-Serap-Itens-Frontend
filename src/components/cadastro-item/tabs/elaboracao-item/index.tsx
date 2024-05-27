import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, FormProps, Input, Radio, Row, Typography } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ButtonPrimary from '~/components/lib/button/primary';

import { TextEditor } from '~/components/lib/editor';
import UploadArquivosSME from '~/components/lib/upload';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';
import arquivoService from '~/services/arquivo-service';
import { Colors } from '~/styles/colors';
import { Separador } from '../../elementos';
type ContainerItemPros = {
  ehAlternativaCorreta: boolean;
};
const ContainerItem = styled.div<ContainerItemPros>`
  border: 1px solid ${Colors.CinzaBorda};
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: ${({ ehAlternativaCorreta = false }) =>
    ehAlternativaCorreta ? '#edf2ff' : 'transparent'};
`;

const ElaboracaoItem: React.FC<FormProps> = () => {
  const form = Form.useFormInstance();

  const quantidadeAlternativas = useWatch('quantidadeAlternativas', form);

  const alternativaCorreta = useWatch('alternativaCorreta', form);
  const video = useWatch('video', form);
  const audio = useWatch('audio', form);

  const desabilitarUploadVideo = !!video?.length;
  const desabilitarUploadAudio = !!audio?.length;

  const [alternativas, setAlternativas] = useState<AltenativaDto[]>([]);

  useEffect(() => {
    if (quantidadeAlternativas?.quantidade > 0) {
      const alternativasMap: AltenativaDto[] = [];

      for (let index = 0; index < quantidadeAlternativas.quantidade; index++) {
        alternativasMap.push({
          correta: false,
          descricao: '',
          justificativa: '',
          numeracao: String.fromCharCode('A'.charCodeAt(0) + index),
          ordem: index + 1,
          id: 0,
        });
        setAlternativas(alternativasMap);
        form.setFieldValue('alternativasDto', alternativasMap);
      }
    } else {
      setAlternativas([]);
      form.setFieldValue('alternativasDto', []);
    }
  }, [quantidadeAlternativas, form]);

  return (
    <>
      <Row>
        <Col xs={24}>
          <Typography.Title level={2}>Elaboração do item</Typography.Title>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Form.Item name='textoBase' label='Texto base' style={{ marginBottom: 4 }}>
            <TextEditor />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Form.Item name='fonte' label='Fonte'>
            <Input placeholder='Fonte' />
          </Form.Item>
        </Col>
      </Row>

      <Row style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Separador />
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Form.Item
            name='enunciado'
            label='Enunciado'
            rules={[{ required: true, message: 'Campo obrigatório' }]}
          >
            <TextEditor />
          </Form.Item>
        </Col>
      </Row>

      {alternativas?.length ? (
        <>
          <Row style={{ marginBottom: 24 }}>
            <Col xs={24}>
              <Separador />
            </Col>
          </Row>

          {alternativas.map((item, index) => {
            const ehAlternativaCorreta = item?.numeracao === alternativaCorreta;

            return (
              <ContainerItem ehAlternativaCorreta={ehAlternativaCorreta} key={item?.id}>
                <Row gutter={[0, 16]}>
                  <Col xs={24}>
                    <Form.Item
                      name={['alternativasDto', index, 'descricao']}
                      label={
                        <Form.Item
                          name='alternativaCorreta'
                          style={{ marginBottom: 4 }}
                          rules={[
                            {
                              required: true,
                              message: 'Campo obrigatório',
                            },
                          ]}
                        >
                          <Radio.Group>
                            <Radio
                              value={item.numeracao}
                            >{`${item.numeracao}) Alternativa correta`}</Radio>
                          </Radio.Group>
                        </Form.Item>
                      }
                      style={{ marginBottom: 4 }}
                      rules={[
                        {
                          required: true,
                          message: 'Campo obrigatório',
                        },
                      ]}
                    >
                      <TextEditor />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      name={['alternativasDto', index, 'justificativa']}
                      label='Justificativa'
                      style={{ marginBottom: 4 }}
                    >
                      <TextEditor />
                    </Form.Item>
                  </Col>
                </Row>
              </ContainerItem>
            );
          })}
        </>
      ) : (
        <></>
      )}

      <Row style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Separador />
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Typography.Title level={3}>Recurso de Acessibilidade</Typography.Title>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <UploadArquivosSME
            form={form}
            isDraggerUpload={false}
            uploadService={arquivoService.uploadVideo}
            formItemProps={{
              name: 'video',
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
              disabled={desabilitarUploadVideo}
            >
              UPLOAD VÍDEO
            </ButtonPrimary>
            <Typography.Text>Tamanho máximo 10MB</Typography.Text>
          </UploadArquivosSME>
        </Col>

        <Col xs={24}>
          <UploadArquivosSME
            form={form}
            isDraggerUpload={false}
            uploadService={arquivoService.uploadAudio}
            formItemProps={{
              name: 'audio',
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
              disabled={desabilitarUploadAudio}
            >
              UPLOAD ÁUDIO
            </ButtonPrimary>
            <Typography.Text>Tamanho máximo 10MB</Typography.Text>
          </UploadArquivosSME>
        </Col>
      </Row>
    </>
  );
};

export default ElaboracaoItem;
