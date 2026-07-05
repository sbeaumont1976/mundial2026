import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fuentes locales (sin CDN externo): se empaquetan con la app.
import '@fontsource/anton/400.css'
import '@fontsource/archivo/400.css'
import '@fontsource/archivo/500.css'
import '@fontsource/archivo/600.css'
import '@fontsource/archivo/700.css'
import '@fontsource/spline-sans-mono/400.css'
import '@fontsource/spline-sans-mono/500.css'

// Banderas SVG
import 'flag-icons/css/flag-icons.min.css'

import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
