import os
import time
from urllib.parse import quote_plus

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "1433")
DB_NAME = os.getenv("DB_NAME", "kolayfinans")
DB_USER = os.getenv("DB_USER", "sa")
DB_PASSWORD = os.getenv("DB_PASSWORD", "KolayFinans_2026!")


def _url(database: str) -> str:
    return (
        f"mssql+pymssql://{quote_plus(DB_USER)}:{quote_plus(DB_PASSWORD)}"
        f"@{DB_HOST}:{DB_PORT}/{database}?charset=utf8"
    )


def ensure_database(retries: int = 60, delay: float = 2.0) -> None:
    """SQL Server hazır olana kadar bekler ve veritabanı yoksa oluşturur."""
    master = create_engine(_url("master"), isolation_level="AUTOCOMMIT")
    last_error: Exception | None = None
    for _ in range(retries):
        try:
            with master.connect() as conn:
                conn.execute(
                    text(f"IF DB_ID(N'{DB_NAME}') IS NULL CREATE DATABASE [{DB_NAME}]")
                )
            master.dispose()
            return
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            time.sleep(delay)
    raise RuntimeError(f"SQL Server'a bağlanılamadı: {last_error}")


engine = create_engine(_url(DB_NAME), pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
