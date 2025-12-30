export default defineAppConfig({
	ui: {
		primary: 'emerald',
		gray: 'slate',
	},
	docus: {
		title: 'AgencyOS',
		description: 'The complete operating system for your agency.',
		image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e656b66f2c3.png',
		socials: {
			twitter: 'nuxt_js',
			github: 'nuxt-themes/docus',
			nuxt: {
				label: 'Nuxt',
				icon: 'simple-icons:nuxtdotjs',
				href: 'https://nuxt.com'
			}
		},
		github: {
			dir: 'content',
			branch: 'main',
			repo: 'docus',
			owner: 'nuxt-themes',
			edit: true
		},
		aside: {
			level: 0,
			collapsed: false,
			exclude: []
		},
		main: {
			padded: true,
			fluid: true
		},
		header: {
			logo: true,
			showLinkIcon: true,
			exclude: [],
			fluid: true
		}
	}
})
