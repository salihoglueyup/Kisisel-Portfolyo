/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6', // blue-500
                secondary: '#ec4899', // pink-500
                background: '#0B1120',
                card: '#111827'
            }
        },
    },
    plugins: [],
}