import React from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAppState } from '@/context'
import NativeLayout from '@/components/layout/NativeLayout'
import Login from '@/features/auth/screens/Login'
import Home from '@/features/home/screens/Home'
import CreateTask from '@/features/tasks/screens/CreateTask'
import EditTask from '@/features/tasks/screens/EditTask'
import CreateCategory from '@/features/categories/screens/CreateCategory'
import CarrotCollection from '@/features/carrots/screens/CarrotCollection'
import Profile from '@/features/profile/screens/ProfileDrawer'

function ProtectedRoute() {
  const { user } = useAppState()
  return user?.isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}

const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <NativeLayout />,
          children: [
            { path: '/',                    element: <Home /> },
            { path: '/tasks/create',        element: <CreateTask /> },
            { path: '/tasks/:id/edit',      element: <EditTask /> },
            { path: '/categories/create',   element: <CreateCategory /> },
            { path: '/carrots',             element: <CarrotCollection /> },
            { path: '/profile',             element: <Profile /> },
          ],
        },
      ],
    },
    // Catch-all → home
    { path: '*', element: <Navigate to="/" replace /> },
  ],
  { basename: import.meta.env.BASE_URL }
)

export default router
