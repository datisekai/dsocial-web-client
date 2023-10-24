/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: [
        {
            mytheme: {
                primary: '#5858FA',
                'primary-focus': '#150AA1',
                'primary-content': '#E0D2FE',
                secondary: '#F000B8',
                'secondary-focus': '#CC009C',
                'secondary-content': '#FFD1F4',
                accent: '#1DCDBC',
                'accent-focus': '#19AE9F',
                'accent-content': '#07312D',
                neutral: '#2B3440',
                'neutral-focus': '#1D232B',
                'neutral-content': '#D8DDE4',
                'base-100': '#fff',
                'base-200': '#F2F2F2',
                'base-300': '#E5E6E6',
                'base-content': '#1F2937',
            },
        },
    ],
};
