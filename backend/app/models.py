from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    instructor = Column(String(255))
    duration = Column(Integer)  # in minutes
    level = Column(String(50))  # beginner, intermediate, advanced
    category = Column(String(100), index=True)
    source = Column(String(100), index=True)  # YouTube, OpenCourseWare, etc.
    url = Column(String(500), nullable=False)
    thumbnail = Column(String(500))
    rating = Column(Float, default=0.0)
    students = Column(Integer, default=0)
    tags = Column(JSON)  # List of tags
    lessons = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user_progress = relationship("UserProgress", back_populates="course")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(100), primary_key=True, index=True)  # Can be UUID or session ID
    interests = Column(JSON)  # List of interests
    level = Column(String(50), default="beginner")
    time_commitment = Column(String(50))  # light, moderate, intensive
    preferred_formats = Column(JSON)  # List of preferred learning formats
    goals = Column(JSON)  # List of learning goals
    quiz_completed = Column(Boolean, default=False)
    quiz_completed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    progress = relationship("UserProgress", back_populates="user")
    quiz_results = relationship("QuizResult", back_populates="user")

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    status = Column(String(50), default="not_started")  # not_started, in_progress, completed
    progress = Column(Integer, default=0)  # 0-100 percentage
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    last_accessed = Column(DateTime, default=datetime.utcnow)
    time_spent = Column(Integer, default=0)  # in minutes
    
    # Relationships
    user = relationship("User", back_populates="progress")
    course = relationship("Course", back_populates="user_progress")

class QuizResult(Base):
    __tablename__ = "quiz_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False)
    answers = Column(JSON, nullable=False)  # Quiz answers
    recommendations = Column(JSON)  # Generated recommendations
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="quiz_results")

class CourseSource(Base):
    __tablename__ = "course_sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    type = Column(String(50))  # video, academic, community
    base_url = Column(String(500))
    api_endpoint = Column(String(500))
    is_active = Column(Boolean, default=True)
    last_sync = Column(DateTime)
    total_courses = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    icon = Column(String(100))
    criteria = Column(JSON)  # Criteria for earning the badge
    created_at = Column(DateTime, default=datetime.utcnow)

class UserBadge(Base):
    __tablename__ = "user_badges"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
