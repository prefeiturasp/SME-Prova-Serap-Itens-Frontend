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
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);


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

    // 🎬 Funções para controle de mídia
    const handleVideoPlay = async () => {
        const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
        if (videoElement) {
            try {
                if (isVideoPlaying) {
                    videoElement.pause();
                    setIsVideoPlaying(false);
                    console.log('🎬 Vídeo pausado');
                } else {
                    await videoElement.play();
                    setIsVideoPlaying(true);
                    console.log('🎬 Vídeo reproduzindo');
                }
            } catch (error) {
                console.error('❌ Erro ao reproduzir vídeo:', error);
                setIsVideoPlaying(false);
            }
        } else {
            console.warn('⚠️ Elemento de vídeo não encontrado');
        }
    };

    const handleAudioPlay = async () => {
        const audioElement = document.getElementById('preview-audio') as HTMLAudioElement;
        if (audioElement) {
            try {
                if (isAudioPlaying) {
                    audioElement.pause();
                    setIsAudioPlaying(false);
                    console.log('🎵 Áudio pausado');
                } else {
                    await audioElement.play();
                    setIsAudioPlaying(true);
                    console.log('🎵 Áudio reproduzindo');
                }
            } catch (error) {
                console.error('❌ Erro ao reproduzir áudio:', error);
                setIsAudioPlaying(false);
            }
        } else {
            console.warn('⚠️ Elemento de áudio não encontrado');
        }
    };

    const handleDownloadVideo = () => {
        if (videoUrl) {
            const link = document.createElement('a');
            link.href = videoUrl;
            link.download = 'video-exemplo.mp4';
            link.click();
        }
    };

    const handleDownloadAudio = () => {
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = 'audio-exemplo.wav';
            link.click();
        }
    };

    if (tipo.startsWith("video/")) {
        return (
            <Card
            // title="Preview do Vídeo"
            // size="small"
            // style={{ marginTop: 16 }}
            // extra={
            //     <Space>
            //         <Button
            //             type="primary"
            //             icon={isVideoPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            //             onClick={handleVideoPlay}
            //             size="small"
            //         >
            //             {isVideoPlaying ? 'Pausar' : 'Reproduzir'}
            //         </Button>
            //         <Button
            //             icon={<DownloadOutlined />}
            //             onClick={handleDownloadVideo}
            //             size="small"
            //         >
            //             Download
            //         </Button>
            //     </Space>
            // }
            >
                <video
                    id="preview-video"
                    width="100%"
                    controls
                    preload="metadata"
                    crossOrigin="anonymous"
                    style={{ maxHeight: '200px', borderRadius: '6px' }}
                    onPlay={() => {
                        console.log('🎬 Evento onPlay disparado');
                        setIsVideoPlaying(true);
                    }}
                    onPause={() => {
                        console.log('⏸️ Evento onPause disparado');
                        setIsVideoPlaying(false);
                    }}
                    onEnded={() => {
                        console.log('🏁 Evento onEnded disparado');
                        setIsVideoPlaying(false);
                    }}
                    onLoadedMetadata={() => {
                        console.log('📊 Metadados do vídeo carregados');
                    }}
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
                {/* <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            📁 {MOCK_VIDEO_UPLOADED.name} • {(MOCK_VIDEO_UPLOADED.size / 1024 / 1024).toFixed(1)} MB
                        </Text>
                    </div> */}
            </Card>
        );
    } else if (tipo.startsWith("audio/")) {
        return (
            <Card
            // title="Preview do Áudio"
            // size="small"
            // style={{ marginTop: 16 }}
            // extra={
            //     <Space>
            //         <Button
            //             type="primary"
            //             icon={isAudioPlaying ? <PauseCircleOutlined /> : <SoundOutlined />}
            //             onClick={handleAudioPlay}
            //             size="small"
            //         >
            //             {isAudioPlaying ? 'Pausar' : 'Reproduzir'}
            //         </Button>
            //         <Button
            //             icon={<DownloadOutlined />}
            //             onClick={handleDownloadAudio}
            //             size="small"
            //         >
            //             Download
            //         </Button>
            //     </Space>
            // }
            >
                <div style={{
                    width: '100%',
                    minWidth: '27.2em',
                    height: '195px',
                    backgroundColor: '#000',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    alignContent: 'center',
                    flexDirection: 'column',
                }}>
                    <audio
                        id="preview-audio"
                        controls
                        preload="metadata"
                        style={{ width: '100%' }}
                        onPlay={() => {
                            console.log('🎵 Áudio começou a reproduzir');
                            setIsAudioPlaying(true);
                        }}
                        onPause={() => {
                            console.log('⏸️ Áudio pausado');
                            setIsAudioPlaying(false);
                        }}
                        onEnded={() => {
                            console.log('🏁 Áudio terminou');
                            setIsAudioPlaying(false);
                        }}
                        onLoadedMetadata={() => {
                            console.log('� Metadados do áudio carregados');
                        }}
                        onError={(e) => {
                            console.error('❌ Erro no áudio:', e);
                        }}
                    >---------------------------------
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
