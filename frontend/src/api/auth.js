const API_BASE = "http://127.0.0.1:8000/api/auth";

export async function getNonce(address) {
  const response = await fetch(`${API_BASE}/nonce/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch nonce");
  }

  return response.json();
}

export async function verifySignature(address, signature) {
  const response = await fetch(`${API_BASE}/verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, signature }),
  });

  if (!response.ok) {
    throw new Error("Signature verification failed");
  }

  return response.json();
}

const API_ENDPOINT = "http://127.0.0.1:8000/api";

export async function getProfile(token) {
  const response = await fetch(`${API_ENDPOINT}/auth/profile/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}

export async function updateProfile(token, data) {
  const response = await fetch(`${API_ENDPOINT}/auth/profile/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}
