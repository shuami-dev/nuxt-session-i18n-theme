import { createI18n } from 'vue-i18n'

export function createDynamicI18n(
	languages: Record<string, any>,
	sessionId: string
) {
	let defaultLocale = 'en'

	if (typeof window !== 'undefined') {
		const sessionData = sessionStorage.getItem(sessionId)
		const parsedData = sessionData ? JSON.parse(sessionData) : null

		defaultLocale = parsedData?.language || 'en'
	}

	return createI18n({
		legacy: false,
		locale: defaultLocale,
		fallbackLocale: 'en',
		messages: languages,
	})
}
