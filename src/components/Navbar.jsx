import { Link } from 'react-router-dom'

function Navbar() {
    return (
    <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '56px',
        backgroundColor: '#0f0f0f',
        borderBottom: '1px solid #272727',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    }}>

        <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '18px',
        }}>
        <div style={{
            width: '28px',
            height: '20px',
            backgroundColor: '#FF0000',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '10px solid white',
            marginLeft: '2px',
            }} />
        </div>
        UsTube
        </Link>

        <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            maxWidth: '360px',
            margin: '0 24px',
            }}>
            <input
                type="text"
                placeholder="Buscar"
                style={{
                flex: 1,
                height: '36px',
                border: '1px solid #383838',
                borderRight: 'none',
                borderRadius: '20px 0 0 20px',
                padding: '0 16px',
                fontSize: '14px',
                backgroundColor: '#121212',
                color: '#ffffff',
                outline: 'none',
                }}
            />
            <div style={{
                height: '36px',
                width: '56px',
                border: '1px solid #383838',
                borderLeft: 'none',
                borderRadius: '0 20px 20px 0',
                backgroundColor: '#272727',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
            }}>
                🔍
            </div>
        </div>

        <Link to="/admin" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: '1px solid #383838',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
        }}>
        ⚙️ Admin
        </Link>

    </nav>
    )
}

export default Navbar