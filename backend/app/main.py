from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import uvicorn
from datetime import datetime
import json
import os

from .models import Course, User, UserProgress, QuizResult
from .database import get_db, SessionLocal
from .course_aggregator import CourseAggregator
from .schemas import CourseResponse, UserProfileResponse, ProgressUpdate

app = FastAPI(
    title="FreeCourseHub API",
    description="API for aggregating and managing free courses",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize course aggregator
course_aggregator = CourseAggregator()

@app.get("/")
async def root():
    return {"message": "FreeCourseHub API", "version": "1.0.0"}

@app.get("/api/courses", response_model=List[CourseResponse])
async def get_courses(
    category: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=100)
):
    """Get courses with optional filtering"""
    try:
        courses = await course_aggregator.get_courses(
            category=category,
            level=level,
            source=source,
            search=search,
            limit=limit
        )
        return courses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/courses/{course_id}", response_model=CourseResponse)
async def get_course(course_id: int):
    """Get a specific course by ID"""
    try:
        course = await course_aggregator.get_course_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/courses/recommended/{user_id}")
async def get_recommended_courses(user_id: str, limit: int = Query(6, le=20)):
    """Get personalized course recommendations"""
    try:
        # In a real implementation, this would use ML algorithms
        # For now, return courses based on user profile
        recommendations = await course_aggregator.get_recommendations(user_id, limit)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/courses/search")
async def search_courses(query: dict):
    """Advanced course search with multiple criteria"""
    try:
        results = await course_aggregator.advanced_search(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sources")
async def get_available_sources():
    """Get list of available course sources"""
    return {
        "sources": [
            {"name": "YouTube", "type": "video", "active": True},
            {"name": "OpenCourseWare", "type": "academic", "active": True},
            {"name": "Telegram", "type": "community", "active": True},
            {"name": "Saylor", "type": "academic", "active": True},
            {"name": "SWAYAM", "type": "academic", "active": True}
        ]
    }

@app.get("/api/categories")
async def get_categories():
    """Get available course categories"""
    return {
        "categories": [
            "Programming", "Data Science", "Marketing", "Design", 
            "Business", "Languages", "Science", "Mathematics",
            "Personal Development", "Arts", "Health", "Technology"
        ]
    }

@app.post("/api/user/progress")
async def update_user_progress(progress: ProgressUpdate):
    """Update user's course progress"""
    try:
        # Store progress in database or local storage
        # For now, return success response
        return {"success": True, "message": "Progress updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/{user_id}/progress")
async def get_user_progress(user_id: str):
    """Get user's learning progress"""
    try:
        # In a real implementation, fetch from database
        # For now, return mock data
        return {
            "user_id": user_id,
            "completed_courses": [],
            "in_progress_courses": [],
            "total_hours": 0,
            "badges": []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz/submit")
async def submit_quiz(quiz_result: dict):
    """Submit quiz results and get recommendations"""
    try:
        # Process quiz results and generate recommendations
        user_id = quiz_result.get("user_id", "anonymous")
        answers = quiz_result.get("answers", {})
        
        # Generate recommendations based on quiz answers
        recommendations = await course_aggregator.get_quiz_recommendations(answers)
        
        return {
            "success": True,
            "recommendations": recommendations,
            "profile_updated": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def get_platform_stats():
    """Get platform statistics"""
    return {
        "total_courses": 10000,
        "active_learners": 50000,
        "course_platforms": 15,
        "certificates_issued": 5000,
        "last_updated": datetime.now().isoformat()
    }

@app.post("/api/courses/refresh")
async def refresh_courses():
    """Trigger course data refresh from all sources"""
    try:
        await course_aggregator.refresh_all_sources()
        return {"success": True, "message": "Course refresh initiated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)