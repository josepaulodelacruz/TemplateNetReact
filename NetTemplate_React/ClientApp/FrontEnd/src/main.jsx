import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import Router from './routes.jsx'

const root = document.getElementById('root')

createRoot(root).render(
  <RouterProvider router={Router} />
)
