import React, { useEffect, useState } from "react";
import { Card, Typography, Spin } from "antd";
import { FormInstance } from "antd/lib/form/Form";
const { Text } = Typography;
import './preViewVideoAudio.css';


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
//
import arquivoService from '~/services/arquivo-service';

export const PreViewVideoAudio: React.FC<{
    src: string | number | undefined; // Pode ser URL direta, ID do arquivo ou undefined
    tipo: string;
    form: FormInstance<any> | undefined
    campo: string;
}> = ({src, tipo, form, campo }) => {

    // Estados para preview de mídia
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 🎬 MOCK: Fallback para mocks quando não há arquivo real ou em caso de erro
    const useMockFallback = () => {
        if (form) {
            console.log('🎬 Usando fallback com mocks');

            if (tipo.startsWith("video/")) {
                form.setFieldValue(campo, [MOCK_VIDEO_UPLOADED]);
                setVideoUrl(MOCK_VIDEO_UPLOADED.url);
            } else if (tipo.startsWith("audio/")) {
                form.setFieldValue(campo, [MOCK_AUDIO_UPLOADED]);
                setAudioUrl(MOCK_AUDIO_UPLOADED.url);
            }

            console.log('✅ Mock fallback aplicado com sucesso');
        }
    };

    // Carrega URL do arquivo baseado no src
    useEffect(() => {
        const loadFileUrl = async () => {
            if (!src) return;

            setIsLoading(true);
            
            try {
                let fileUrl: string;

                // Se src é um número (ID do arquivo), busca a URL
                if (typeof src === 'number') {
                    fileUrl = await arquivoService.obterUrlPublica(src);
                } else {
                    // Se src é uma string (URL direta), usa diretamente
                    fileUrl = src;
                }

                // Define a URL baseada no tipo
                if (tipo.startsWith("video/")) {
                    setVideoUrl(fileUrl);
                } else if (tipo.startsWith("audio/")) {
                    setAudioUrl(fileUrl);
                }

                console.log('✅ URL do arquivo carregada:', { tipo, fileUrl });
            } catch (error) {
                console.error('❌ Erro ao carregar URL do arquivo:', error);
                // Fallback para mocks em caso de erro
                useMockFallback();
            } finally {
                setIsLoading(false);
            }
        };

        loadFileUrl();
    }, [src, tipo]);

    // 🎬 MOCK: Simular que vídeo e áudio já foram feitos upload (mantido para compatibilidade)
    useEffect(() => {
        // Se não há src fornecido, usa mocks como antes
        if (!src) {
            const mockTimer = setTimeout(() => useMockFallback(), 1000);
            return () => clearTimeout(mockTimer);
        }
    }, [src, form]);


    if (tipo.startsWith("video/")) {
        return (
            <Card className="ContainerVideoPai">
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <video
                        id="preview-video"
                        width="100%"
                        controls
                        preload="metadata"
                        crossOrigin="anonymous"
                        className="propsVideo"
                        src={videoUrl}
                        onError={(e) => {
                            console.error('❌ Erro no vídeo:', e);
                            // Se falhar, tenta usar mock como fallback
                            if (!videoUrl.includes('mock') && !videoUrl.includes('sample')) {
                                useMockFallback();
                            }
                        }}
                    >
                        {/* Fallback sources caso a URL principal falhe */}
                        {!videoUrl && MOCK_VIDEO_URLS.map((url, index) => (
                            <source key={index} src={url} type="video/mp4" />
                        ))}
                        <Text type="secondary">
                            Seu navegador não suporta o elemento de vídeo ou as URLs não estão acessíveis.
                            <br />
                            <a href={videoUrl || MOCK_VIDEO_URLS[0]} target="_blank" rel="noopener noreferrer">
                                Clique aqui para abrir o vídeo diretamente
                            </a>
                        </Text>
                    </video>
                )}
            </Card>
        );
    } else if (tipo.startsWith("audio/")) {
        return (
            <Card>
                <div className="telaPretaAudio">
                    {isLoading ? (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%',
                            color: 'white' 
                        }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
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
                                src={audioUrl}
                                onError={(e) => {
                                    console.error('❌ Erro no áudio:', e);
                                    // Se falhar, tenta usar mock como fallback
                                    if (!audioUrl.includes('mock') && !audioUrl.includes('sample')) {
                                        useMockFallback();
                                    }
                                }}
                            >
                                {/* Fallback sources caso a URL principal falhe */}
                                {!audioUrl && MOCK_AUDIO_URLS.map((url, index) => (
                                    <source key={index} src={url} type="audio/mpeg" />
                                ))}
                                <Text type="secondary">
                                    Seu navegador não suporta o elemento de áudio.
                                    <br />
                                    <a href={audioUrl || MOCK_AUDIO_URLS[0]} target="_blank" rel="noopener noreferrer">
                                        Clique aqui para ouvir o áudio diretamente
                                    </a>
                                </Text>
                            </audio>
                        </>
                    )}
                </div>
            </Card>
        );
    } else {
        return null;
    }
};

export default PreViewVideoAudio;
