import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import { theme } from './theme.ts'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider defaultColorScheme='dark' theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)
