import numpy as np
import pandas as pd


def transform_input(payload: dict) -> pd.DataFrame:
    df = pd.DataFrame([payload])

    df["amount_log"] = np.log1p(df["amount"])
    df["is_night"] = df["hour"].between(0, 5).astype(int)
    df["is_cross_border"] = (df["country"] != "somalia").astype(int)
    df["is_web"] = (df["device"] == "web").astype(int)

    df["age_bucket"] = pd.cut(
        df["customer_age"],
        bins=[18, 30, 45, 60, 90],
        labels=["18-30", "31-45", "46-60", "60+"]
    )

    df = pd.get_dummies(
        df,
        columns=["transaction_type", "merchant_category",
                 "card_type", "age_bucket"]
    )

    MODEL_COLUMNS = [
        "amount_log", "is_night", "is_cross_border", "is_web",
        "transaction_type_purchase", "transaction_type_transfer",
        "merchant_category_grocery", "merchant_category_telecom",
        "merchant_category_travel", "merchant_category_unknown",
        "card_type_debit",
        "age_bucket_31-45", "age_bucket_46-60", "age_bucket_60+"
    ]

    for col in MODEL_COLUMNS:
        if col not in df:
            df[col] = 0

    return df[MODEL_COLUMNS]
