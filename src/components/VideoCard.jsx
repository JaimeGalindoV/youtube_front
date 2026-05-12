import { Link } from 'react-router-dom'

function VideoCard({ video }) {
    return (
    <Link to={`/video/${video.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
            backgroundColor: '#0f0f0f',
            borderRadius: '12px',
            overflow: 'hidden',
            cursor: 'pointer',
        }}>
            <video
                src={video.url}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', backgroundColor: '#272727' }}
                muted
                onMouseEnter={e => e.target.play()} // al pasar el mouse por encima reproduce el video
                onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0 }} // al quitar el mouse se pone en pausa y se regresa al inicio
            />
            <div style={{ padding: '10px 4px' }}>
                <p style={{
                    margin: '0 0 4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#ffffff',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                {video.titulo}
                </p>
                    <p style={{ margin: '0', fontSize: '13px', color: '#aaaaaa' }}>{video.canal}</p>
                    <p style={{ margin: '0', fontSize: '13px', color: '#aaaaaa' }}>{video.vistas.toLocaleString()} vistas
                </p>
            </div>
        </div>
    </Link>
    )
}

export default VideoCard