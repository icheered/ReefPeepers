const daisyui = require('daisyui');
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#FF0000',
					dark: '#ea580c',
					light: '#f97316'
				}
			}
		},
		fontFamily: {
			sans: ['Poppins', 'sans-serif']
		}
	},
	plugins: [typography, daisyui],
	daisyui: {
		themes: ['light', 'dark']
	}
};

module.exports = config;
