#!/usr/bin/env python3
"""
FreeCourseHub Backend Startup Script
"""
import uvicorn
from app.main import app
from app.database import init_db

def start_server():
    """Initialize database and start the server"""
    print("Initializing FreeCourseHub database...")
    init_db()
    print("Database initialized successfully!")
    
    print("Starting FreeCourseHub API server...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    start_server()
