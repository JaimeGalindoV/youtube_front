import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Cargando...')
  
  useEffect(() => {
    // Import.meta.env es la forma en que Vite accede a las variables
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Error conectando al backend: ' + err.message))
  }, [])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>YouTube Clone (Testing Infra)</h1>
      <p>Estado del Backend: <strong>{message}</strong></p>
    </div>
  )
}

export default App