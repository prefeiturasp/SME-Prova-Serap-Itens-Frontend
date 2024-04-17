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
import configuracaoItemService from '~/services/configuracaoItem-service';
import { Colors } from '~/styles/colors';
import { Separador } from '../../elementos';

type ContainerItemPros = {
  ehAlternativaCorreta: boolean;
};
const ContainerItem = styled.div<ContainerItemPros>`
  border: 1px solid ${Colors.CinzaBorda};
  border-radius: 4px;
  padding: 12px;
  background-color: ${({ ehAlternativaCorreta = false }) =>
    ehAlternativaCorreta ? '#edf2ff' : 'transparent'};
`;

const ElaboracaoItem: React.FC<FormProps> = () => {
  const form = Form.useFormInstance();

  const quantidadeAlternativas = useWatch('quantidadeAlternativas', form);

  const alternativaCorreta = useWatch('alternativaCorreta', form);

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
        <Col sm={24} md={12}>
          <Typography.Title level={2}>Elaboração do item</Typography.Title>
        </Col>
      </Row>

      <Row>
        <Col sm={24} md={12}>
          <Form.Item name='textoBase' label='Texto base' style={{ marginBottom: 4 }}>
            <TextEditor />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col sm={24} md={12}>
          <Form.Item name='fonte' label='Fonte'>
            <Input placeholder='Fonte' />
          </Form.Item>
        </Col>
      </Row>

      <Row style={{ marginBottom: 24 }}>
        <Col sm={24} md={12}>
          <Separador />
        </Col>
      </Row>

      <Row>
        <Col sm={24} md={12}>
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
            <Col sm={24} md={12}>
              <Separador />
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={12}>
              <Row gutter={[0, 16]}>
                {alternativas.map((item, index) => {
                  const ehAlternativaCorreta = item?.numeracao === alternativaCorreta;

                  return (
                    <ContainerItem ehAlternativaCorreta={ehAlternativaCorreta} key={item?.id}>
                      <Row>
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
              </Row>
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}

      <Row style={{ marginTop: 24 }}>
        <Col sm={24} md={12}>
          <Separador />
        </Col>
      </Row>

      <Row>
        <Col sm={24} md={12}>
          <Typography.Title level={3}>Recurso de Acessibilidade</Typography.Title>
        </Col>
      </Row>

      <Row>
        <Col sm={24} md={12}>
          <Row justify='space-between' gutter={16}>
            <Col>
              <UploadArquivosSME
                isDraggerUpload={false}
                form={form}
                formItemProps={{
                  name: 'video',
                  label: 'Vídeo',
                }}
                uploadService={configuracaoItemService.uploadVideo}
              >
                <ButtonPrimary
                  icon={<FontAwesomeIcon icon={faCloudUpload} style={{ marginRight: 5 }} />}
                >
                  UPLOAD VÍDEO
                </ButtonPrimary>
                <Typography.Text>Tamanho máximo 10MB</Typography.Text>
              </UploadArquivosSME>
            </Col>

            <Col>
              <UploadArquivosSME
                isDraggerUpload={false}
                form={form}
                formItemProps={{
                  name: 'audio',
                  label: 'Áudio',
                }}
                uploadService={configuracaoItemService.uploadAudio}
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
        </Col>
      </Row>
    </>
  );
};

export default ElaboracaoItem;
