import { Link } from 'react-router-dom'

function VideoCard({ video, clickable = true }) {
    // Al dar click en un video se abre su url
    const mirar_video = (
        <div style={{
                backgroundColor: '#0f0f0f',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
            }}>
                {/* Imagen del thumbnail */}
                {video.thumbnail_url
                ? <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    style={{ width: '100%', aspectRatio: '16/9',  objectFit: 'contain', display: 'block', backgroundColor: '#000' }}
                />
                : <div style={{
                        width: '100%', aspectRatio: '16/9', backgroundColor: '#272727',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                </div>
            }

            <div style={{ padding: '10px 4px' }}>
                {/* Titulo del video */}
                <p style={{
                    margin: '0 0 4px', fontSize: '14px', fontWeight: '500', color: '#ffffff', textAlign: 'left',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                {video.title}
                </p>

                {/* Foto de perfil y canal */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <img
                        src="/images/camaroncito.jpg"
                        alt="canal"
                        style={{
                            width: '24px', height: '24px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            backgroundColor: '#272727',
                            flexShrink: 0,
                        }}
                    />
                    <p style={{ margin: '0', fontSize: '13px', color: '#aaaaaa' }}>{video.channel}</p>
                </div>

                <p style={{ margin: '0', fontSize: '13px', color: '#aaaaaa', textAlign: 'left' }}>
                    {video.views.toLocaleString()} vistas · {video.duration}
                </p>

            </div>
        </div>
    )

    // Se utiliza clickable si no se debe mostrar el link de un video
    if (!clickable) return mirar_video

    // En caso contrario, al darle clik a un video, te lleva a su link
    else
        return(
        <Link to={`/video/${video.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {mirar_video}
        </Link>
        )

}

export default VideoCard