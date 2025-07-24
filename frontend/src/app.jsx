import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Courses from './pages/courses'
import Quiz from './pages/Quiz'
import Profile from './pages/Profile'
import { CourseProvider } from './contexts/CourseContext'

function App() {
  return (
    <CourseProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </CourseProvider>
  )
}

export default App