import React, { useContext, useState } from 'react'
import { CourseContext } from '../contexts/CourseContext'
import { User, Trophy, BookOpen, Clock, Star, Edit, Save, X } from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const Profile = () => {
  const { userProfile, updateUserProfile, courses, userProgress } = useContext(CourseContext)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    interests: userProfile.interests || [],
    level: userProfile.level || 'beginner'
  })

  const completedCourses = Object.entries(userProgress).filter(([_, progress]) => progress.status === 'completed')
  const inProgressCourses = Object.entries(userProgress).filter(([_, progress]) => progress.status === 'in_progress')
  
  const totalHours = completedCourses.reduce((total, [courseId]) => {
    const course = courses.find(c => c.id === parseInt(courseId))
    return total + (course ? course.duration : 0)
  }, 0)

  const badges = [
    { name: 'First Course', description: 'Completed your first course', earned: completedCourses.length >= 1 },
    { name: 'Quick Learner', description: 'Completed 3 courses', earned: completedCourses.length >= 3 },
    { name: 'Dedicated Student', description: 'Completed 10 courses', earned: completedCourses.length >= 10 },
    { name: 'Time Master', description: 'Spent 50+ hours learning', earned: totalHours >= 3000 },
    { name: 'Explorer', description: 'Tried 3 different categories', earned: false }, // Would need category tracking
  ]

  const earnedBadges = badges.filter(badge => badge.earned)

  // Progress chart data
  const progressData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [
        completedCourses.length,
        inProgressCourses.length,
        Math.max(0, courses.length - completedCourses.length - inProgressCourses.length)
      ],
      backgroundColor: ['#22c55e', '#3b82f6', '#e5e7eb'],
      borderWidth: 0
    }]
  }

  // Learning hours by month (mock data)
  const learningData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Hours Learned',
      data: [12, 19, 15, 25, 22, 18],
      backgroundColor: '#3b82f6',
      borderRadius: 4
    }]
  }

  const handleSaveProfile = () => {
    updateUserProfile(editForm)
    setIsEditing(false)
  }

  const handleInterestToggle = (interest) => {
    const newInterests = editForm.interests.includes(interest)
      ? editForm.interests.filter(i => i !== interest)
      : [...editForm.interests, interest]
    
    setEditForm({ ...editForm, interests: newInterests })
  }

  const availableInterests = [
    'Programming', 'Data Science', 'Marketing', 'Design', 'Business', 
    'Languages', 'Science', 'Mathematics', 'Personal Development'
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <User size={32} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Learning Profile</h1>
              <p className="text-gray-600">Track your progress and achievements</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit size={16} />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats and Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <BookOpen className="h-6 w-6 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{completedCourses.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{Math.round(totalHours / 60)}h</div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{earnedBadges.length}</div>
              <div className="text-sm text-gray-600">Badges</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <Star className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userProfile.level}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
          </div>

          {/* Progress Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut data={progressData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Activity</h3>
              <div className="h-64">
                <Bar data={learningData} options={{ maintainAspectRatio: false, responsive: true }} />
              </div>
            </div>
          </div>

          {/* Current Courses */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses in Progress</h3>
            {inProgressCourses.length > 0 ? (
              <div className="space-y-3">
                {inProgressCourses.map(([courseId, progress]) => {
                  const course = courses.find(c => c.id === parseInt(courseId))
                  if (!course) return null
                  
                  return (
                    <div key={courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">by {course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{progress.progress}%</div>
                        <div className="w-24 progress-bar mt-1">
                          <div 
                            className="progress-fill bg-blue-500"
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-600">No courses in progress. Start learning today!</p>
            )}
          </div>
        </div>

        {/* Right Column - Profile Details and Badges */}
        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                  <select
                    value={editForm.level}
                    onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                  <div className="space-y-2">
                    {availableInterests.map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.interests.includes(interest)}
                          onChange={() => handleInterestToggle(interest)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-1">
                    <Save size={16} />
                    Save
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-secondary flex items-center gap-1">
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Skill Level:</span>
                  <div className="font-medium text-gray-900 capitalize">{userProfile.level}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Interests:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userProfile.interests.length > 0 ? (
                      userProfile.interests.map((interest, index) => (
                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No interests selected</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
            <div className="space-y-3">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    badge.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Trophy 
                    size={20} 
                    className={badge.earned ? 'text-yellow-500' : 'text-gray-400'} 
                  />
                  <div>
                    <div className={`font-medium ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </div>
                    <div className={`text-sm ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
