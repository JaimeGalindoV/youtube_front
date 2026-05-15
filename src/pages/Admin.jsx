import { useEffect, useState } from 'react'
import VideoCard from '../components/VideoCard'

// Funcion que permite editar, borrar o crear un video
function Admin() {
    const [videos, setVideos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [modalEditar, setModalEditar] = useState(null)  // video seleccionado para editar
    const [modalCrear, setModalCrear] = useState(false)   // true/false para abrir/cerrar

    useEffect(() => {
        cargarVideos()
    }, [])

    // Carga todos los videos de UsTube
    function cargarVideos() {
        const apiUrl = import.meta.env.VITE_API_URL
        fetch(`${apiUrl}/videos`)
            .then(res => res.json())
            .then(data => {
                setVideos(data)
                setCargando(false)
            })
    }

    return (
        <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', padding: '24px' }}>

            {/* Titulo de la pagina */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600', margin: 0 }}>
                    Videos publicados
                </h2>

                {/* Boton para crear un nuevo video */}
                <button
                    onClick={() => setModalCrear(true)}
                    style={{
                        padding: '8px 18px',
                        backgroundColor: '#FF0000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                    }}
                >
                    ✚ Crear
                </button>
            </div>

            {/* Grid de videos */}
            {cargando
            ? <p style={{ color: '#aaaaaa', textAlign: 'center', marginTop: '4rem' }}>Cargando...</p>
            : <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px',
                    }}>
                    {videos.map(video => (
                        <div key={video.id} onClick={() => setModalEditar(video)} style={{ cursor: 'pointer' }}>
                            <VideoCard video={video} clickable={false} />
                        </div>
                    ))}
                </div>
            }

            {/* Modales */}
            {modalEditar && <ModalEditar video={modalEditar} onClose={() => setModalEditar(null)} onGuardar={cargarVideos} />}
            {modalCrear && <ModalCrear onClose={() => setModalCrear(false)} onPublicar={cargarVideos} />}

        </div>
    )
}

// Modal para la edicion y eliminacion de un video
function ModalEditar({ video, onClose, onGuardar }) {
    const [form, setForm] = useState({
        title: video.title,
        channel: video.channel,
        duration: video.duration,
        description: '', // descripcion se llama desde /videos/{id}, por lo que se define abajo
    })
    const [thumbnail, setThumbnail] = useState(null)
    const [confirmando, setConfirmando] = useState(false)
    const [guardando, setGuardando] = useState(false)

    // 
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL
        fetch(`${apiUrl}/videos/${video.id}`) // se llama a /videos/{id}
        .then(res => res.json())
        .then(data => {
            setForm({
                title: data.title,
                channel: data.channel,
                duration: data.duration,
                description: data.description || '',
            })
        })
    }, [video.id])

    // Guarda los cambios hechos en una variable
    function handleCampo(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Guarda los datos actualizados (cambiados dentro del modal)
    function handleGuardar() {
        const apiUrl = import.meta.env.VITE_API_URL
        setGuardando(true)

        // Guarda los datos en formato Form
        const data = new FormData()
        if (form.title) data.append('title', form.title)
        if (form.channel) data.append('channel', form.channel)
        if (form.duration) data.append('duration', form.duration)
        if (form.description) data.append('description', form.description)
        if (thumbnail) data.append('thumbnail', thumbnail)

        fetch(`${apiUrl}/videos/${video.id}`, { method: 'PUT', body: data })
            .then(res => {
                if (!res.ok) throw new Error('Error al guardar')
                return res.json()
            })
            .then(() => {
                onGuardar()
                onClose()
            })
            .catch(() => setGuardando(false))
    }

    // Elimina el video seleccionado
    function handleEliminar() {
        const apiUrl = import.meta.env.VITE_API_URL
        fetch(`${apiUrl}/videos/${video.id}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar')
                onGuardar()
                onClose()
            })
    }

    // Diseño del modal de edicion y eliminacion
    return (
        <div style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 200,
            }}>
                <div style={{
                    backgroundColor: '#1f1f1f',
                    borderRadius: '16px',
                    padding: '28px',
                    width: '480px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    }}>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Editar video</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaaaaa', fontSize: '20px', cursor: 'pointer' }}>✕​</button>
                    </div>

                    {/* Thumbnail */}
                    <label style={{ display: 'block', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}>
                        {thumbnail
                            // Si se decide escoger otro thumbnail
                            ? <img src={URL.createObjectURL(thumbnail)} alt="thumbnail"
                                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#000', display: 'block' }} />
                            // Si se decide dejar el thumbnail original...
                            : video.thumbnail_url
                                // Imagen del thumbnail original
                                ? <img src={video.thumbnail_url} alt="thumbnail"
                                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#000', display: 'block' }} />
                                // En caso de que no haya thumbnail
                                : <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#272727', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#aaaaaa', fontSize: '14px' }}>Sin thumbnail</span>
                                </div>
                        }

                        {/* Overlay que aparece al hacer hover */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        >
                            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>Cambiar thumbnail</span>
                        </div>

                        {/* Input escondido */}
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => setThumbnail(e.target.files[0])} />
                    </label>

                    {/* Campos */}
                    {[
                        { label: 'Título', name: 'title' },
                        { label: 'Canal', name: 'channel' },
                        { label: 'Duración', name: 'duration' },
                    ].map(campo => (
                        <div key={campo.name} style={{ marginBottom: '16px', textAlign: 'left' }}>
                            <label style={{ color: '#aaaaaa', fontSize: '14px', display: 'block', marginBottom: '6px' }}>{campo.label}</label>
                            <input
                                name={campo.name}
                                value={form[campo.name]}
                                onChange={handleCampo}
                                style={{
                                    width: '100%', padding: '10px 12px', backgroundColor: '#272727',
                                    border: '1px solid #383838', borderRadius: '8px',
                                    color: '#ffffff', fontSize: '14px', boxSizing: 'border-box',
                                }}
                            />
                        </div>
                    ))}

                    {/* Descripcion */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ color: '#aaaaaa', fontSize: '14px', display: 'block', marginBottom: '6px', textAlign: 'left' }}>Descripción</label>
                            <textarea
                            name="description"
                            value={form.description}
                            onChange={handleCampo}
                            rows={4}
                            style={{
                                width: '100%', padding: '10px 12px', backgroundColor: '#272727',
                                border: '1px solid #383838', borderRadius: '8px',
                                color: '#ffffff', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    {/* Confirmación de eliminar */}
                    {confirmando && (
                        <div style={{
                                backgroundColor: '#2a1515', border: '1px solid #ff4444',
                                borderRadius: '8px', padding: '14px', marginBottom: '16px', textAlign: 'center',
                            }}>

                            <p style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 12px' }}>
                                ¿Seguro que quieres eliminar este video?
                            </p>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                {/* Cancelar la accion */}
                                <button onClick={() => setConfirmando(false)} style={{
                                    padding: '8px 16px', backgroundColor: 'transparent',
                                    border: '1px solid #383838', borderRadius: '8px', color: '#aaaaaa', cursor: 'pointer',
                                }}>Cancelar</button>

                                {/* Eliminar el video */}
                                <button onClick={handleEliminar} style={{
                                    padding: '8px 16px', backgroundColor: '#ff4444',
                                    border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer',
                                }}>Eliminar</button>
                            </div>
                        </div>
                    )}

                    {/* Botones */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            onClick={() => setConfirmando(true)}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ff4444'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.4)'}
                            style={{
                                padding: '10px 18px',
                                backgroundColor: 'rgba(255,68,68,0.4)',
                                border: 'none', borderRadius: '8px',
                                color: '#ffffff', fontSize: '14px', cursor: 'pointer',
                            }}>
                            Eliminar
                        </button>

                        <button
                            onClick={handleGuardar}
                            disabled={guardando}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#ffffff'
                                e.currentTarget.style.color = '#000000'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'
                                e.currentTarget.style.color = '#ffffff'
                            }}
                            style={{
                                padding: '10px 18px',
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                border: 'none', borderRadius: '8px',
                                color: '#ffffff', fontSize: '14px', cursor: 'pointer',
                                opacity: guardando ? 0.6 : 1,
                            }}>
                            {guardando ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
        </div>
    )
}

// Modal para la creacion de un video
function ModalCrear({ onClose, onPublicar }) {
    // Parametros de c/video
    const [form, setForm] = useState({
        title: '',
        channel: '',
        duration: '',
        description: '',
    })
    const [video, setVideo] = useState(null)               // almacena el video seleccionado
    const [videoPreview, setVideoPreview] = useState(null) // crea un URL temporal para el video
    const [thumbnail, setThumbnail] = useState(null)
    const [publicando, setPublicando] = useState(false)

    // Guarda los valores de cada campo
    function handleCampo(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Guarda los datos del video a publicar
    function handlePublicar() {
        // Variables obligatorias
        if (!video) return alert('Selecciona un video primero') 
        if (!form.title) return alert('El título es obligatorio')

        const apiUrl = import.meta.env.VITE_API_URL
        setPublicando(true)

        const data = new FormData()
        data.append('title', form.title)
        data.append('channel', form.channel)
        data.append('duration', form.duration)
        data.append('description', form.description)
        data.append('video', video)
        if (thumbnail) data.append('thumbnail', thumbnail) // no hay problema si el thumbnail esta vacio

        // Publica el video mediante POST en el back-end
        fetch(`${apiUrl}/videos`, { method: 'POST', body: data })
            .then(res => {
                if (!res.ok) throw new Error('Error al publicar')
                return res.json()
            })

            .then(() => {
                onPublicar()
                onClose()
            })
            .catch(() => setPublicando(false))
    }

    // Diseño del modal de creacion de videos
    return (
        <div style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200,
        }}>
            <div style={{
                backgroundColor: '#1f1f1f',
                borderRadius: '16px',
                padding: '28px',
                width: '480px',
                maxHeight: '90vh',
                overflowY: 'auto',
            }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Subir videos</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaaaaa', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>

                {/* Selector de video */}
                <label style={{ display: 'block', marginBottom: '20px', cursor: 'pointer' }}>
                    <div style={{
                        width: '100%', aspectRatio: '16/9',
                        backgroundColor: '#272727', borderRadius: '8px',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        border: video ? '2px solid #FF0000' : '2px dashed #383838',
                        position: 'relative', overflow: 'hidden',
                        }}>

                        {video
                            // Seleccionar el video deseado
                            ? <>
                                <video
                                    src={videoPreview}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0,
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                    >
                                    <span style={{ color: '#ffffff', fontSize: '14px' }}>Seleccionar otro video</span>
                                </div>
                            </>

                            // Mientras no se haya seleccionado ningun video
                            : <>
                                <span style={{ fontSize: '32px', marginBottom: '8px' }}>🎬</span>
                                <span style={{ color: '#aaaaaa', fontSize: '14px' }}>Seleccionar video</span>
                            </>
                        }
                    </div>

                    <input type="file" accept="video/*" style={{ display: 'none' }}
                        onChange={e => {
                            const archivo = e.target.files[0]
                            setVideo(archivo)
                            setVideoPreview(URL.createObjectURL(archivo)) // se crea una URL temporal para el archivo
                        }}>
                    </input>
                </label>

                {/* Selector de thumbnail */}
                <label style={{ display: 'block', marginBottom: '20px', cursor: 'pointer' }}>
                    <p style={{ color: '#aaaaaa', fontSize: '14px', margin: '0 0 6px', textAlign: 'left' }}>Thumbnail (opcional)</p>
                    <div style={{
                        width: '100%', aspectRatio: '16/9',
                        backgroundColor: '#272727', borderRadius: '8px',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', position: 'relative',
                        border: '2px dashed #383838',
                    }}>
                        {thumbnail
                            // Si se selecciona un thumbnail
                            ? <>
                                <img src={URL.createObjectURL(thumbnail)} alt="thumbnail"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }} />

                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0,
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                    >
                                    <span style={{ color: '#ffffff', fontSize: '14px' }}>Seleccionar otro thumbnail</span>
                                </div>
                            </>

                            // Si no se selecciona un thumbnail
                            : <>
                                <span style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</span>
                                <span style={{ color: '#aaaaaa', fontSize: '14px' }}>Seleccionar thumbnail</span>
                            </>
                        }
                    </div>

                    <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => setThumbnail(e.target.files[0])} />
                </label>

                {/* Campos */}
                {[
                    { label: 'Título', name: 'title', required: true },
                    { label: 'Canal', name: 'channel' },
                    { label: 'Duración', name: 'duration' },
                ].map(campo => (
                    <div key={campo.name} style={{ marginBottom: '14px' }}>
                        <label style={{ color: '#aaaaaa', fontSize: '14px', display: 'block', marginBottom: '6px', textAlign: 'left' }}>
                            {campo.label} {campo.required && <span style={{ color: '#FF0000' }}>*</span>}
                        </label>

                        <input
                            name={campo.name}
                            value={form[campo.name]}
                            onChange={handleCampo}
                            style={{
                                width: '100%', padding: '10px 12px', backgroundColor: '#272727',
                                border: '1px solid #383838', borderRadius: '8px',
                                color: '#ffffff', fontSize: '14px', boxSizing: 'border-box',
                                fontFamily: 'inherit',
                            }}
                        />
                    </div>
                ))}

                {/* Descripcion */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: '#aaaaaa', fontSize: '14px', display: 'block', marginBottom: '6px', textAlign: 'left' }}>Descripción</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleCampo}
                        rows={4}
                        style={{
                            width: '100%', padding: '10px 12px', backgroundColor: '#272727',
                            border: '1px solid #383838', borderRadius: '8px',
                            color: '#ffffff', fontSize: '14px', resize: 'vertical',
                            boxSizing: 'border-box', fontFamily: 'inherit',
                        }}
                    />
                </div>

                {/* Botón de publicar */}
                <button
                    onClick={handlePublicar}
                    disabled={publicando}
                    onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#ffffff'
                                e.currentTarget.style.color = '#000000'
                            }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'
                        e.currentTarget.style.color = '#ffffff'
                    }}
                    style={{
                        width: '100%', padding: '12px',
                        backgroundColor: 'rgba(255,0,0,0.5)',
                        border: 'none', borderRadius: '8px',
                        color: '#ffffff', fontSize: '15px',
                        fontWeight: '500', cursor: 'pointer',
                        opacity: publicando ? 0.6 : 1,
                    }}>

                    {publicando ? 'Publicando...' : 'Publicar'}
                </button>
            </div>
        </div>
    )
}

export default Admin