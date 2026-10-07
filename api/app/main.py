from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from .db import SessionLocal, engine, ensure_database, get_db
from .models import Base, Bank, Category, Product
from .schemas import (
    BankOut,
    CategoryDetail,
    CategoryOut,
    ProductDetail,
    ProductListItem,
)
from .seed import seed_if_empty


@asynccontextmanager
async def lifespan(_: FastAPI):
    ensure_database()
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        seed_if_empty(db)
    yield


app = FastAPI(title="Kolay Finans API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def _detail(p: Product) -> ProductDetail:
    steps = p.flow_steps or p.category.flow_steps or []
    risks = p.category.key_risks or []
    item = ProductListItem.model_validate(p)
    return ProductDetail(
        **item.model_dump(),
        fees=p.fees,
        features=p.features or [],
        flow_steps=steps,
        key_risks=risks,
        source_label=p.source_label,
        source_url=p.source_url,
        official_url=p.official_url,
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/banks", response_model=list[BankOut])
def list_banks(db: Session = Depends(get_db)):
    return db.scalars(select(Bank).order_by(Bank.name)).all()


@app.get("/api/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    counts = dict(
        db.execute(select(Product.category_id, func.count(Product.id)).group_by(Product.category_id)).all()
    )
    result = []
    for c in db.scalars(select(Category).order_by(Category.sort_order)).all():
        item = CategoryOut.model_validate(c)
        item.product_count = counts.get(c.id, 0)
        result.append(item)
    return result


@app.get("/api/categories/{slug}", response_model=CategoryDetail)
def get_category(slug: str, db: Session = Depends(get_db)):
    c = db.scalar(select(Category).where(Category.slug == slug))
    if c is None:
        raise HTTPException(404, "Kategori bulunamadı")
    return CategoryDetail.model_validate(c)


@app.get("/api/products", response_model=list[ProductListItem])
def list_products(
    category: str | None = None,
    bank: str | None = None,
    currency: str | None = None,
    amount: float | None = Query(None, ge=0, description="Yatırmak istenen tutar"),
    term_days: int | None = Query(None, ge=0, description="İstenen vade (gün)"),
    max_risk: int | None = Query(None, ge=1, le=5),
    db: Session = Depends(get_db),
):
    q = select(Product).options(joinedload(Product.bank), joinedload(Product.category))
    if category:
        q = q.where(Product.category.has(Category.slug == category))
    if bank:
        q = q.where(Product.bank.has(Bank.slug == bank))
    if currency:
        q = q.where(Product.currency == currency)
    if amount is not None:
        q = q.where(Product.min_amount <= amount).where(
            or_(Product.max_amount.is_(None), Product.max_amount >= amount)
        )
    if term_days is not None:
        # Vadesiz ürünler (iki uç da boş) her vadeyle eşleşir.
        q = q.where(
            or_(Product.min_term_days.is_(None), Product.min_term_days <= term_days),
            or_(Product.max_term_days.is_(None), Product.max_term_days >= term_days),
        )
    if max_risk is not None:
        q = q.where(Product.risk_level <= max_risk)
    return db.scalars(q.order_by(Product.risk_level, Product.name)).unique().all()


@app.get("/api/compare", response_model=list[ProductDetail])
def compare(slugs: str, db: Session = Depends(get_db)):
    wanted = [s for s in slugs.split(",") if s][:4]
    rows = db.scalars(
        select(Product)
        .options(joinedload(Product.bank), joinedload(Product.category))
        .where(Product.slug.in_(wanted))
    ).unique().all()
    by_slug = {p.slug: p for p in rows}
    return [_detail(by_slug[s]) for s in wanted if s in by_slug]


@app.get("/api/products/{slug}", response_model=ProductDetail)
def get_product(slug: str, db: Session = Depends(get_db)):
    p = db.scalar(
        select(Product)
        .options(joinedload(Product.bank), joinedload(Product.category))
        .where(Product.slug == slug)
    )
    if p is None:
        raise HTTPException(404, "Ürün bulunamadı")
    return _detail(p)
