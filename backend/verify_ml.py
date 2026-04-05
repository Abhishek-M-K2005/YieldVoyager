import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from defi.models import Protocol
from risk_engine.services.scoring import compute_and_store_risk
import math

print("Django setup complete. Running prediction test...")

protocol = Protocol.objects.first()
if not protocol:
    print("Creating mock protocol")
    protocol = Protocol.objects.create(name="TestProtocol", slug="test-protocol")

tvl_val = 5000000

features = {
    "tvl_change_24h": -2.5, 
    "tvl_change_7d": 1.2,
    "tvl_change_3d": -0.5,
    "tvl_momentum": -0.1,
    "log_liquidity_depth": math.log(tvl_val),
    "vol_ratio": 1.1,
    "utilisation_ratio": 0.65,
    "oracle_price_std": 0.02,
    "liquidation_spike_ratio": 0.1,
    "audit_count": 1,
    "listed_at_timestamp": 1640995200
}

try:
    result = compute_and_store_risk(protocol, features)
    print("✅ Inference Successful!")
    print("Result:")
    for k, v in result.items():
        if isinstance(v, dict):
            print(f"  {k}:")
            for sub_k, sub_v in v.items():
                print(f"    {sub_k}: {sub_v}")
        else:
            print(f"  {k}: {v}")
except Exception as e:
    import traceback
    print("❌ Inference Failed!")
    traceback.print_exc()
