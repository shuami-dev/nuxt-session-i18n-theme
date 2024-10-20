## Nuxt Session, i18n and Theme

A Nuxt.js package that provides session management, localization (i18n), and theme management functionalities.
This package aims to simplify the implementation of user sessions and multilingual support in your Nuxt applications.

### Features

- Session management using `sessionStorage`.
- Localization support with dynamic language fetching.
- Theme management for light and dark modes.
- Includes global CSS for styling.

### Installation

To install the package, run the following command:

```bash
npm install @shuami-dev/nuxt-session-i18n-theme
```

### Usage

1. Add to Nuxt Config\
    In your nuxt.config.ts, add the package to your CSS array:

```ts
export default defineNuxtConfig({
	css: ["@shuami-dev/nuxt-session-i18n-theme/style.css"],
})
```

2. Configure i18n and theme\
    In your nuxt.config.ts, add the i18n configuration:

```ts
export default defineNuxtConfig({
	plugins: ["~/plugins/i18n.ts", "~/plugins/theme.ts"],
})
```

3. Create i18n.ts file\
    Create i18n.ts file in plugins folder (plugins/i18n.ts):

```ts
import { createDynamicI18n } from "@shuami-dev/nuxt-session-i18n-theme"
import en from "~/locales/en.json"
import ms from "~/locales/ms.json"

export default defineNuxtPlugin((nuxtApp) => {
	const i18n = createDynamicI18n({ en, ms }, "yoursessionId")

	nuxtApp.vueApp.use(i18n)
})
```

4. Create theme.ts file\
    Create theme.ts file in plugins folder (plugins/theme.ts):

```ts
import { applyThemeMode } from "@shuami-dev/nuxt-session-i18n-theme"

export default defineNuxtPlugin(() => {
	applyThemeMode("yoursessionId")
})
```

5. Create en.json file\
    Create en.json file in locales folder (locales/en.json):

```json
{
	"welcome": "Welcome"
}
```

6. Create ms.json file\
    Create ms.json file in locales folder (locales/ms.json):

```json
{
	"welcome": "Selamat Datang"
}
```

7. Using the Package\
    Import and use the provided session, i18n and theme utilities in your components:

```vue
<script setup lang="ts">
	import { useAppSession } from "@shuami-dev/nuxt-session-i18n-theme"

	const { keyId, language, themeMode } = useAppSession(
		"yoursessionId",
		"username"
	)
</script>

<template>
	<div>Page: index</div>
	<div>
		<h1>{{ $t("welcome") }}</h1>
		<p>Key ID: {{ keyId }}</p>
		<p>Current Language: {{ language }}</p>
		<p>Current Theme: {{ themeMode }}</p>
	</div>
</template>

<style scoped></style>
```
