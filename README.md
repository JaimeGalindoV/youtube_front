# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# Initialization
1. Clona el repositorio y navega a la carpeta del proyecto:
   ```bash
    git clone https://github.com/JaimeGalindoV/youtube_front.git
    cd youtube_front
    ```
2. Instala las dependencias:
    ```bash
    npm install
    ```
4. Crea un archivo `.env` en la raíz del proyecto y agrega la URL de tu backend:
    ```env
    VITE_API_URL=http://localhost:8000
    ```
5. Inicia el servidor de desarrollo:
6. ```bash
   npm run dev
   ```
7. Abre tu navegador y navega a `http://localhost:5173` para ver tu aplicación en acción. Deberías ver un mensaje de bienvenida y la respuesta del backend.