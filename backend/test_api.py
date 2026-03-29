import sys
import json
from rest_framework.test import APIRequestFactory
from defi.models import Protocol, Vault
from risk_engine.views import ProtocolRiskView

print('Creating test data...')
try:
    p, _ = Protocol.objects.get_or_create(name="TestProtocol", defaults={"chain": "Ethereum", "risk_level": "medium"})
    v, _ = Vault.objects.get_or_create(protocol=p, asset="ETH", defaults={"apy": 5.0, "tvl": 1000000})

    factory = APIRequestFactory()
    request = factory.post(f'/api/risk/protocol/{p.id}/', {"wallet_address": "0x123", "wallet_balance": "10.5"}, format='json')

    view = ProtocolRiskView.as_view()
    response = view(request, protocol_id=p.id)

    print("Status:", response.status_code)
    print("Response Data:", json.dumps(response.data, indent=2))
except Exception as e:
    print("Error:", e)
    import traceback
    traceback.print_exc()
