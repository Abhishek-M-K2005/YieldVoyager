// src/pages/MarketToday.jsx
import React, { useState, useEffect } from 'react';

export default function MarketToday() {
  // This holds the list of vaults. It starts empty.
  const [vaults, setVaults] = useState([]);

  // This runs once when the page opens to fetch the data
  useEffect(() => {
    // Replace this URL when you have the real one
    fetch("http://localhost:8000/api/defi/vaults/")
      .then(res => res.json())
      .then(data => setVaults(data))
      .catch(err => console.error("Failed to fetch market data", err));
  }, []);

  return (
    <div>
      {/* UI structure */}
      <h1>Market Today</h1>
      <p>Current Yield Opportunities</p>

      {/* Renders the raw data if it exists, or a loading message */}
      <div>
        {vaults.length > 0 ? (
          vaults.map((vault, index) => (
            <div key={index}>
              <p>Protocol: {vault.protocol}</p>
              <p>Asset: {vault.asset}</p>
              <p>APY: {vault.apy}%</p>
              <hr />
            </div>
          ))
        ) : (
          <p>Loading market data...</p>
        )}
      </div>
    </div>
  );
}