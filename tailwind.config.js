/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      'pink': {
        '50': '#fff4fd',
        '100': '#ffe7fc',
        '200': '#ffcef8',
        '300': '#ff9ced',
        '400': '#fe74e3',
        '500': '#f540d0',
        '600': '#d920b0',
        '700': '#b4178e',
        '800': '#931572', // warning and footer
        '900': '#78175d',
        '950': '#51013c',
        'shadows': '#ff3fdc',
        DEFAULT: '#ff9ced', // all the pink
      },
      'gray': {
        '0': '#cccccc', // brightest text
        '50': '#a8a8a8',
        '100': '#9c9c9c',
        '200': '#858585',
        '300': '#636363',
        '400': '#3b3b3b',
        '500': '#222222',
        '600': '#0f0f0f',
        '700': '#030303',
        '900': '#000000',
        DEFAULT: '#222222',
      },    
      'blue': {
        '50': '#edfcfe',
        '100': '#d0f4fd',
        '200': '#a7e8fa',
        '300': '#5ad2f4',
        '400': '#27bbe9',
        '500': '#0b9ecf',
        '600': '#0d7dad',
        '700': '#11658d',
        '800': '#185472',
        '900': '#184561',
        '950': '#0a2c42',
        DEFAULT: '#5ad2f4', // only one used
      },
    },
    extend: {},
  },
  plugins: [],
}

