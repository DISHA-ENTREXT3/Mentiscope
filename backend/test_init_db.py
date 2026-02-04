import asyncio
from app.db.base import Base
from app.db.session import engine

async def init_db():
    async with engine.begin() as conn:
        try:
            await conn.run_sync(Base.metadata.create_all)
            print("Successfully created all tables.")
        except Exception as e:
            print(f"Error creating tables: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(init_db())
