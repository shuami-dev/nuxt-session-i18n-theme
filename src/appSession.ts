import { ref, onMounted, watch } from "vue"
import { jwtDecode } from "jwt-decode"
import { useI18n } from "vue-i18n"

// Call from nuxt application
// const { keyId, appUid, language, themeMode, optId, setAppUid } = useAppSession(
// 	"dataflutter",
// 	"preferred_username",
// 	"myId" // If any
// )

export function useAppSession(
	sessionId: string,
	keyField: string,
	optionId?: string
) {
	const keyId = ref("")
	const appUid = ref("")
	const language = ref("")
	const themeMode = ref("")
	const optId = ref("")

	const getSessionData = () => {
		if (typeof window !== "undefined") {
			// Retrieve the current session data from sessionStorage
			const data = sessionStorage.getItem(sessionId)
			let parsedData: any = null

			if (data) {
				try {
					parsedData = JSON.parse(data)
				} catch (error) {
					console.error("Error parsing session data:", error)
				}
			}

			// jwt token handler
			const token = parsedData?.token?.length > 1 ? parsedData?.token : "x"
			const inputData: any = token !== "x" ? jwtDecode(token) : "x"
			const inputKey = inputData !== "x" ? inputData?.[keyField] : "" // mandatory field

			const inputAppUid = parsedData?.appUid || "" // mandatory field
			const inputLang = parsedData?.language || "en" // mandatory field
			const inputTheme = parsedData?.themeMode || "light" // mandatory field
			const inputOptId = optionId ? parsedData?.[optionId] : "" // optional field

			return {
				inputKey,
				inputAppUid,
				inputLang,
				inputTheme,
				inputOptId,
			}
		}

		return {
			inputKey: "",
			inputAppUid: "",
			inputLang: "en",
			inputTheme: "light",
			inputOptId: "",
		}
	}

	const setupSession = () => {
		const { inputKey, inputAppUid, inputLang, inputTheme, inputOptId } =
			getSessionData()

		keyId.value = inputKey
		appUid.value = inputAppUid
		language.value = inputLang
		themeMode.value = inputTheme
		optId.value = inputOptId
	}

	const setAppUid = (newAppUid: string) => {
		// appUid.value = newAppUid

		if (typeof window !== "undefined") {
			// Retrieve the current session data from sessionStorage
			const data = sessionStorage.getItem(sessionId)
			let parsedData: any = data ? JSON.parse(data) : {}

			// Update the appUid value in the session data
			parsedData.appUid = newAppUid

			// Save the updated session data back to sessionStorage
			sessionStorage.setItem(sessionId, JSON.stringify(parsedData))
		}
	}

	const { locale } = useI18n()

	// Watch language changes and update the global i18n locale
	watch(language, (newLanguage) => {
		locale.value = newLanguage
	})

	// Watch for theme changes and apply them dynamically
	watch(themeMode, (newTheme) => {
		document.documentElement.classList.toggle("dark", newTheme === "dark")
	})

	onMounted(() => {
		setupSession()
	})

	return { keyId, appUid, language, themeMode, optId, setAppUid }
}
