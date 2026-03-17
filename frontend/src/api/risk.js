export async function computeRisk(protocolId, metrics) {
    const response = await fetch(
        `http://127.0.0.1:8000/api/risk/protocol/${protocolId}/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(metrics),
        }
    );
    if(!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Risk computation failed");
    }
    return await response.json();
}