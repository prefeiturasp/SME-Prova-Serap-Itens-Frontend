import { InboxOutlined } from '@ant-design/icons';
import { Form, FormInstance, FormItemProps, Upload, notification } from 'antd';
import { DraggerProps, RcFile, UploadFile } from 'antd/es/upload';
import arquivoService from '~/services/arquivo-service';

import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const { Dragger } = Upload;

// 📢 Função helper para notificações padronizada
type TipoMensagem = 'success' | 'info' | 'warning' | 'error';
const mensagem = (tipo: TipoMensagem, titulo: string, descricao: string) => {
  console.log('📢 Exibindo notificação:', { tipo, titulo, descricao });
  notification[tipo]({
    message: titulo,
    description: descricao,
  });
};

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



  const beforeUploadDefault = (arquivo: RcFile) => {
    const isAudio = arquivo.type?.startsWith('audio/');
    const isVideo = arquivo.type?.startsWith('video/');
    const tamanhoMB = arquivo.size / 1024 / 1024;
    
    console.log('🔍 Validando arquivo antes do upload:', {
      name: arquivo.name,
      type: arquivo.type,
      size: `${tamanhoMB.toFixed(2)}MB`,
      isAudio: isAudio,
      isVideo: isVideo,
      tiposPermitidos: tiposArquivosPermitidos
    });

    // 📝 VALIDAÇÃO DE FORMATO ESPECÍFICA
    if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
      let mensagemFormato = '';
      
      if (isVideo) {
        mensagemFormato = 'Formato de vídeo não permitido. Use apenas: MP4, MOV ou WEBM';
      } else if (isAudio) {
        mensagemFormato = 'Formato de áudio não permitido. Use apenas: MP3 ou WAV';
      } else {
        mensagemFormato = `Formato não permitido. Tipos aceitos: ${tiposArquivosPermitidos.join(', ')}`;
      }
      
      console.error('❌ Formato não permitido:', {
        arquivoTipo: arquivo.type,
        formatosPermitidos: tiposArquivosPermitidos
      });
      
      console.log('🚨 Chamando mensagem de erro:', mensagemFormato);
      mensagem('error', 'Formato Inválido', mensagemFormato);
      console.log('🚨 Após chamar mensagem de erro');
      return false;
    }

    // 📏 VALIDAÇÃO DE TAMANHO ESPECÍFICA (10MB)
    if (tamanhoMB > 10) {
      let mensagemTamanho = '';
      
      if (isVideo) {
        mensagemTamanho = `Vídeo muito grande (${tamanhoMB.toFixed(1)}MB). Tamanho máximo: 10MB`;
      } else if (isAudio) {
        mensagemTamanho = `Áudio muito grande (${tamanhoMB.toFixed(1)}MB). Tamanho máximo: 10MB`;
      } else {
        mensagemTamanho = `Arquivo muito grande (${tamanhoMB.toFixed(1)}MB). Tamanho máximo: 10MB`;
      }
      
      console.error('❌ Arquivo muito grande:', {
        tamanhoAtual: `${tamanhoMB.toFixed(2)}MB`,
        tamanhoMaximo: '10MB'
      });
      
      mensagem('error', 'Arquivo Muito Grande', mensagemTamanho);
      return false;
    }

    console.log('✅ Arquivo aprovado para upload');
    return true;
  };

  const customRequestDefault = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    const isAudio = file.type?.startsWith('audio/');

    try {
      console.log(`${isAudio ? '🎵' : '🎬'} Iniciando upload:`, file.name);
      
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
              item.elaboracao.video = { 
                idFile: file.idFile,
                fileLink: file.fileLink,
                nomeVideo: file.name, // Nome do arquivo para o frontend
                uid: file.uid, // Mantém o uid se estiver sendo usado
                status: file.status // Mantém o status se estiver sendo usado
              };
              item.elaboracao.ArquivoVideoId = file.idFile; // Salva o ID do vídeo
            } else if (file.type?.startsWith('audio/')) {
              item.elaboracao.audio = { 
                idFile: file.idFile,
                fileLink: file.fileLink,
                nomeAudio: file.name, // Nome do arquivo para o frontend
                uid: file.uid, // Mantém o uid se estiver sendo usado
                status: file.status // Mantém o status se estiver sendo usado
              };
              item.elaboracao.ArquivoAudioId = file.idFile; // Salva o ID do áudio
            }
            
            localStorage.setItem('itemAtual', JSON.stringify(item));
            console.log('💾 ArquivoId salvo no localStorage:', file.idFile);
          }
          
          // Atualiza o campo do formulário com o arquivo contendo idFile
          // Preserva TODAS as propriedades originais do arquivo, especialmente o name
          const arquivoAtualizado = {
            ...file,
            name: file.name, // Garante que o nome original seja preservado
            idFile: file.idFile,
            fileLink: file.fileLink,
            status: 'done',
            percent: 100, // Garante que está 100% completo
            response: resposta.data // Mantém a resposta para referência
          };
          
          // Atualiza o valor do campo no formulário
          if (form && form.setFieldValue) {
            form.setFieldValue(formItemProps.name, [arquivoAtualizado]);
          }
          
        } catch (error) {
          console.warn('Erro ao salvar no localStorage:', error);
        }

        // Chama onSuccess com status correto
        // Garante que todas as propriedades importantes sejam preservadas
        file.status = 'done'; // Define status como concluído
        file.percent = 100; // Define progresso como 100%
        file.response = resposta.data; // Adiciona resposta para referência
        
        onSuccess(resposta.data, file);
      } else {
        const errorMsg = resposta?.data?.message || 'Erro no upload';
        mensagem('error', 'Erro no Upload', errorMsg);
        onError(new Error(errorMsg));
      }
    } catch (error: any) {
      let errorMsg = 'Erro no upload';
      
      try {
        if (error && typeof error === 'object') {
          errorMsg = error?.response?.data?.message || error?.message || errorMsg;
        } else if (typeof error === 'string') {
          errorMsg = error;
        }
      } catch (parseError) {
        console.warn('Erro ao processar erro:', parseError);
        errorMsg = 'Erro desconhecido no upload';
      }
      
      mensagem('error', 'Erro no Upload', errorMsg);
      
      try {
        if (typeof onError === 'function') {
          onError(new Error(errorMsg));
        } else {
          console.warn('onError não é uma função válida');
        }
      } catch (callbackError) {
        console.error('Erro ao chamar onError:', callbackError);
      }
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
      
      mensagem('success', 'Arquivo Removido', `${arquivo.name} foi removido com sucesso`);
      
      // Retorna true para permitir a remoção
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover arquivo:', error);
      
      mensagem('error', 'Erro ao Remover', `Erro ao remover ${arquivo.name}. ${error instanceof Error ? error.message : 'Tente novamente.'}`);
      
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
            item.elaboracao.ArquivoVideoId = null; // Remove o ID também
            console.log('📹 Vídeo removido do localStorage');
          } else if (file.type?.startsWith('audio/')) {
            delete item.elaboracao.audio;
            item.elaboracao.ArquivoAudioId = null; // Remove o ID também
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
    let arquivoAtual = fileList.find((f: any) => f.uid === file.uid && f.status !== 'removed');
    
    // Se o arquivo foi processado com sucesso, garante que tenha todas as propriedades necessárias
    if (arquivoAtual && status === 'done') {
      arquivoAtual = {
        ...arquivoAtual,
        name: arquivoAtual.name || file.name, // Preserva o nome original
        idFile: arquivoAtual.idFile || file.idFile,
        fileLink: arquivoAtual.fileLink || file.fileLink,
        status: 'done',
        percent: 100
      };
      
      mensagem('success', 'Upload Concluído', `${arquivoAtual.name} foi carregado com sucesso`);
    }
    
    const novoValor = arquivoAtual ? [arquivoAtual] : [];
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
          mensagem('error', 'Erro', 'Erro ao tentar fazer download')
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
          showUploadList={uploadProps?.showUploadList || { showDownloadIcon: true, showRemoveIcon: true }}
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
