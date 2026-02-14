import pandas as pd
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

FEATURE = [
    "tvl_change_24h",
    "tvl_change_7d",
    "liquidity_depth",
    "utilisation_ratio",
    "oracle_price_std",
    "liquidation_spike_ratio",
    "protocol_age_days",
    "audit_count",
]

df = pd.read_csv("defi_risk_dataset.csv")
X = df[FEATURE]
y = df["instability_label"]

X_train, y_train, X_test, y_test = train_test_split(X, y, test_size = 0.2, random_state=42)

model = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print(classification_report(y_test, preds))

joblib.dump(model, "risk_xgb_model.pkl")
print("model saved successfully")

