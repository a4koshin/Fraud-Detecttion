from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from app.schemas import TransactionInput
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI(title="Fraud Detection API")
FRONTEND_URL = os.getenv("FRONTEND_URL")

origins = [origin.strip() for origin in FRONTEND_URL.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pipeline
model = joblib.load("fraud_pipeline.pkl")

THRESHOLD = 0.35


@app.get("/")
def root():
    return {"status": "Fraud Detection API running"}


@app.post("/predict")
def predict_fraud(data: TransactionInput):
    input_df = pd.DataFrame([{
        "amount": data.amount,
        "customer_age": data.customer_age,
        "hour": data.hour,
        "transaction_type": data.transaction_type,
        "merchant_category": data.merchant_category,
        "card_type": data.card_type,
        "country": data.country,
        "device": data.device,
    }])

    prob = model.predict_proba(input_df)[0][1]

    return {
        "fraud_probability": round(float(prob), 4),
        "is_fraud": int(prob >= THRESHOLD),
        "risk_level": (
            "LOW" if prob < 0.35 else
            "MEDIUM" if prob < 0.7 else
            "HIGH"
        )
    }
