from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Unicode,
    UnicodeText,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Bank(Base):
    __tablename__ = "banks"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(Unicode(80), unique=True)
    name: Mapped[str] = mapped_column(Unicode(120))
    website_url: Mapped[str] = mapped_column(Unicode(300))

    products: Mapped[list["Product"]] = relationship(back_populates="bank")


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(Unicode(80), unique=True)
    name: Mapped[str] = mapped_column(Unicode(120))
    description: Mapped[str] = mapped_column(UnicodeText)
    icon: Mapped[str] = mapped_column(Unicode(16))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    # "Paranı yatırdığında ne olacak?" adımları: [{title, description, icon}]
    flow_steps: Mapped[list] = mapped_column(JSON)
    # Kategoriye özgü dikkat edilmesi gereken noktalar: [str]
    key_risks: Mapped[list] = mapped_column(JSON)

    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(Unicode(120), unique=True)
    bank_id: Mapped[int] = mapped_column(ForeignKey("banks.id"))
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    name: Mapped[str] = mapped_column(Unicode(160))
    summary: Mapped[str] = mapped_column(UnicodeText)
    currency: Mapped[str] = mapped_column(Unicode(8), default="TL")
    min_amount: Mapped[Decimal] = mapped_column(Numeric(18, 2))
    max_amount: Mapped[Decimal | None] = mapped_column(Numeric(18, 2))
    # Vade gün cinsinden; ikisi de boşsa ürün vadesiz/esnektir.
    min_term_days: Mapped[int | None] = mapped_column(Integer)
    max_term_days: Mapped[int | None] = mapped_column(Integer)
    risk_level: Mapped[int] = mapped_column(Integer)  # 1 (çok düşük) - 5 (çok yüksek)
    return_type: Mapped[str] = mapped_column(Unicode(80))
    return_info: Mapped[str] = mapped_column(Unicode(300))
    fees: Mapped[str | None] = mapped_column(UnicodeText)
    features: Mapped[list] = mapped_column(JSON)
    # Ürüne özel akış; boşsa kategorinin akışı kullanılır.
    flow_steps: Mapped[list | None] = mapped_column(JSON)
    source_label: Mapped[str] = mapped_column(Unicode(200))
    source_url: Mapped[str] = mapped_column(Unicode(400))
    official_url: Mapped[str] = mapped_column(Unicode(400))
    fetched_at: Mapped[datetime] = mapped_column(DateTime)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)

    bank: Mapped[Bank] = relationship(back_populates="products")
    category: Mapped[Category] = relationship(back_populates="products")
