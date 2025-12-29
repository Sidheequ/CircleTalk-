import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import NavBar from './components/NavBar'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Settings from './components/Settings'
import Profile from './components/Profile'
import Contacts from './components/Contacts'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const { checkAuth } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    checkAuth();
    initTheme();
  }, [checkAuth, initTheme]);

  console.log(authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <>
      <div>
        <NavBar />


        <main>
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/signup" />} />
            <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/contacts" element={authUser ? <Contacts /> : <Navigate to="/login" />} />
          </Routes>
        </main>

        <Toaster />
      </div>

    </>
  )
}

export default App
