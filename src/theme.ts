export function applyThemeMode(sessionId: string) {
	const applyTheme = (theme: string) => {
		document.documentElement.classList.toggle('dark', theme === 'dark')
	}

	if (typeof window !== 'undefined') {
		const sessionData = sessionStorage.getItem(sessionId)
		const parsedData = sessionData ? JSON.parse(sessionData) : null
		const theme = parsedData?.themeMode || 'light'

		applyTheme(theme)
	}
}
