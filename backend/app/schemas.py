from pydantic import BaseModel


class TransactionInput(BaseModel):
    amount: float
    customer_age: float
    hour: int
    transaction_type: str
    merchant_category: str
    card_type: str
    country: str
    device: str
