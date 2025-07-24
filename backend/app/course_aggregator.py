import asyncio
import aiohttp
import feedparser
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
from datetime import datetime
import json
import re

from .schemas import CourseResponse

class CourseAggregator:
    def __init__(self):
        self.sources = {
            'youtube': YouTubeAggregator(),
            'opencourseware': OpenCourseWareAggregator(),
            'telegram': TelegramAggregator(),
            'saylor': SaylorAggregator(),
            'swayam': SwayamAggregator()
        }
        self.mock_courses = self._load_mock_courses()
    
    def _load_mock_courses(self):
        """Load mock courses for development"""
        return [
            {
                "id": 1,
                "title": "Introduction to React",
                "description": "Learn the fundamentals of React including components, state, and props",
                "instructor": "John Doe",
                "duration": 120,
                "level": "beginner",
                "category": "Programming",
                "source": "YouTube",
                "url": "https://youtube.com/watch?v=example",
                "thumbnail": "https://via.placeholder.com/300x200",
                "rating": 4.8,
                "students": 15420,
                "tags": ["react", "javascript", "frontend", "web development"],
                "lessons": 24,
                "last_updated": datetime.now(),
                "created_at": datetime.now(),
                "is_active": True
            },
            {
                "id": 2,
                "title": "Python for Data Science",
                "description": "Complete guide to using Python for data analysis and machine learning",
                "instructor": "Jane Smith",
                "duration": 180,
                "level": "intermediate",
                "category": "Data Science",
                "source": "OpenCourseWare",
                "url": "https://ocw.mit.edu/example",
                "thumbnail": "https://via.placeholder.com/300x200",
                "rating": 4.9,
                "students": 8930,
                "tags": ["python", "data science", "machine learning", "pandas"],
                "lessons": 36,
                "last_updated": datetime.now(),
                "created_at": datetime.now(),
                "is_active": True
            },
            {
                "id": 3,
                "title": "Digital Marketing Fundamentals",
                "description": "Learn the basics of digital marketing including SEO, social media, and analytics",
                "instructor": "Mike Johnson",
                "duration": 90,
                "level": "beginner",
                "category": "Marketing",
                "source": "Telegram",
                "url": "https://t.me/example",
                "thumbnail": "https://via.placeholder.com/300x200",
                "rating": 4.6,
                "students": 12100,
                "tags": ["marketing", "seo", "social media", "analytics"],
                "lessons": 18,
                "last_updated": datetime.now(),
                "created_at": datetime.now(),
                "is_active": True
            },
            {
                "id": 4,
                "title": "Introduction to Machine Learning",
                "description": "Comprehensive introduction to ML algorithms and applications",
                "instructor": "Dr. Sarah Wilson",
                "duration": 240,
                "level": "intermediate",
                "category": "Data Science",
                "source": "Saylor",
                "url": "https://saylor.org/example",
                "thumbnail": "https://via.placeholder.com/300x200",
                "rating": 4.7,
                "students": 6500,
                "tags": ["machine learning", "ai", "algorithms", "python"],
                "lessons": 48,
                "last_updated": datetime.now(),
                "created_at": datetime.now(),
                "is_active": True
            },
            {
                "id": 5,
                "title": "Web Design with CSS",
                "description": "Master CSS for creating beautiful and responsive web designs",
                "instructor": "Alex Chen",
                "duration": 150,
                "level": "beginner",
                "category": "Design",
                "source": "YouTube",
                "url": "https://youtube.com/watch?v=css-example",
                "thumbnail": "https://via.placeholder.com/300x200",
                "rating": 4.5,
                "students": 18200,
                "tags": ["css", "web design", "responsive", "frontend"],
                "lessons": 30,
                "last_updated": datetime.now(),
                "created_at": datetime.now(),
                "is_active": True
            }
        ]
    
    async def get_courses(self, category=None, level=None, source=None, search=None, limit=50):
        """Get courses with optional filtering"""
        courses = self.mock_courses.copy()
        
        # Apply filters
        if category:
            courses = [c for c in courses if c['category'].lower() == category.lower()]
        
        if level:
            courses = [c for c in courses if c['level'].lower() == level.lower()]
        
        if source:
            courses = [c for c in courses if c['source'].lower() == source.lower()]
        
        if search:
            search_lower = search.lower()
            courses = [c for c in courses if 
                      search_lower in c['title'].lower() or
                      search_lower in c['description'].lower() or
                      any(search_lower in tag.lower() for tag in c['tags'])]
        
        return courses[:limit]
    
    async def get_course_by_id(self, course_id: int):
        """Get a specific course by ID"""
        for course in self.mock_courses:
            if course['id'] == course_id:
                return course
        return None
    
    async def get_recommendations(self, user_id: str, limit: int = 6):
        """Get personalized recommendations for a user"""
        # For now, return popular courses from different categories
        recommendations = []
        categories_seen = set()
        
        for course in self.mock_courses:
            if course['category'] not in categories_seen:
                recommendations.append(course)
                categories_seen.add(course['category'])
                if len(recommendations) >= limit:
                    break
        
        return recommendations
    
    async def get_quiz_recommendations(self, quiz_answers: Dict):
        """Generate recommendations based on quiz answers"""
        interests = quiz_answers.get('interests', [])
        level = quiz_answers.get('level', 'beginner')
        
        recommendations = []
        for course in self.mock_courses:
            # Match interests with course category or tags
            if interests:
                interest_match = any(
                    interest.lower() in course['category'].lower() or
                    any(interest.lower() in tag.lower() for tag in course['tags'])
                    for interest in interests
                )
                if interest_match and course['level'] == level:
                    recommendations.append(course)
        
        return recommendations[:6]
    
    async def advanced_search(self, query: Dict):
        """Advanced search with multiple criteria"""
        courses = self.mock_courses.copy()
        
        if query.get('query'):
            search_term = query['query'].lower()
            courses = [c for c in courses if 
                      search_term in c['title'].lower() or
                      search_term in c['description'].lower()]
        
        if query.get('min_rating'):
            courses = [c for c in courses if c['rating'] >= query['min_rating']]
        
        if query.get('max_duration'):
            courses = [c for c in courses if c['duration'] <= query['max_duration']]
        
        if query.get('tags'):
            courses = [c for c in courses if 
                      any(tag.lower() in [t.lower() for t in c['tags']] 
                          for tag in query['tags'])]
        
        return courses
    
    async def refresh_all_sources(self):
        """Refresh course data from all sources"""
        tasks = []
        for source_name, aggregator in self.sources.items():
            tasks.append(aggregator.fetch_courses())
        
        # Run all source fetching in parallel
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results and update database
        total_new_courses = 0
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                print(f"Error fetching from {list(self.sources.keys())[i]}: {result}")
            else:
                total_new_courses += len(result)
        
        return {"total_new_courses": total_new_courses}

class YouTubeAggregator:
    async def fetch_courses(self):
        """Fetch courses from YouTube API"""
        # In a real implementation, this would use YouTube Data API
        # For now, return empty list
        return []

class OpenCourseWareAggregator:
    async def fetch_courses(self):
        """Fetch courses from OpenCourseWare platforms"""
        # In a real implementation, this would scrape OCW sites
        return []

class TelegramAggregator:
    async def fetch_courses(self):
        """Fetch courses from Telegram channels"""
        # In a real implementation, this would use Telegram Bot API
        return []

class SaylorAggregator:
    async def fetch_courses(self):
        """Fetch courses from Saylor Academy"""
        # In a real implementation, this would scrape Saylor.org
        return []

class SwayamAggregator:
    async def fetch_courses(self):
        """Fetch courses from SWAYAM platform"""
        # In a real implementation, this would use SWAYAM API
        return []
