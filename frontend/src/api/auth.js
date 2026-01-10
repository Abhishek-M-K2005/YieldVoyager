const API = "http://localhost:8000/api/auth";

export const getNonce = async (address) => {
  const res = await fetch(`${API}/nonce/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address })
  });
  return res.json();
};

export const verifySignature = async (address, signature) => {
  const res = await fetch(`${API}/verify/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature })
  });
  return res.json();
};
