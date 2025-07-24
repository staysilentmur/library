import React, { useState, useEffect, useContext } from 'react'
import { Search, Filter, Star, Clock, Users, Play } from 'lucide-react'
import { CourseContext } from '../contexts/CourseContext'
import CourseCard from '../components/CourseCard'
import FilterPanel from '../components/FilterPanel.jsx'
import SearchBar from '../components/SearchBar'

// Define Course interface
interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: string;
  category: string;
  source: string;
  url: string;
  thumbnail: string;
  rating: number;
  students: number;
  tags: string[];
  lessons: number;
  lastUpdated: string;
}

const Courses = () => {
  const { courses, loading, searchCourses, filterCourses } = useContext(CourseContext)
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    duration: '',
    source: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let result = courses
    
    // Apply search
    if (searchTerm) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    // Apply filters
    if (filters.category) {
      result = result.filter(course => course.category === filters.category)
    }
    if (filters.level) {
      result = result.filter(course => course.level === filters.level)
    }
    if (filters.duration) {
      result = result.filter(course => course.duration <= parseInt(filters.duration))
    }
    if (filters.source) {
      result = result.filter(course => course.source === filters.source)
    }
    
    setFilteredCourses(result)
  }, [courses, searchTerm, filters])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Free Courses</h1>
        <p className="text-gray-600">Explore thousands of high-quality courses from top platforms</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder="Search courses, topics, or instructors..." />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2 md:w-auto w-full justify-center"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>
        
        {showFilters && (
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.values(filters).some(f => f) 
              ? "Try adjusting your search or filters" 
              : "No courses available at the moment"}
          </p>
          {(searchTerm || Object.values(filters).some(f => f)) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilters({ category: '', level: '', duration: '', source: '' })
              }}
              className="btn-primary"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Courses