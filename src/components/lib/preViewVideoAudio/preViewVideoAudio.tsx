import React from "react";
import { Card, Typography } from "antd";
const { Text } = Typography;
import './preViewVideoAudio.css';

export const PreViewVideoAudio: React.FC<{
    src: string; // URL do arquivo ou vazio
    tipo: string;
    form?: any; // Mantido para compatibilidade
    campo?: string; // Mantido para compatibilidade
}> = ({ src, tipo }) => {

    // 🚫 Se não há src, não renderiza nada
    if (!src) {
        return (
            <Card className="ContainerVideoPai">
                <Text type="secondary">Nenhum arquivo carregado</Text>
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
                    crossOrigin="anonymous"
                    className="propsVideo"
                    src={src}
                    onError={(e) => {
                        console.error('❌ Erro no vídeo:', e);
                    }}
                >
                    <Text type="secondary">
                        Seu navegador não suporta o elemento de vídeo.
                        <br />
                        <a href={src} target="_blank" rel="noopener noreferrer">
                            Clique aqui para abrir o vídeo diretamente
                        </a>
                    </Text>
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
