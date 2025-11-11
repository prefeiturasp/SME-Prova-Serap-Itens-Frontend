import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Slider } from "antd";
import { DownloadOutlined, FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
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
    
    // Estados para controles customizados do vídeo
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isSeeking, setIsSeeking] = useState(false);
    
    // Estados para controles customizados do áudio
    const [isAudioCustomPlaying, setIsAudioCustomPlaying] = useState(false);
    const [isAudioCustomMuted, setIsAudioCustomMuted] = useState(false);
    const [audioCurrentTime, setAudioCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [isAudioSeeking, setIsAudioSeeking] = useState(false);
    
    // Estados para loading de download
    const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);
    const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
    
    // Estado para fullscreen
    const [isFullscreen, setIsFullscreen] = useState(false);


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

    const handleDownloadVideo = async () => {
        setIsDownloadingVideo(true);
        try {
            const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
            const url = videoElement?.currentSrc || MOCK_VIDEO_URLS[0];
            
            await downloadFile(url, 'video-exemplo.mp4', 'video');
        } catch (error) {
            console.error('❌ Erro no download do vídeo:', error);
        } finally {
            setIsDownloadingVideo(false);
        }
    };

    const handleDownloadAudio = async () => {
        setIsDownloadingAudio(true);
        try {
            const audioElement = document.getElementById('preview-audio') as HTMLAudioElement;
            const url = audioElement?.currentSrc || MOCK_AUDIO_URLS[0];
            
            await downloadFile(url, 'audio-exemplo.mp3', 'audio');
        } catch (error) {
            console.error('❌ Erro no download do áudio:', error);
        } finally {
            setIsDownloadingAudio(false);
        }
    };

    // 🎬 Funções para controles customizados do vídeo
    const handlePlay = async () => {
        const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
        if (videoElement) {
            try {
                if (isPlaying) {
                    videoElement.pause();
                    setIsPlaying(false);
                    console.log('🎬 Vídeo pausado via controle customizado');
                } else {
                    await videoElement.play();
                    setIsPlaying(true);
                    console.log('🎬 Vídeo reproduzindo via controle customizado');
                }
            } catch (error) {
                console.error('❌ Erro ao reproduzir vídeo:', error);
                setIsPlaying(false);
            }
        }
    };

    const handleMute = () => {
        const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
        if (videoElement) {
            videoElement.muted = !videoElement.muted;
            setIsMuted(videoElement.muted);
            console.log(`🔊 Vídeo ${videoElement.muted ? 'mutado' : 'desmutado'}`);
        }
    };

    const handleSeek = (value: number) => {
        const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
        if (videoElement && !isNaN(value)) {
            setIsSeeking(true);
            videoElement.currentTime = value;
            setCurrentTime(value);
            console.log(`⏯️ Vídeo avançado para: ${formatTime(value)}`);
            
            // Pequeno delay para evitar conflito com onTimeUpdate
            setTimeout(() => setIsSeeking(false), 100);
        }
    };

    // 🔍 Função para controlar fullscreen do vídeo
    const handleFullscreen = async () => {
        const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
        if (videoElement) {
            try {
                if (!document.fullscreenElement) {
                    // Entrar em fullscreen
                    if (videoElement.requestFullscreen) {
                        await videoElement.requestFullscreen();
                    } else if ((videoElement as any).webkitRequestFullscreen) {
                        // Safari
                        await (videoElement as any).webkitRequestFullscreen();
                    } else if ((videoElement as any).msRequestFullscreen) {
                        // IE/Edge
                        await (videoElement as any).msRequestFullscreen();
                    }
                    setIsFullscreen(true);
                    console.log('🔍 Vídeo em tela cheia');
                } else {
                    // Sair do fullscreen
                    if (document.exitFullscreen) {
                        await document.exitFullscreen();
                    } else if ((document as any).webkitExitFullscreen) {
                        // Safari
                        await (document as any).webkitExitFullscreen();
                    } else if ((document as any).msExitFullscreen) {
                        // IE/Edge
                        await (document as any).msExitFullscreen();
                    }
                    setIsFullscreen(false);
                    console.log('🔍 Saindo da tela cheia');
                }
            } catch (error) {
                console.error('❌ Erro ao alterar fullscreen:', error);
                alert('Seu navegador não suporta tela cheia ou bloqueou a funcionalidade.');
            }
        }
    };

    // 🔍 Listener para detectar mudanças de fullscreen
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isInFullscreen = !!(
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).msFullscreenElement
            );
            setIsFullscreen(isInFullscreen);
        };

        // Adicionar listeners para diferentes navegadores
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    const formatTime = (seconds: number): string => {
        if (!seconds || isNaN(seconds) || seconds < 0) {
            return '0:00';
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 📁 Função auxiliar para download que garante comportamento idêntico
    const downloadFile = async (url: string, filename: string, type: 'video' | 'audio') => {
        console.log(`🔽 Tentando download direto do ${type}:`, url);
        
        // Verificar se é possível fazer download direto (mesmo domínio ou CORS permitido)
        try {
            const response = await fetch(url, {
                method: 'HEAD', // Apenas verificar se é acessível
            });
            
            if (response.ok) {
                // Se acessível, tentar download via blob
                const fullResponse = await fetch(url);
                const blob = await fullResponse.blob();
                
                const link = document.createElement('a');
                const downloadUrl = window.URL.createObjectURL(blob);
                
                link.href = downloadUrl;
                link.download = filename;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 100);
                console.log(`✅ Download direto do ${type} concluído`);
                return;
            }
        } catch (fetchError) {
            console.log(`⚠️ Download direto não possível, usando nova aba para ${type}`);
        }
        
        // Se chegou aqui, usar nova aba
        console.log(`🔗 Abrindo ${type} em nova aba para download`);
        
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = filename;
        
        // Tentar forçar download mesmo em nova aba
        link.setAttribute('download', filename);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} aberto em nova aba`);
    };

    // 🎵 Funções para controles customizados do áudio
    const handleAudioCustomPlay = async () => {
        const audioElement = document.getElementById('preview-audio') as HTMLAudioElement;
        if (audioElement) {
            try {
                if (isAudioCustomPlaying) {
                    audioElement.pause();
                    setIsAudioCustomPlaying(false);
                    console.log('🎵 Áudio pausado via controle customizado');
                } else {
                    await audioElement.play();
                    setIsAudioCustomPlaying(true);
                    console.log('🎵 Áudio reproduzindo via controle customizado');
                }
            } catch (error) {
                console.error('❌ Erro ao reproduzir áudio:', error);
                setIsAudioCustomPlaying(false);
            }
        }
    };

    const handleAudioCustomMute = () => {
        const audioElement = document.getElementById('preview-audio') as HTMLAudioElement;
        if (audioElement) {
            audioElement.muted = !audioElement.muted;
            setIsAudioCustomMuted(audioElement.muted);
            console.log(`🔊 Áudio ${audioElement.muted ? 'mutado' : 'desmutado'}`);
        }
    };

    const handleAudioSeek = (value: number) => {
        const audioElement = document.getElementById('preview-audio') as HTMLAudioElement;
        if (audioElement && !isNaN(value)) {
            setIsAudioSeeking(true);
            audioElement.currentTime = value;
            setAudioCurrentTime(value);
            console.log(`⏯️ Áudio avançado para: ${formatTime(value)}`);
            
            // Pequeno delay para evitar conflito com onTimeUpdate
            setTimeout(() => setIsAudioSeeking(false), 100);
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
                    preload="metadata"
                    crossOrigin="anonymous"
                    style={{ maxHeight: '400px', borderRadius: '6px' }}
                    onPlay={() => {
                        console.log('🎬 Evento onPlay disparado');
                        setIsVideoPlaying(true);
                        setIsPlaying(true);
                    }}
                    onPause={() => {
                        console.log('⏸️ Evento onPause disparado');
                        setIsVideoPlaying(false);
                        setIsPlaying(false);
                    }}
                    onEnded={() => {
                        console.log('🏁 Evento onEnded disparado');
                        setIsVideoPlaying(false);
                        setIsPlaying(false);
                    }}
                    onLoadedMetadata={(e) => {
                        const videoElement = e.target as HTMLVideoElement;
                        if (!isNaN(videoElement.duration) && videoElement.duration > 0) {
                            setDuration(videoElement.duration);
                            setCurrentTime(0);
                            console.log('📊 Metadados do vídeo carregados - Duração:', videoElement.duration);
                        }
                    }}
                    onCanPlay={(e) => {
                        const videoElement = e.target as HTMLVideoElement;
                        // Fallback para garantir que a duração seja definida
                        if (!duration && !isNaN(videoElement.duration) && videoElement.duration > 0) {
                            setDuration(videoElement.duration);
                        }
                    }}
                    onTimeUpdate={(e) => {
                        const videoElement = e.target as HTMLVideoElement;
                        // Só atualiza se não estiver fazendo seek manual
                        if (!isSeeking && !isNaN(videoElement.currentTime)) {
                            setCurrentTime(videoElement.currentTime);
                        }
                    }}
                    onVolumeChange={(e) => {
                        const videoElement = e.target as HTMLVideoElement;
                        setIsMuted(videoElement.muted);
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
                <div 
                    className="video-controls" 
                    style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '6px',
                        border: '1px solid #d9d9d9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}
                >
                    <Button 
                        type="primary" 
                        onClick={handlePlay}
                        style={{ minWidth: '80px' }}
                    >
                        {isPlaying ? '⏸️ Pausar' : '▶️ Play'}
                    </Button>
                    <Button 
                        onClick={handleMute}
                        style={{ minWidth: '80px' }}
                    >
                        {isMuted ? '🔊 Unmute' : '🔇 Mute'}
                    </Button>
                    <Button 
                        icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                        onClick={handleFullscreen}
                        style={{ minWidth: '100px' }}
                    >
                        {isFullscreen ? 'Sair Tela Cheia' : 'Tela Cheia'}
                    </Button>
                    <Button 
                        icon={isDownloadingVideo ? undefined : <DownloadOutlined />}
                        onClick={handleDownloadVideo}
                        loading={isDownloadingVideo}
                        disabled={isDownloadingVideo}
                        style={{ minWidth: '100px' }}
                    >
                        {isDownloadingVideo ? 'Baixando...' : 'Download'}
                    </Button>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <Slider
                            value={currentTime}
                            min={0}
                            max={duration || 100}
                            step={0.1}
                            onChange={handleSeek}
                            className="progress-slider"
                            tooltip={{
                                formatter: (value) => formatTime(value || 0)
                            }}
                            onAfterChange={() => {
                                // Força uma sincronização após o seek
                                const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
                                if (videoElement) {
                                    setCurrentTime(videoElement.currentTime);
                                }
                            }}
                        />
                    </div>
                    <span style={{ 
                        fontSize: '12px', 
                        color: '#666',
                        minWidth: '80px',
                        textAlign: 'center'
                    }}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>
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
                    height: '175px',
                    backgroundColor: '#000',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    position: 'relative',
                }}>
                    <audio
                        id="preview-audio"
                        preload="metadata"
                        style={{
                            display: 'none',  // Esconder o player nativo
                        }}
                        onPlay={() => {
                            console.log('🎵 Áudio começou a reproduzir');
                            setIsAudioPlaying(true);
                            setIsAudioCustomPlaying(true);
                        }}
                        onPause={() => {
                            console.log('⏸️ Áudio pausado');
                            setIsAudioPlaying(false);
                            setIsAudioCustomPlaying(false);
                        }}
                        onEnded={() => {
                            console.log('🏁 Áudio terminou');
                            setIsAudioPlaying(false);
                            setIsAudioCustomPlaying(false);
                        }}
                        onLoadedMetadata={(e) => {
                            const audioElement = e.target as HTMLAudioElement;
                            if (!isNaN(audioElement.duration) && audioElement.duration > 0) {
                                setAudioDuration(audioElement.duration);
                                setAudioCurrentTime(0);
                                console.log('📊 Metadados do áudio carregados - Duração:', audioElement.duration);
                            }
                        }}
                        onCanPlay={(e) => {
                            const audioElement = e.target as HTMLAudioElement;
                            // Fallback para garantir que a duração seja definida
                            if (!audioDuration && !isNaN(audioElement.duration) && audioElement.duration > 0) {
                                setAudioDuration(audioElement.duration);
                            }
                        }}
                        onTimeUpdate={(e) => {
                            const audioElement = e.target as HTMLAudioElement;
                            // Só atualiza se não estiver fazendo seek manual
                            if (!isAudioSeeking && !isNaN(audioElement.currentTime)) {
                                setAudioCurrentTime(audioElement.currentTime);
                            }
                        }}
                        onVolumeChange={(e) => {
                            const audioElement = e.target as HTMLAudioElement;
                            setIsAudioCustomMuted(audioElement.muted);
                        }}
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
                    
                    {/* Ícone visual do áudio */}
                    <div style={{
                        color: 'white',
                        fontSize: '48px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        🎵
                        <Text style={{ color: 'white', fontSize: '14px' }}>
                            {isAudioCustomPlaying ? 'Reproduzindo...' : 'Áudio'}
                        </Text>
                    </div>
                </div>
                
                {/* Controles customizados do áudio */}
                <div 
                    className="audio-controls" 
                    style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '6px',
                        border: '1px solid #d9d9d9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}
                >
                    <Button 
                        type="primary" 
                        onClick={handleAudioCustomPlay}
                        style={{ minWidth: '80px' }}
                    >
                        {isAudioCustomPlaying ? '⏸️ Pausar' : '▶️ Play'}
                    </Button>
                    <Button 
                        onClick={handleAudioCustomMute}
                        style={{ minWidth: '80px' }}
                    >
                        {isAudioCustomMuted ? '🔊 Unmute' : '🔇 Mute'}
                    </Button>
                    <Button 
                        icon={isDownloadingAudio ? undefined : <DownloadOutlined />}
                        onClick={handleDownloadAudio}
                        loading={isDownloadingAudio}
                        disabled={isDownloadingAudio}
                        style={{ minWidth: '100px' }}
                    >
                        {isDownloadingAudio ? 'Baixando...' : 'Download'}
                    </Button>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <Slider
                            value={audioCurrentTime}
                            min={0}
                            max={audioDuration || 100}
                            step={0.1}
                            onChange={handleAudioSeek}
                            className="progress-slider"
                            tooltip={{
                                formatter: (value) => formatTime(value || 0)
                            }}
                            onAfterChange={() => {
                                // Força uma sincronização após o seek
                                const audioElement = document.getElementById('preview-audio') as HTMLAudioElement;
                                if (audioElement) {
                                    setAudioCurrentTime(audioElement.currentTime);
                                }
                            }}
                        />
                    </div>
                    <span style={{ 
                        fontSize: '12px', 
                        color: '#666',
                        minWidth: '80px',
                        textAlign: 'center'
                    }}>
                        {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
                    </span>
                </div>
            </Card>
        );
    } else {
        return null;
    }
};

export default PreViewVideoAudio;
