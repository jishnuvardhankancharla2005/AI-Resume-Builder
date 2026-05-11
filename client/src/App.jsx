import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import Contacts from './pages/Contacts'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem('token')

      try {
        if (token) {
          const { data } = await api.get('/api/users/data') // api.js handles Authorization

          if (data?.user) {
            dispatch(login({ token, user: data.user }))
          }
        }
      } catch (error) {
        console.log('Failed to fetch user data:', error)
      } finally {
        dispatch(setLoading(false))
      }
    }

    getUserData()
  }, [dispatch])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="/view/:resumeId" element={<Preview />} />
        <Route path="/contact" element={<Contacts />} />
      </Routes>
    </>
  )
}

export default App
