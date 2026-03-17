// src/pages/RiskPrediction.js
import React, { useState } from 'react';

export default function RiskPrediction() {
  const [result, setResult] = useState(null);

  // This connects to backend
  const handleAnalyze = async () => {
    // You will update this URL later 
    const response = await fetch("http://localhost:8000/api/predict/"); 
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      {/*  make this look like a real UI later */}
      <h1>Risk Prediction Engine</h1>
      <button onClick={handleAnalyze}>Run ML Analysis</button>

      {result && (
        <div>
          <p>Risk Score: {result.score}</p>
          <p>AI Advice: {result.ai_summary}</p>
        </div>
      )}
    </div>
  );
}