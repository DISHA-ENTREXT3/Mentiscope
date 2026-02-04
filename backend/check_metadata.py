import asyncio
from app.db.base import Base
from app.db.session import engine

async def check():
    async with engine.begin() as conn:
        print("Metadata Tables:", Base.metadata.tables.keys())

if __name__ == "__main__":
    asyncio.run(check())
