import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoCard from '../components/VideoCard'

function VideoDetail() {
    const { id } = useParams()
    const [video, setVideo] = useState(null)
    const [otrosVideos, setOtrosVideos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL
        // Limpiar la informacion del video anterior
        setCargando(true)
        setError(null)

        Promise.all([
            fetch(`${apiUrl}/videos/${id}`).then(res => {
                if (!res.ok) throw new Error('Video no encontrado')
                return res.json()
            }),
            fetch(`${apiUrl}/videos`).then(res => {
                if (!res.ok) throw new Error('Error cargando videos')
                return res.json()
            }),
            // Suma una vista
            fetch(`${apiUrl}/videos/${id}`, {
                method: 'PUT',
                body: (() => {
                    const d = new FormData()
                    d.append('increment_views', 'true')
                    return d
                })()
            }),
        ])
            .then(([videoDetalle, todosLosVideos]) => {
                setVideo(videoDetalle)
                setOtrosVideos(todosLosVideos.filter(v => v.id !== videoDetalle.id)) // filtrar para que no aparezca el video actual
                setCargando(false)
            })
            .catch(err => {
                setError(err.message)
                setCargando(false)
            })
    }, [id])

    if (cargando) return (
        <div style={{ color: '#aaaaaa', textAlign: 'center', marginTop: '4rem', fontSize: '16px' }}>
            Cargando video...
        </div>
    )

    if (error) return (
        <div style={{ color: '#aaaaaa', textAlign: 'center', marginTop: '4rem' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</p>
            <p style={{ fontSize: '16px' }}>{error}</p>
        </div>
    )

    return (
        <div style={{
            backgroundColor: '#0f0f0f',
            minHeight: '100vh',
            padding: '24px',
            display: 'flex',
            gap: '24px',
        }}>

            {/* Video principal - izquierda */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <video
                    src={video.video_url}
                    controls
                    style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        backgroundColor: '#000',
                        borderRadius: '12px',
                    }}
                />

                {/* Titulo del video */}
                <h1 style={{
                    color: '#ffffff',
                    fontSize: '20px',
                    fontWeight: '700',
                    textAlign: 'left',
                    margin: '16px 0 8px',
                    lineHeight: '1.3',
                }}>
                    {video.title}
                </h1>

                {/* Nombre del canal */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '12px 0'
                }}>
                    {/* Foto de perfil del canal */}
                    <img
                        src="/images/camaroncito.jpg"
                        alt="canal"
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            backgroundColor: '#272727',
                        }}
                    />

                    <p style={{ margin: '0', color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                        {video.channel}
                    </p>
                </div>

                {/* Descripcion, vistas y fecha */}
                <div style={{
                    backgroundColor: '#272727',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#ffffff',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    }}>

                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        color: '#aaaaaa',
                        fontSize: '13px',
                        marginBottom: '10px',
                    }}>
                        <span>{video.views.toLocaleString()} vistas</span>
                        <span>{video.created_at.slice(0, 10)}</span>
                    </div>

                    <p style={{ margin: '0', color: '#ffffff', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                        {video.description || 'Este video no tiene descripción.'}
                    </p>
                </div>
            </div>

            {/* Otros videos - derecha */}
            <div style={{ width: '360px', flexShrink: 0 }}>
                <p style={{ color: '#aaaaaa', fontSize: '14px', marginBottom: '15px', marginTop: '0.5px' }}>
                    Recomendaciones
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {otrosVideos.length === 0
                        ? <p style={{ color: '#555', fontSize: '13px' }}>No hay más videos disponibles</p>
                        : otrosVideos.map(v => <VideoCard key={v.id} video={v} />)
                    }
                </div>
            </div>

        </div>
    )
}

export default VideoDetail