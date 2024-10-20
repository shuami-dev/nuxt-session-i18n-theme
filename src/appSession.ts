import { ref, onMounted, watch } from 'vue'
import { jwtDecode } from "jwt-decode"
import { useI18n } from "vue-i18n"

export function useAppSession(
	sessionId: string,
	keyField: string
) {
	const keyId = ref('')
	const language = ref('')
	const themeMode = ref('')

	const getSessionData = () => {
		if (typeof window !== 'undefined') {
			const data = sessionStorage.getItem(sessionId)
			let parsedData: any = null

			if (data) {
				try {
					parsedData = JSON.parse(data)
				} catch (error) {
					console.error('Error parsing session data:', error)
				}
			}

			const token = parsedData?.token?.length > 1 ? parsedData?.token : 'x'
			const inputData: any = token !== 'x' ? jwtDecode(token) : 'x'
			const inputKey = inputData !== 'x' ? inputData?.[keyField] : ''
			const inputLang = parsedData?.language || 'en'
			const inputTheme = parsedData?.themeMode || 'light'

			return {inputKey, inputLang, inputTheme}
		}
		return {inputKey: '', inputLang: 'en', inputTheme: 'light'}
	}

	const setupSession = () => {
		const {inputKey, inputLang, inputTheme} = getSessionData()

		keyId.value = inputKey
		language.value = inputLang
		themeMode.value = inputTheme
	}

	const {locale} = useI18n()

	// Watch language changes and update the global i18n locale
	watch(language, (newLanguage) => {
		locale.value = newLanguage
	})

	// Watch for theme changes and apply them dynamically
	watch(themeMode, (newTheme) => {
		document.documentElement.classList.toggle('dark', newTheme === 'dark')
	})

	onMounted(() => {
		setupSession()
	})

	return {keyId, language, themeMode}
}
