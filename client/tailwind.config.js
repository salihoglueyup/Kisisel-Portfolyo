import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Semantik renk rolleri — değerler mevcut hex'lere EŞİT,
            // bu yüzden token'a geçiş görsel çıktıyı değiştirmez.
            colors: {
                // Geriye uyumluluk (eski isimler)
                primary: '#3b82f6',
                secondary: '#ec4899',
                background: '#0B1120',
                card: '#111827',

                // Yüzey / elevation skalası
                base: '#0B1120',          // sayfa zemini
                sunken: '#050a14',        // en alt katman (footer)
                surface: '#111827',       // kartlar
                'surface-raised': '#1f2937', // kart içi input/buton
                'surface-overlay': '#0f172a', // sticky bar / mobil panel

                // Anlamsal vurgu & durum
                accent: '#3b82f6',        // birincil
                'accent-2': '#8b5cf6',    // vurgu (gradient ikinci ucu)
                'state-success': '#22c55e',
                'state-warn': '#eab308',
                'state-danger': '#ef4444',
            },
            // Radius ölçeği (sm/md/lg/pill) — util'ler opt-in, görsel değişmez
            borderRadius: {
                'token-sm': '0.5rem',   // küçük çipler
                'token-md': '0.75rem',  // kartlar
                'token-lg': '1.25rem',  // büyük paneller
                'token-pill': '9999px',
            },
            // Display tipografi ölçeği (opt-in util'ler)
            fontSize: {
                'display-sm': ['2.25rem', { lineHeight: '1.15', fontWeight: '700' }],
                'display-md': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
                'display-lg': ['3.75rem', { lineHeight: '1.05', fontWeight: '700' }],
            },
            transitionTimingFunction: {
                'token-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },
    plugins: [
        typography,
    ],
}
