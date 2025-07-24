from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    instructor: Optional[str] = None
    duration: Optional[int] = None  # in minutes
    level: Optional[str] = None
    category: Optional[str] = None
    source: str
    url: str
    thumbnail: Optional[str] = None
    rating: Optional[float] = 0.0
    students: Optional[int] = 0
    tags: Optional[List[str]] = []
    lessons: Optional[int] = 0

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    last_updated: datetime
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    interests: Optional[List[str]] = []
    level: str = "beginner"
    time_commitment: Optional[str] = None
    preferred_formats: Optional[List[str]] = []
    goals: Optional[List[str]] = []

class UserCreate(UserBase):
    id: str

class UserProfileResponse(UserBase):
    id: str
    quiz_completed: bool
    quiz_completed_at: Optional[datetime] = None
    created_at: datetime
    last_active: datetime
    
    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    user_id: str
    course_id: int
    status: str  # not_started, in_progress, completed
    progress: int = 0  # 0-100 percentage

class UserProgressResponse(BaseModel):
    id: int
    user_id: str
    course_id: int
    status: str
    progress: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    last_accessed: datetime
    time_spent: int = 0
    
    class Config:
        from_attributes = True

class QuizAnswer(BaseModel):
    question_id: str
    answer: Any  # Can be string, list, or other types

class QuizSubmission(BaseModel):
    user_id: str
    answers: Dict[str, Any]

class QuizResultResponse(BaseModel):
    id: int
    user_id: str
    answers: Dict[str, Any]
    recommendations: Optional[List[CourseResponse]] = []
    completed_at: datetime
    
    class Config:
        from_attributes = True

class SearchQuery(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    source: Optional[str] = None
    min_rating: Optional[float] = None
    max_duration: Optional[int] = None
    tags: Optional[List[str]] = []

class CourseRecommendationRequest(BaseModel):
    user_id: str
    limit: int = 6
    categories: Optional[List[str]] = []
    exclude_completed: bool = True

class BadgeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    earned_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    total_courses: int
    active_learners: int
    course_platforms: int
    certificates_issued: int
    last_updated: datetime
