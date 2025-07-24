import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const CourseContext = createContext()

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState({})
  const [userProfile, setUserProfile] = useState({
    interests: [],
    level: 'beginner',
    completedCourses: [],
    badges: []
  })

  // Mock data for development
  const mockCourses = [
    {
      id: 1,
      title: "Introduction to React",
      description: "Learn the fundamentals of React including components, state, and props",
      instructor: "John Doe",
      duration: 120,
      level: "beginner",
      category: "Programming",
      source: "YouTube",
      url: "https://youtube.com/watch?v=example",
      thumbnail: "https://via.placeholder.com/300x200",
      rating: 4.8,
      students: 15420,
      tags: ["react", "javascript", "frontend", "web development"],
      lessons: 24,
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      title: "Python for Data Science",
      description: "Complete guide to using Python for data analysis and machine learning",
      instructor: "Jane Smith",
      duration: 180,
      level: "intermediate",
      category: "Data Science",
      source: "OpenCourseWare",
      url: "https://ocw.mit.edu/example",
      thumbnail: "https://via.placeholder.com/300x200",
      rating: 4.9,
      students: 8930,
      tags: ["python", "data science", "machine learning", "pandas"],
      lessons: 36,
      lastUpdated: "2024-01-10"
    },
    {
      id: 3,
      title: "Digital Marketing Fundamentals",
      description: "Learn the basics of digital marketing including SEO, social media, and analytics",
      instructor: "Mike Johnson",
      duration: 90,
      level: "beginner",
      category: "Marketing",
      source: "Telegram",
      url: "https://t.me/example",
      thumbnail: "https://via.placeholder.com/300x200",
      rating: 4.6,
      students: 12100,
      tags: ["marketing", "seo", "social media", "analytics"],
      lessons: 18,
      lastUpdated: "2024-01-12"
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchCourses = async () => {
      try {
        setLoading(true)
        // In production, this would be: const response = await axios.get('/api/courses')
        // For now, using mock data
        setTimeout(() => {
          setCourses(mockCourses)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setCourses(mockCourses) // Fallback to mock data
        setLoading(false)
      }
    }

    fetchCourses()
    loadUserProgress()
  }, [])

  const loadUserProgress = () => {
    const savedProgress = localStorage.getItem('courseProgress')
    const savedProfile = localStorage.getItem('userProfile')
    
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }
  }

  const updateProgress = (courseId, status, progress = 0) => {
    const newProgress = {
      ...userProgress,
      [courseId]: { status, progress, lastAccessed: new Date().toISOString() }
    }
    setUserProgress(newProgress)
    localStorage.setItem('courseProgress', JSON.stringify(newProgress))
  }

  const updateUserProfile = (updates) => {
    const newProfile = { ...userProfile, ...updates }
    setUserProfile(newProfile)
    localStorage.setItem('userProfile', JSON.stringify(newProfile))
  }

  const getCourseProgress = (courseId) => {
    return userProgress[courseId] || { status: 'not_started', progress: 0 }
  }

  const getRecommendedCourses = () => {
    // Simple recommendation based on user interests and level
    return courses.filter(course => {
      const matchesInterests = userProfile.interests.length === 0 || 
        userProfile.interests.some(interest => 
          course.tags.includes(interest.toLowerCase()) || 
          course.category.toLowerCase().includes(interest.toLowerCase())
        )
      const matchesLevel = course.level === userProfile.level || course.level === 'beginner'
      return matchesInterests && matchesLevel
    }).slice(0, 6)
  }

  const searchCourses = (query) => {
    return courses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }

  const value = {
    courses,
    loading,
    userProgress,
    userProfile,
    updateProgress,
    updateUserProfile,
    getCourseProgress,
    getRecommendedCourses,
    searchCourses,
    setCourses
  }

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}
