import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check, Star } from 'lucide-react'
import { CourseContext } from '../contexts/CourseContext'

const Quiz = () => {
  const navigate = useNavigate()
  const { updateUserProfile } = useContext(CourseContext)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)

  const questions = [
    {
      id: 'interests',
      question: 'What topics interest you most?',
      type: 'multiple',
      options: [
        'Programming & Development',
        'Data Science & Analytics',
        'Digital Marketing',
        'Design & Creativity',
        'Business & Entrepreneurship',
        'Languages',
        'Science & Mathematics',
        'Personal Development'
      ]
    },
    {
      id: 'level',
      question: 'What is your current skill level?',
      type: 'single',
      options: [
        { value: 'beginner', label: 'Beginner - Just starting out' },
        { value: 'intermediate', label: 'Intermediate - Some experience' },
        { value: 'advanced', label: 'Advanced - Experienced learner' }
      ]
    },
    {
      id: 'time',
      question: 'How much time can you dedicate to learning per week?',
      type: 'single',
      options: [
        { value: 'light', label: '1-3 hours per week' },
        { value: 'moderate', label: '4-7 hours per week' },
        { value: 'intensive', label: '8+ hours per week' }
      ]
    },
    {
      id: 'format',
      question: 'What learning format do you prefer?',
      type: 'multiple',
      options: [
        'Video tutorials',
        'Interactive exercises',
        'Reading materials',
        'Live sessions',
        'Project-based learning'
      ]
    },
    {
      id: 'goals',
      question: 'What are your learning goals?',
      type: 'multiple',
      options: [
        'Career advancement',
        'Personal interest',
        'Skill certification',
        'Academic requirements',
        'Starting a business',
        'Changing careers'
      ]
    }
  ]

  const handleAnswerChange = (questionId, value, isMultiple = false) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || []
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(answer => answer !== value)
        : [...currentAnswers, value]
      
      setAnswers({
        ...answers,
        [questionId]: newAnswers
      })
    } else {
      setAnswers({
        ...answers,
        [questionId]: value
      })
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeQuiz()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const completeQuiz = () => {
    // Process quiz results and update user profile
    const interests = answers.interests || []
    const level = answers.level || 'beginner'
    const timeCommitment = answers.time || 'light'
    const preferredFormats = answers.format || []
    const goals = answers.goals || []

    updateUserProfile({
      interests,
      level,
      timeCommitment,
      preferredFormats,
      goals,
      quizCompleted: true,
      quizCompletedAt: new Date().toISOString()
    })

    setIsCompleted(true)
  }

  const currentQ = questions[currentQuestion]
  const isAnswered = answers[currentQ.id] && 
    (Array.isArray(answers[currentQ.id]) ? answers[currentQ.id].length > 0 : true)

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-green-500 mb-6">
            <Check size={64} className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
          <p className="text-gray-600 mb-8">
            Great! We've analyzed your preferences and will now show you personalized course recommendations.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/courses')}
              className="btn-primary w-full text-lg py-3"
            >
              View Recommended Courses
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary w-full"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.value
              const optionLabel = typeof option === 'string' ? option : option.label
              const isSelected = currentQ.type === 'multiple' 
                ? (answers[currentQ.id] || []).includes(optionValue)
                : answers[currentQ.id] === optionValue

              return (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type={currentQ.type === 'multiple' ? 'checkbox' : 'radio'}
                      name={currentQ.id}
                      value={optionValue}
                      checked={isSelected}
                      onChange={() => handleAnswerChange(currentQ.id, optionValue, currentQ.type === 'multiple')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-900">{optionLabel}</span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz
