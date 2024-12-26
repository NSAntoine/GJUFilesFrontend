import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import CoursePage from './CoursePage.tsx'
import AboutPage from './AboutPage.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  // Add more routes here as needed
  {
    path: "/course/:courseId",
    element: <CoursePage />,
  },
  {
    path: "/about",
    element: <AboutPage />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

