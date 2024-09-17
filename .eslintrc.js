module.exports = {
    root: true, // Define que esta es la configuración raíz para el proyecto
    env: {
        browser: true, // Entorno para código de front-end
        node: true, // Entorno para código de back-end
        es2021: true, // Soporte para ECMAScript 2021
    },
    extends: [
        'eslint:recommended', // Reglas recomendadas por ESLint
        'plugin:react/recommended', // Reglas recomendadas para React (si usas React)
        'prettier', // Integración con Prettier para evitar conflictos entre ESLint y Prettier
    ],
    parserOptions: {
        ecmaVersion: 12, // Soporte para las características más recientes de ECMAScript
        sourceType: 'module', // Soporte para módulos ECMAScript
        ecmaFeatures: {
            jsx: true, // Habilitar JSX (si usas React)
        },
    },
    plugins: [
        'react', // Plugin para reglas de React
    ],
    rules: {
        // Reglas personalizadas (puedes agregar más según tus necesidades)
        'no-unused-vars': 'warn', // Advertencia para variables no utilizadas
        'no-console': 'off', // Permitir el uso de console.log
    },
    overrides: [
        {
            files: ['app/**/*.js', 'app/**/*.jsx'], // Reglas específicas para la carpeta "app"
            rules: {
                // Reglas adicionales para "app" si es necesario
            },
        },
        {
            files: ['api/**/*.js'], // Reglas específicas para la carpeta "api"
            rules: {
                // Reglas adicionales para "api" si es necesario
            },
        },
    ],
    settings: {
        react: {
            version: 'detect', // Detecta la versión de React automáticamente
        },
    },
}
