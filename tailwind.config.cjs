/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {}
    },
    plugins: [
        require("daisyui")
    ],
    daisyui: {
        themes: [
            {
                dark: {
                    "primary": "#30D5C8",
                    "secondary": "#4B4B4B",
                    "accent": "#FF4B4B",
                    "neutral": "#1A1A1A",
                    "base-100": "#282828",
                    "info": "#4DB6AC",
                    "success": "#81C784",
                    "warning": "#FFD54F",
                    "error": "#E57373",
                },
            }
        ]
    }
}
