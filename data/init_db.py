Course(
  title="Основы Python за 7 дней",
  description="Курс из Telegram-канала с задачами",
  platform="Telegram",
  url="https://t.me/freepythoncourse",
  language="ru",
  duration_minutes=420,
  topic="Программирование",
  level="beginner",
  is_verified=True
)
@router.get("/courses")
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()
