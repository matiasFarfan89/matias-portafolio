/* Tailwind Play CDN config — kept external so the CSP script-src
   doesn't need 'unsafe-inline'. Mirrors the design tokens in
   css/styles.css :root — update both when changing a value. */
tailwind.config = {
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { sm: '540px', md: '720px', lg: '960px', xl: '1140px', '2xl': '1320px' },
    },
    extend: {
      colors: {
        bg: '#0A0A0F', 'bg-alt': '#0E0E16', 'bg-deep': '#07070B',
        surface: '#14141F', surface2: '#1A1A2A',
        accent: '#6C63FF', 'accent-bright': '#8B85FF', mint: '#00F5C4',
        text: '#E2E2EE', 'text-dim': '#8A8AA8',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: { DEFAULT: '12px', lg: '20px' },
    },
  },
  corePlugins: { preflight: false },
}
