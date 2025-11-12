import React from "react";
import { Card, Typography } from "antd";
const { Text } = Typography;
import './preViewVideoAudio.css';

const MOCK_VIDEO_URLS = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
];

const MOCK_AUDIO_URLS = [
    "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
];

export const PreViewVideoAudio: React.FC<{
    src: string; // Sempre será uma URL string direta
    tipo: string;
    form?: any; // Mantido para compatibilidade
    campo?: string; // Mantido para compatibilidade
}> = ({ src, tipo }) => {

    // 🎬 MOCK: Fallback para quando não há arquivo
    const getMockUrl = (): string => {
        if (tipo.startsWith("video/")) {
            return MOCK_VIDEO_URLS[0];
        } else if (tipo.startsWith("audio/")) {
            return MOCK_AUDIO_URLS[0];
        }
        return '';
    };

    // URL final para usar no preview
    const finalUrl = src || getMockUrl();

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
                    src={finalUrl}
                    onError={(e) => {
                        console.error('❌ Erro no vídeo:', e);
                    }}
                >
                    {/* Fallback sources caso a URL principal falhe */}
                    {MOCK_VIDEO_URLS.map((url, index) => (
                        <source key={index} src={url} type="video/mp4" />
                    ))}
                    <Text type="secondary">
                        Seu navegador não suporta o elemento de vídeo ou as URLs não estão acessíveis.
                        <br />
                        <a href={finalUrl} target="_blank" rel="noopener noreferrer">
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
                        src={finalUrl}
                        onError={(e) => {
                            console.error('❌ Erro no áudio:', e);
                        }}
                    >
                        {/* Fallback sources caso a URL principal falhe */}
                        {MOCK_AUDIO_URLS.map((url, index) => (
                            <source key={index} src={url} type="audio/mpeg" />
                        ))}
                        <Text type="secondary">
                            Seu navegador não suporta o elemento de áudio.
                            <br />
                            <a href={finalUrl} target="_blank" rel="noopener noreferrer">
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
