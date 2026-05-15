import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 56px)',
            backgroundColor: '#0f0f0f',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
        }}>
            <p style={{ fontSize: '64px', margin: '0 0 12px' }}>404</p>
            <p style={{ fontSize: '18px', margin: '0 0 18px', color: '#aaaaaa' }}>
                Esta pagina no existe
            </p>
            <Link
                to="/"
                style={{
                    textDecoration: 'none',
                    color: '#ffffff',
                    backgroundColor: '#ff0000',
                    borderRadius: '20px',
                    padding: '10px 18px',
                    fontSize: '14px',
                    fontWeight: '500',
                }}
            >
                Volver al inicio
            </Link>
        </div>
    )
}

export default NotFound
