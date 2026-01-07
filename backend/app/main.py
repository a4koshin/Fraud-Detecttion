from transformer import transform_input
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import TransactionInput
from dotenv import load_dotenv
import joblib
import os
import sys

# --------------------------------------------------
# Setup paths
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# --------------------------------------------------
# Imports AFTER path fix
# --------------------------------------------------

# --------------------------------------------------
# Load env
# --------------------------------------------------
load_dotenv()

app = FastAPI(title="Fraud Detection API")

# --------------------------------------------------
# CORS (DEV)
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Load model bundle ONCE
# --------------------------------------------------
MODEL_PATH = os.path.join(BASE_DIR, "fraud_model_rf_high_recall.pkl")

bundle = joblib.load(MODEL_PATH)
model = bundle["model"]
THRESHOLD = bundle["threshold"]  # 0.05

# --------------------------------------------------
# Health check
# --------------------------------------------------


@app.get("/")
def root():
    return {"status": "Fraud Detection server is running"}

# --------------------------------------------------
# Prediction endpoint
# --------------------------------------------------


@app.post("/predict")
def predict_fraud(data: TransactionInput):
    X = transform_input(data.dict())

    prob = model.predict_proba(X)[0][1]

    return {
        "fraud_probability": round(float(prob), 4),
        "is_fraud": int(prob >= THRESHOLD),
        "risk_level": (
            "LOW" if prob < 0.35 else
            "MEDIUM" if prob < 0.7 else
            "HIGH"
        )
    }
