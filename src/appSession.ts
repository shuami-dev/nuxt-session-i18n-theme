import { ref, onMounted, watch } from 'vue'
import { jwtDecode } from "jwt-decode"
import { useI18n } from "vue-i18n"

export function useAppSession(
	sessionId: string,
	keyField: string,
	appField: string
) {
	const keyId = ref('')
	const appUid = ref('')
	const language = ref('')
	const themeMode = ref('')

	const getSessionData = () => {
		if (typeof window !== 'undefined') {
			// Retrieve the current session data from sessionStorage
			const data = sessionStorage.getItem(sessionId)
			let parsedData: any = null

			if (data) {
				try {
					parsedData = JSON.parse(data)
				} catch (error) {
					console.error('Error parsing session data:', error)
				}
			}

			// jwt token handler
			const token = parsedData?.token?.length > 1 ? parsedData?.token : 'x'
			const inputData: any = token !== 'x' ? jwtDecode(token) : 'x'
			const inputKey = inputData !== 'x' ? inputData?.[keyField] : ''

			const inputAppUid = parsedData?.[appField] || ''
			const inputLang = parsedData?.language || 'en'
			const inputTheme = parsedData?.themeMode || 'light'

			return {inputKey, inputAppUid, inputLang, inputTheme}
		}
		return {inputKey: '', inputAppUid: '', inputLang: 'en', inputTheme: 'light'}
	}

	const setupSession = () => {
		const {inputKey, inputAppUid, inputLang, inputTheme} = getSessionData()

		keyId.value = inputKey
		appUid.value = inputAppUid
		language.value = inputLang
		themeMode.value = inputTheme
	}

	const setAppUid = (newAppUid: string) => {
    appUid.value = newAppUid

    if (typeof window !== 'undefined') {
			// Retrieve the current session data from sessionStorage
      const data = sessionStorage.getItem(sessionId)
      let parsedData: any = data ? JSON.parse(data) : {}

			// Update the appUid value in the session data
      parsedData[appField] = newAppUid

			// Save the updated session data back to sessionStorage
      sessionStorage.setItem(sessionId, JSON.stringify(parsedData))
    }
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

	return {keyId, appUid, language, themeMode, setAppUid }
}
