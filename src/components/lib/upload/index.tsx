import { InboxOutlined } from '@ant-design/icons';
import { Form, FormInstance, FormItemProps, Upload } from 'antd';
import { DraggerProps, RcFile, UploadFile } from 'antd/es/upload';
import { notification } from '~/components/lib/notification';

import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const { Dragger } = Upload;

enum HttpStatusCode {
  Ok = 200,
}

export const permiteInserirFormato = (arquivo: any, tiposArquivosPermitidos: string) => {
  if (tiposArquivosPermitidos?.trim()) {
    const listaPermitidos = tiposArquivosPermitidos
      .split(',')
      .map((tipo) => tipo?.trim()?.toLowerCase());

    const tamanhoNome = arquivo?.name?.length;

    const permiteTipo = listaPermitidos.find((tipo) => {
      const nomeTipoAtual = arquivo.name.substring(tamanhoNome, tamanhoNome - tipo.length);

      if (nomeTipoAtual) {
        return tipo?.toLowerCase() === nomeTipoAtual?.toLowerCase();
      }

      return false;
    });

    return !!permiteTipo;
  }
  return true;
};

const downloadBlob = (data: any, fileName: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');

  const blob = new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);

  document.body.removeChild(a);
};

export const ContainerUpload = styled.div`
  &.ant-upload-wrapper
    .ant-upload-list
    .ant-upload-list-item
    .ant-upload-list-item-actions
    .ant-upload-list-item-action {
    opacity: 1;
  }
`;

type UploadArquivosProps = {
  isDraggerUpload?: boolean;
  form: FormInstance;
  uploadProps?: DraggerProps;
  formItemProps: FormItemProps & { name: string };
  tiposArquivosPermitidos?: string;
  tamanhoMaxUploadPorArquivo?: number;
  downloadService?: (codigosArquivo: string) => any;
  uploadService: (formData: FormData, configuracaoHeader: any) => any;
} & PropsWithChildren;

const TAMANHO_PADRAO_MAXIMO_UPLOAD = 10;

const UploadArquivosSME: React.FC<UploadArquivosProps> = (props) => {
  const {
    children,
    isDraggerUpload = true,
    form,
    uploadProps,
    formItemProps,
    uploadService,
    downloadService,
    tiposArquivosPermitidos = '',
    tamanhoMaxUploadPorArquivo = TAMANHO_PADRAO_MAXIMO_UPLOAD,
  } = props;

  if (!formItemProps.name) {
    formItemProps.name = 'arquivos';
  }

  const listaDeArquivos = Form.useWatch(formItemProps.name, form);

  const setNovoValor = (novoMap: any) => {
    if (form && form.setFieldValue) {
      form.setFieldValue(formItemProps.name, novoMap);
    }
  };

  const excedeuLimiteMaximo = (arquivo: File) => {
    const tamanhoArquivo = arquivo.size / 1024 / 1024;

    return tamanhoArquivo > tamanhoMaxUploadPorArquivo;
  };

  const beforeUploadDefault = (arquivo: RcFile) => {
    if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
      notification.error({
        message: 'Erro',
        description: 'Formato não permitido',
      });
      return false;
    }

    if (excedeuLimiteMaximo(arquivo)) {
      notification.error({
        message: 'Erro',
        description: `Tamanho máximo ${tamanhoMaxUploadPorArquivo}MB`,
      });
      return false;
    }

    return true;
  };

  const customRequestDefault = (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: any) => {
        onProgress({ percent: (event.loaded / event.total) * 100 }, file);
      },
    };

    fmData.append('file', file);

    uploadService(fmData, config)
      .then((resposta: any) => {
        if (resposta?.status === HttpStatusCode.Ok) {
          file.idFile = resposta?.data?.idFile;
          file.fileLink = resposta?.data?.fileLink;
          onSuccess(file, file.idFile);
        } else {
          notification.error({
            message: 'Erro',
            description: 'Erro ao tentar inserir o arquivo',
          });
          onError({});
        }
      })
      .catch((e: any) => {
        notification.error({
          message: 'Erro',
          description: 'Erro ao tentar inserir o arquivo',
        });
        onError({ event: e });
      });
  };

  const onRemoveDefault = async (arquivo: UploadFile<any>) => {
    if (arquivo.xhr) {
      notification.success({
        message: 'Sucesso',
        description: `Arquivo ${arquivo.name} excluído com sucesso`,
      });
      return true;
    }
    return false;
  };

  const atualizaListaArquivos = (fileList: any, file: UploadFile<any>) => {
    const novaLista = fileList.filter((item: any) => item.uid !== file.uid);
    const novoMap = [...novaLista];

    setNovoValor(novoMap);
  };

  const onChangeDefault = ({ file, fileList }: any) => {
    const { status } = file;

    if (excedeuLimiteMaximo(file)) {
      atualizaListaArquivos(fileList, file);
      return;
    }

    if (!permiteInserirFormato(file, tiposArquivosPermitidos)) {
      atualizaListaArquivos(fileList, file);
      return;
    }

    const novoMap = [...fileList]?.filter((f) => f?.status !== 'removed');

    if (status === 'done') {
      notification.success({
        message: 'Sucesso',
        description: `${file.name} arquivo carregado com sucesso`,
      });
    } else if (status === 'error') {
      atualizaListaArquivos(fileList, file);
      return;
    }

    if (status === 'done' || status === 'removed') {
      if (form && form.setFieldValue) {
        form.setFieldValue(formItemProps.name, novoMap);
      }
    }

    setNovoValor(novoMap);
  };

  const onDownloadDefault = (arquivo: UploadFile<any>) => {
    if (downloadService) {
      const codigoArquivo = arquivo.xhr;
      downloadService(codigoArquivo)
        .then((resposta: any) => {
          downloadBlob(resposta.data, arquivo.name);
        })
        .catch(() =>
          notification.error({
            message: 'Erro',
            description: 'Erro ao tentar fazer download',
          }),
        );
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return listaDeArquivos;
  };

  const ComponentUpload = isDraggerUpload ? Dragger : Upload;

  return (
    <Form.Item valuePropName='fileList' getValueFromEvent={normFile} {...formItemProps}>
      <ContainerUpload>
        <ComponentUpload
          name='file'
          listType='text'
          fileList={listaDeArquivos}
          showUploadList={{ showDownloadIcon: true }}
          onRemove={uploadProps?.onRemove || onRemoveDefault}
          onChange={uploadProps?.onChange || onChangeDefault}
          onDownload={uploadProps?.onDownload || onDownloadDefault}
          beforeUpload={uploadProps?.beforeUpload || beforeUploadDefault}
          customRequest={uploadProps?.customRequest || customRequestDefault}
          {...uploadProps}
        >
          {isDraggerUpload ? (
            <>
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>Clique ou arraste para fazer o upload do arquivo</p>
              <p className='ant-upload-hint'>{`Deve permitir apenas arquivos com no máximo ${tamanhoMaxUploadPorArquivo}MB cada`}</p>
            </>
          ) : (
            children
          )}
        </ComponentUpload>
      </ContainerUpload>
    </Form.Item>
  );
};

export default UploadArquivosSME;
