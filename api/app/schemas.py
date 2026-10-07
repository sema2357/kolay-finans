from datetime import datetime

from pydantic import BaseModel, ConfigDict


class _ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class BankOut(_ORM):
    slug: str
    name: str
    website_url: str


class CategoryRef(_ORM):
    slug: str
    name: str
    icon: str


class FlowStep(_ORM):
    title: str
    description: str
    icon: str


class CategoryOut(_ORM):
    slug: str
    name: str
    description: str
    icon: str
    flow_steps: list[FlowStep] = []
    product_count: int = 0


class CategoryDetail(CategoryOut):
    key_risks: list[str] = []


class ProductListItem(_ORM):
    slug: str
    name: str
    summary: str
    bank: BankOut
    category: CategoryRef
    currency: str
    min_amount: float
    max_amount: float | None
    min_term_days: int | None
    max_term_days: int | None
    risk_level: int
    return_type: str
    return_info: str
    verified: bool
    fetched_at: datetime


class ProductDetail(ProductListItem):
    fees: str | None
    features: list[str] = []
    flow_steps: list[FlowStep] = []
    key_risks: list[str] = []
    source_label: str
    source_url: str
    official_url: str
