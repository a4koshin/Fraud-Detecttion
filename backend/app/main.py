from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from app.schemas import TransactionInput

app = FastAPI(title="Fraud Detection API")

# ✅ CORS MUST BE HERE (BEFORE ROUTES)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
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
