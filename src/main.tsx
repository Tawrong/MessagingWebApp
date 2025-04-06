import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import LoginForm from './pages/LoginForm.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import ChatMessages from './pages/ChatMessages.tsx'
import GlobalChats from './pages/GlobalChats.tsx'
import GroupMessages from './pages/GroupMessages.tsx'
import Layout from './components/Layout.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginForm />,
    errorElement: <NotFoundPage />
  },
  {
    path: '/',
    element: <Layout/>, // Wrap routes with NavBar
    children: [
      {
        path: '/PrivateChats',
        element: <ChatMessages />
      },
      {
        path: '/GlobalChats',
        element: <GlobalChats />
      },
      {
        path: '/GroupChats',
        element: <GroupMessages />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
