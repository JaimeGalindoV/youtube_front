import { useEffect, useState } from 'react'
import VideoCard from '../components/VideoCard'

function Home() {
    const [videos, setVideos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL
    fetch(`${apiUrl}/videos`)
        .then(res => {
            if (!res.ok) throw new Error(`El backend respondió con error ${res.status}`)
            return res.json()
        })
        .then(data => {
            setVideos(data)
            setCargando(false)
        })
        .catch(err => {
            setError(err.message)
            setCargando(false)
        })
    }, [])

    if (cargando) return (
        <p style={{ color: '#ffffff', textAlign: 'center', marginTop: '4rem' }}>Cargando videos...</p>
    )

    if (error) return (
        <div style={{ color: '#aaaaaa', textAlign: 'center', marginTop: '4rem' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</p>
            <p style={{ fontSize: '16px' }}>Servidor en mantenimiento</p>
        </div>
    )

    if (videos.length === 0) return (
        <div style={{ color: '#aaaaaa', textAlign: 'center', marginTop: '4rem' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
            <p style={{ fontSize: '16px' }}>No hay videos disponibles por el momento</p>
        </div>
    )

    return (
        <div style={{
            backgroundColor: '#0f0f0f',
            minHeight: '100vh',
            padding: '24px',
        }}>
            <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            }}>
            {videos.map(video => (
                <VideoCard key={video.id} video={video} />
            ))}
            </div>
        </div>
    )
}

export default Home