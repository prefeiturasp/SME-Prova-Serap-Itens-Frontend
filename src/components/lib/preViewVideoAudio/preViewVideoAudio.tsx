import React from "react";
import { Card, Typography } from "antd";
const { Text } = Typography;
import './preViewVideoAudio.css';

export const PreViewVideoAudio: React.FC<{
    src: string; // URL do arquivo ou vazio
    tipo: string;
    form?: any; // Para acessar dados do formulário
    campo?: string; // Nome do campo no formulário
    fileName?: string; // Nome do arquivo opcional
}> = ({ src, tipo, form, campo, fileName }) => {

    // 📄 Tenta obter informações do arquivo do formulário
    const arquivoInfo = form && campo ? form.getFieldValue(campo)?.[0] : null;
    const nomeArquivo = fileName || arquivoInfo?.name || '';

    // 🚫 Se não há src, mostra informações básicas
    if (!src) {
        return (
            <Card className="ContainerVideoPai">
                <div className="telaNula">
                    <div className="iconeNula">
                        {tipo.startsWith("video/") ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#D5D5D5" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <polygon points="10 12 16 8 10 4"/>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#D5D5D5" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10V13M6 6V17M10 3V21M14 8V15M18 5V18M22 10V13" 
                                    stroke="#D5D5D5" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                    {nomeArquivo && (
                        <div style={{ 
                            marginTop: '8px', 
                            fontSize: '12px', 
                            color: '#666',
                            textAlign: 'center',
                            wordBreak: 'break-all'
                        }}>
                            {nomeArquivo}
                        </div>
                    )}
                </div>
            </Card>
        );
    }



    if (tipo.startsWith("video/")) {
        return (
            <Card className="ContainerVideoPai">
                <video
                    id="preview-video"
                    width="100%"
                    controls
                    preload="metadata"
                    className="propsVideo"
                    src={src}
                    onError={(e) => {
                        const video = e.currentTarget as HTMLVideoElement;
                        console.error('❌ Erro CORS ao carregar vídeo:', {
                            src,
                            error: video.error,
                            networkState: video.networkState,
                            readyState: video.readyState,
                            message: 'Possível problema de CORS - Backend precisa configurar Access-Control-Allow-Origin'
                        });
                    }}
                >
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Text type="secondary">
                            Seu navegador não suporta o elemento de vídeo ou há um problema de CORS.
                        </Text>
                        <br /><br />
                        <a href={src} target="_blank" rel="noopener noreferrer" 
                           style={{ color: '#1890ff', textDecoration: 'underline' }}>
                            📹 Abrir vídeo em nova aba
                        </a>
                        <br /><br />
                        <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
                            Se o vídeo não carregar, é necessário configurar CORS no servidor.
                        </Text>
                    </div>
                </video>
            </Card>
        );
    } else if (tipo.startsWith("audio/")) {
        return (
            <Card>
                <div className="telaPretaAudio">
                    <div className="iconeTelaPretaAudio">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 10V13M6 6V17M10 3V21M14 8V15M18 5V18M22 10V13" 
                                stroke="white" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" />
                        </svg>
                    </div>
                    <audio
                        id="preview-audio"
                        controls
                        preload="metadata"
                        className="telaPretaControle"
                        src={src}
                        onError={(e) => {
                            console.error('❌ Erro no áudio:', e);
                        }}
                    >
                        <Text type="secondary">
                            Seu navegador não suporta o elemento de áudio.
                            <br />
                            <a href={src} target="_blank" rel="noopener noreferrer">
                                Clique aqui para ouvir o áudio diretamente
                            </a>
                        </Text>
                    </audio>
                </div>
            </Card>
        );
    } else {
        return null;
    }
};

export default PreViewVideoAudio;
