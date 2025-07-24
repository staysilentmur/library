import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Search, Trophy, TrendingUp, Star, ArrowRight } from 'lucide-react'
import { CourseContext } from '../contexts/CourseContext'
import CourseCard from '../components/CourseCard'

const Home = () => {
  const { courses, userProfile, getRecommendedCourses } = useContext(CourseContext)
  const recommendedCourses = getRecommendedCourses()
  const featuredCourses = courses.slice(0, 3)

  const stats = [
    { label: 'Free Courses', value: '10,000+', icon: BookOpen },
    { label: 'Active Learners', value: '50,000+', icon: TrendingUp },
    { label: 'Course Platforms', value: '15+', icon: Star },
    { label: 'Certificates', value: '5,000+', icon: Trophy },
  ]

  const features = [
    {
      title: 'Personalized Recommendations',
      description: 'Get course suggestions tailored to your interests and skill level',
      icon: Search,
    },
    {
      title: 'Progress Tracking',
      description: 'Track your learning journey with detailed progress analytics',
      icon: TrendingUp,
    },
    {
      title: 'Achievement System',
      description: 'Earn badges and certificates as you complete courses',
      icon: Trophy,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Discover Free
          <span className="text-primary-600"> Learning</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Access thousands of high-quality courses from YouTube, OpenCourseWare, Telegram, and more. 
          Learn at your own pace with personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/quiz" className="btn-primary text-lg px-8 py-3">
            Take Skill Quiz
          </Link>
          <Link to="/courses" className="btn-secondary text-lg px-8 py-3">
            Browse Courses
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <Icon className="h-8 w-8 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <Link to="/courses" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Courses */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose FreeCourseHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center p-6">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-primary-100 mb-6">
          Take our quick quiz to get personalized course recommendations
        </p>
        <Link to="/quiz" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Get Started
        </Link>
      </div>
    </div>
  )
}

export default Home
