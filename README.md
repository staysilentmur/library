# FreeCourseHub - Interactive Free Course Aggregator

FreeCourseHub is an interactive platform that aggregates free courses from multiple sources including YouTube, OpenCourseWare, Telegram channels, Saylor Academy, and SWAYAM. The platform features personalized recommendations, progress tracking, and gamification elements.

## Features

- 🎯 **Personalized Quiz**: 5-7 question quiz to determine interests and skill level
- 🔍 **Smart Search & Recommendations**: AI-powered course recommendations
- 📊 **Progress Tracking**: Track learning progress with visual indicators
- 🏆 **Gamification**: Badges, achievements, and progress bars
- 🌐 **Multi-Source Aggregation**: Courses from YouTube, OpenCourseWare, Telegram, Saylor, SWAYAM
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Chart.js** for progress visualization
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **FastAPI** for API development
- **SQLAlchemy** for database ORM
- **SQLite** (development) / **PostgreSQL** (production)
- **Pydantic** for data validation
- **BeautifulSoup4** for web scraping
- **yt-dlp** for YouTube integration

## Project Structure

```
freecourse-hub/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── contexts/       # React context providers
│   │   └── assets/         # Static assets
│   ├── package.json
│   └── vite.config.js
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── main.py         # FastAPI application entry point
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── database.py     # Database configuration
│   │   └── course_aggregator.py  # Course data aggregation
│   ├── requirements.txt
│   └── run.py             # Backend startup script
├── data/                   # Course data and databases
├── docker-compose.yml      # Docker configuration
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freecourse-hub
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python run.py
   ```
   The API will be available at `http://localhost:8000`

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

### Development

- **Backend API Documentation**: Visit `http://localhost:8000/docs` for interactive API documentation
- **Frontend Development**: The Vite dev server supports hot reloading
- **Database**: SQLite database will be created automatically in the backend directory

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses with optional filtering
- `GET /api/courses/{id}` - Get specific course details
- `GET /api/courses/recommended/{user_id}` - Get personalized recommendations
- `POST /api/courses/search` - Advanced course search

### User Management
- `POST /api/user/progress` - Update user progress
- `GET /api/user/{user_id}/progress` - Get user progress
- `POST /api/quiz/submit` - Submit quiz results

### Platform Data
- `GET /api/sources` - Get available course sources
- `GET /api/categories` - Get course categories
- `GET /api/stats` - Get platform statistics

## Course Sources

### Currently Supported
- **YouTube**: Educational channels and playlists
- **OpenCourseWare**: MIT, Stanford, and other university courses
- **Telegram**: Educational channels and communities
- **Saylor Academy**: Free online courses
- **SWAYAM**: Government of India's education platform

### Planned Integrations
- Coursera (free courses)
- edX (audit tracks)
- Khan Academy
- FreeCodeCamp
- Udacity (free courses)

## Features in Detail

### Interactive Quiz
- 5-7 questions covering interests, skill level, time commitment, and goals
- Generates personalized course recommendations
- Updates user profile for future recommendations

### Progress Tracking
- Course status: Not Started, In Progress, Completed
- Progress percentage for ongoing courses
- Time spent tracking
- Achievement system with badges

### Gamification
- **Badges**: First Course, Quick Learner, Dedicated Student, Time Master, Explorer
- **Progress Visualization**: Charts and progress bars
- **Learning Streaks**: Track consecutive learning days
- **Leaderboards**: Compare progress with other learners

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [ ] YouTube API integration for real-time course data
- [ ] Telegram Bot for course notifications
- [ ] Advanced ML-based recommendations
- [ ] Mobile app development
- [ ] Offline course downloads
- [ ] Community features and discussions
- [ ] Certificate generation
- [ ] Integration with more course platforms

## Support

For support, email support@freecourse-hub.com or join our community discussions.
