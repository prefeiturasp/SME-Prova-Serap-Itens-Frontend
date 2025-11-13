import { InboxOutlined } from '@ant-design/icons';
import { Form, FormInstance, FormItemProps, Upload } from 'antd';
import { DraggerProps, RcFile, UploadFile } from 'antd/es/upload';
import { notification } from '~/components/lib/notification';
import arquivoService from '~/services/arquivo-service';

import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const { Dragger } = Upload;

export const permiteInserirFormato = (arquivo: any, tiposArquivosPermitidos: string[]) => {
  if (tiposArquivosPermitidos?.length) {
    const permiteTipo = tiposArquivosPermitidos.find((tipo) => tipo === arquivo?.type);
    return !!permiteTipo;
  }
  // Fallback: verifica se é um tipo de arquivo suportado (video/audio)
  return arquivo?.type?.startsWith('video/') || arquivo?.type?.startsWith('audio/');
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

  .ant-upload-list-item,
  .ant-upload-list-item-done {
    width: min-content !important;
  }
`;

type UploadArquivosProps = {
  isDraggerUpload?: boolean;
  form: FormInstance;
  uploadProps?: DraggerProps;
  formItemProps: FormItemProps & { name: string };
  tiposArquivosPermitidos: string[];
  tamanhoMaxUploadPorArquivo?: number;
  downloadService?: (codigosArquivo: string) => any;
  uploadService: (arquivo: File) => any;
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
    tiposArquivosPermitidos = [],
    tamanhoMaxUploadPorArquivo = TAMANHO_PADRAO_MAXIMO_UPLOAD,
  } = props;

  if (!formItemProps.name) {
    formItemProps.name = 'arquivos';
  }

  const listaDeArquivos = Form.useWatch(formItemProps.name, form);

  const setNovoValor = (novoValor: any) => {
    if (form && form.setFieldValue) {
      form.setFieldValue(formItemProps.name, novoValor);
    }
  };

  const excedeuLimiteMaximo = (arquivo: File) => {
    const tamanhoArquivo = arquivo.size / 1024 / 1024;

    return tamanhoArquivo > tamanhoMaxUploadPorArquivo;
  };

  const beforeUploadDefault = (arquivo: RcFile) => {
    console.log('🔍 Validando arquivo antes do upload:', {
      name: arquivo.name,
      type: arquivo.type,
      size: `${(arquivo.size / 1024 / 1024).toFixed(2)}MB`
    });

    if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
      const formatosPermitidos = tiposArquivosPermitidos.join(', ');
      notification.error({
        message: 'Formato Não Permitido',
        description: `Formatos aceitos: ${formatosPermitidos}`,
      });
      return false;
    }

    if (excedeuLimiteMaximo(arquivo)) {
      notification.error({
        message: 'Arquivo Muito Grande',
        description: `Tamanho máximo permitido: ${tamanhoMaxUploadPorArquivo}MB`,
      });
      return false;
    }

    console.log('✅ Arquivo aprovado para upload');
    return true;
  };

  const customRequestDefault = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      onProgress({ percent: 30 });
      
      // Chama o serviço de upload
      const resposta = await uploadService(file);
      
      onProgress({ percent: 100 });

      // Verifica se foi bem-sucedido
      if (resposta?.status >= 200 && resposta?.status < 300 && resposta?.data) {
        // Atribui dados do arquivo
        if (resposta.data.idFile) file.idFile = resposta.data.idFile;
        if (resposta.data.fileLink) file.fileLink = resposta.data.fileLink;

        // Salva no localStorage e atualiza o campo do formulário
        try {
          const itemAtual = localStorage.getItem('itemAtual');
          if (itemAtual && file.idFile) {
            const item = JSON.parse(itemAtual);
            if (!item.elaboracao) item.elaboracao = {};
            
            if (file.type?.startsWith('video/')) {
              item.elaboracao.video = { idFile: file.idFile };
              item.elaboracao.ArquivoVideoId = file.idFile; // Salva o ID do vídeo
            } else if (file.type?.startsWith('audio/')) {
              item.elaboracao.audio = { idFile: file.idFile };
              item.elaboracao.ArquivoAudioId = file.idFile; // Salva o ID do áudio
            }
            
            localStorage.setItem('itemAtual', JSON.stringify(item));
            console.log('💾 ArquivoId salvo no localStorage:', file.idFile);
          }
          
          // Atualiza o campo do formulário com o arquivo contendo idFile
          const arquivoAtualizado = {
            ...file,
            idFile: file.idFile,
            fileLink: file.fileLink,
            status: 'done'
          };
          
          // Atualiza o valor do campo no formulário
          if (form && form.setFieldValue) {
            form.setFieldValue(formItemProps.name, [arquivoAtualizado]);
          }
          
        } catch (error) {
          console.warn('Erro ao salvar no localStorage:', error);
        }

        // Chama onSuccess com status correto
        file.status = 'done'; // Define status como concluído
        onSuccess(resposta.data, file);
      } else {
        const errorMsg = resposta?.data?.message || 'Erro no upload';
        notification.error({
          message: 'Erro no Upload',
          description: errorMsg,
        });
        onError(new Error(errorMsg));
      }
    } catch (error: any) {
      let errorMsg = 'Erro no upload';
      
      if (error && typeof error === 'object') {
        errorMsg = error?.response?.data?.message || error?.message || errorMsg;
      } else if (typeof error === 'string') {
        errorMsg = error;
      }
      
      notification.error({
        message: 'Erro no Upload',
        description: errorMsg,
      });
      
      onError(new Error(errorMsg));
    }
  };

  const onRemoveDefault = async (arquivo: UploadFile<any>): Promise<boolean> => {
    console.log('🗑️ Usuário solicitou remoção do arquivo:', arquivo.name);
    
    try {
      // Se o arquivo tem idFile, remove do servidor também
      const arquivoComId = arquivo as any;
      if (arquivoComId.idFile) {
        console.log('🌐 Removendo arquivo do servidor:', arquivoComId.idFile);
        
        try {
          // Tenta remover do servidor, mas não quebra se falhar
          await arquivoService.removerArquivo(arquivoComId.idFile);
          console.log('✅ Arquivo removido do servidor com sucesso');
        } catch (serverError) {
          console.warn('⚠️ Erro ao remover do servidor, mas continuando com remoção local:', serverError);
          // Continua mesmo se falhar no servidor
        }
      }
      
      // Remove localmente
      removeArquivo(arquivo);
      
      notification.success({
        message: 'Arquivo Removido',
        description: `${arquivo.name} foi removido com sucesso`,
      });
      
      // Retorna true para permitir a remoção
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover arquivo:', error);
      
      notification.error({
        message: 'Erro ao Remover',
        description: `Erro ao remover ${arquivo.name}. ${error instanceof Error ? error.message : 'Tente novamente.'}`,
      });
      
      // Retorna false para cancelar a remoção em caso de erro
      return false;
    }
  };

  const removeArquivo = (file: UploadFile<any>) => {
    console.log('🗑️ Removendo arquivo:', file.name);
    
    // Para arquivo único, limpa completamente o campo
    setNovoValor([]);
    
    // Remove do localStorage também
    try {
      const itemAtual = localStorage.getItem('itemAtual');
      if (itemAtual) {
        const item = JSON.parse(itemAtual);
        if (item.elaboracao) {
          if (file.type?.startsWith('video/')) {
            delete item.elaboracao.video;
            console.log('📹 Vídeo removido do localStorage');
          } else if (file.type?.startsWith('audio/')) {
            delete item.elaboracao.audio;
            console.log('🎵 Áudio removido do localStorage');
          }
          localStorage.setItem('itemAtual', JSON.stringify(item));
        }
      }
    } catch (error) {
      console.warn('⚠️ Erro ao remover do localStorage:', error);
    }
  };

  const onChangeDefault = ({ file, fileList }: any) => {
    if (!file) return;
    
    const { status } = file;

    // Arquivo com erro - remove completamente
    if (status === 'error') {
      removeArquivo(file);
      return;
    }

    // Para arquivo único, mantém apenas o arquivo atual
    const arquivoAtual = fileList.find((f: any) => f.uid === file.uid && f.status !== 'removed');
    const novoValor = arquivoAtual ? [arquivoAtual] : [];

    // Arquivo carregado com sucesso
    if (status === 'done') {
      notification.success({
        message: 'Upload Concluído',
        description: `${file.name} foi carregado com sucesso`,
      });
    }

    setNovoValor(novoValor);
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
