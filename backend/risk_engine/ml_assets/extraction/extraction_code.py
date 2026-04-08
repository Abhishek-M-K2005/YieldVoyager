import requests
import pandas as pd
import numpy as np
import time

def build_dataset(protocol_name, protocol_id):
    url = f"https://api.llama.fi/protocol/{protocol_name}"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to fetch {protocol_name}")
        return pd.DataFrame()

    data = response.json()
    rows = []
    listed_at = data.get("listedAt")

    if "chainTvls" not in data:
        return pd.DataFrame()

    for chain in data["chainTvls"]:
        tvl_data = data["chainTvls"][chain].get("tvl", [])
        if len(tvl_data) < 15: # Need enough buffer for past and future windows
            continue

        current_util_ratio = np.random.uniform(0.20, 0.70)

        # Stop 7 days before the end so we have future data to create the label
        for i in range(7, len(tvl_data) - 7):
            latest = tvl_data[i]["totalLiquidityUSD"]
            tvl_24h = tvl_data[i - 1]["totalLiquidityUSD"]
            tvl_7d_past = tvl_data[i - 7]["totalLiquidityUSD"]

            if tvl_7d_past == 0 or tvl_24h == 0 or latest == 0:
                continue

            # Features (Past and Present)
            tvl_change_24h = (latest - tvl_24h) / tvl_24h
            tvl_change_7d = (latest - tvl_7d_past) / tvl_7d_past
            liquidity_depth = latest

            # Simulated Features (Replace with real data later)
            util_noise = np.random.normal(0, 0.02)
            current_util_ratio = max(0.05, min(0.95, current_util_ratio + util_noise))
            utilisation_ratio = current_util_ratio

            base_volatility = np.random.uniform(0.01, 0.05)
            oracle_price_std = base_volatility + (abs(tvl_change_24h) * np.random.uniform(0.5, 1.5))

            liquidation_spike_ratio = abs(tvl_change_24h) * np.random.uniform(2.0, 4.0) if tvl_change_24h < -0.05 else np.random.uniform(0.0, 0.01)

            if listed_at:
                protocol_age_days = int((tvl_data[i]["date"] - listed_at) / 86400)
            else:
                protocol_age_days = int((tvl_data[i]["date"] - tvl_data[0]["date"]) / 86400)

            protocol_age_days = max(1, protocol_age_days)
            audit_count = min(5, 1 + (protocol_age_days // 180))

            # TARGET LABEL (The Future): Did TVL drop by > 20% in the NEXT 7 days?
            # Changed to 20% drop to ensure we have enough positive samples for training
            future_tvl = tvl_data[i + 7]["totalLiquidityUSD"]
            future_tvl_change = (future_tvl - latest) / latest
            instability_label = 1 if future_tvl_change < -0.20 else 0

            rows.append([
                protocol_id, protocol_name, chain, tvl_data[i]["date"],
                tvl_change_24h, tvl_change_7d, liquidity_depth, utilisation_ratio,
                oracle_price_std, liquidation_spike_ratio, protocol_age_days,
                audit_count, instability_label
            ])

    columns = ["protocol_id", "protocol_name", "chain", "date", "tvl_change_24h",
               "tvl_change_7d", "liquidity_depth", "utilisation_ratio", "oracle_price_std",
               "liquidation_spike_ratio", "protocol_age_days", "audit_count", "instability_label"]

    return pd.DataFrame(rows, columns=columns)

# Fetch data strictly for the requested protocols to perfectly mirror the application DB
protocols = [
    "aave", "curve-dex", "makerdao", "compound-finance", "lido", "uniswap",
    "binance", "aave-v3", "bitfinex", "bybit", "ssv-network", "okx",
    "robinhood", "eigencloud", "wbtc", "testprotocol"
]

print(f"Locked extraction to exact {len(protocols)} protocols matching your DB scope...")
all_data = []

print("Fetching historical data for dataset compilation...")
for idx, protocol in enumerate(protocols):
    print(f"Processing {protocol} ({idx+1}/{len(protocols)})...")
    df = build_dataset(protocol, idx)
    all_data.append(df)
    time.sleep(0.5) # Be nice to the API

final_df = pd.concat(all_data, ignore_index=True)
print(f"Dataset compiled! Shape: {final_df.shape}")
print(f"Total instablity events (1s): {final_df['instability_label'].sum()}")

final_df.to_csv('new_yv_data.csv', index=False)