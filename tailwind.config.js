import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        firacode: ['firacode'],
      },
      typography: {
        DEFAULT: {
          css: {
            'a': {
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'none',
              },
            },
            '.prose a': {
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            h1: {
              fontSize: '2.25em',
              fontWeight: '700',
            },
            h2: {
              fontSize: '1.875em',
              fontWeight: '600',
              'scroll-margin': '100px',
            },
            h3: {
              fontSize: '1.5em',
              fontWeight: '600',
              'scroll-margin': '100px',
            },
            blockquote: {
              fontWeight: null,
              'p:first-of-type::before': { content: 'none' },
              'p:first-of-type::after': { content: 'none' },
              borderInlineStartWidth: '3px',
              color: '#999',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            'li p': { margin: '0 !important' },
            p: { 'overflow-wrap': 'break-word' },
            td: {
              overflowWrap: 'anywhere',
            },
          },
        },
      },
      screens: {
        sm: '480px',
        md: '734px',
        lg: '1068px',
      },
      colors: {
        lightgray: '#f5f5f7',
        textblack: 'rgb(29,29,31)',
      },
    },
  },
  plugins: [typography],
};
