import React, { useEffect, useState } from "react";
import { Card, Typography } from "antd";
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

export const PreViewVideoAudio: React.FC<{
    src: string;
    tipo: string;
    form: FormInstance<any> | undefined
    campo: string;
}> = ({ src, tipo, form, campo }) => {

    // Estados para preview de mídia
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [audioUrl, setAudioUrl] = useState<string>('');


    // 🎬 MOCK: Simular que vídeo e áudio já foram feitos upload
    useEffect(() => {
        const mockTimer = setTimeout(() => {
            if (form) {
                console.log('🎬 Simulando upload já feito - Vídeo e Áudio');

                // Simula vídeo já carregado
                form.setFieldValue(campo, [MOCK_VIDEO_UPLOADED]);
                setVideoUrl(MOCK_VIDEO_UPLOADED.url);

                // Simula áudio já carregado  
                form.setFieldValue(campo, [MOCK_AUDIO_UPLOADED]);
                setAudioUrl(MOCK_AUDIO_UPLOADED.url);

                console.log('✅ Mock aplicado:', {
                    video: {
                        name: MOCK_VIDEO_UPLOADED.name,
                        url: MOCK_VIDEO_UPLOADED.url,
                        fallbackUrls: MOCK_VIDEO_URLS
                    },
                    audio: {
                        name: MOCK_AUDIO_UPLOADED.name,
                        url: MOCK_AUDIO_UPLOADED.url,
                        fallbackUrls: MOCK_AUDIO_URLS
                    }
                });

                console.log('✅ Mock de vídeo e áudio aplicado com sucesso');
            }
        }, 1000); // Aguarda 1 segundo para simular carregamento

        return () => clearTimeout(mockTimer);
    }, [form]);


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
                    onError={(e) => {
                        console.error('❌ Erro no vídeo:', e);
                    }}
                >
                    {MOCK_VIDEO_URLS.map((url, index) => (
                        <source key={index} src={url} type="video/mp4" />
                    ))}
                    <Text type="secondary">
                        Seu navegador não suporta o elemento de vídeo ou as URLs não estão acessíveis.
                        <br />
                        <a href={videoUrl} target="_blank" rel="noopener noreferrer">
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
                            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <audio
                        id="preview-audio"
                        controls
                        preload="metadata"
                        className="telaPretaControle"                        
                        onError={(e) => {
                            console.error('❌ Erro no áudio:', e);
                        }}
                    >
                        {MOCK_AUDIO_URLS.map((url, index) => (
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
                </div>
            </Card>
        );
    } else {
        return null;
    }
};

export default PreViewVideoAudio;
