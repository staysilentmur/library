import React, { useContext } from 'react'
import { Star, Clock, Users, Play, BookOpen, ExternalLink } from 'lucide-react'
import { CourseContext } from '../contexts/CourseContext'

const CourseCard = ({ course }) => {
  const { getCourseProgress, updateProgress } = useContext(CourseContext)
  const progress = getCourseProgress(course.id)

  const getSourceIcon = (source) => {
    switch (source.toLowerCase()) {
      case 'youtube':
        return '📺'
      case 'telegram':
        return '📱'
      case 'opencourseware':
        return '🎓'
      case 'saylor':
        return '📚'
      default:
        return '🌐'
    }
  }

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-blue-500'
      default:
        return 'bg-gray-300'
    }
  }

  const handleStartCourse = () => {
    if (progress.status === 'not_started') {
      updateProgress(course.id, 'in_progress', 0)
    }
    // Open course URL
    window.open(course.url, '_blank')
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 group">
      {/* Course Thumbnail */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <span className="text-lg">{getSourceIcon(course.source)}</span>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`badge ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
        {progress.status !== 'not_started' && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressColor(progress.status)}`}
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">by {course.instructor}</p>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{formatDuration(course.duration)}</span>
          </div>
        </div>

        {/* Course Tags */}
        <div className="flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{course.tags.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleStartCourse}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {progress.status === 'not_started' ? (
              <>
                <Play size={16} />
                Start Course
              </>
            ) : progress.status === 'completed' ? (
              <>
                <BookOpen size={16} />
                Review
              </>
            ) : (
              <>
                <Play size={16} />
                Continue
              </>
            )}
          </button>
          <button
            onClick={() => window.open(course.url, '_blank')}
            className="btn-secondary p-2"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Progress Status */}
        {progress.status !== 'not_started' && (
          <div className="text-xs text-gray-500 text-center">
            {progress.status === 'completed' ? (
              <span className="text-green-600 font-medium">✓ Completed</span>
            ) : (
              <span>Progress: {progress.progress}%</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseCard
