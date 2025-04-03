import { useState, useEffect } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [salesReps, setSalesReps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setSalesReps(data.salesReps || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleAskQuestion = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer || "No answer received.");
    } catch (error) {
      console.error("Error in AI request:", error);
      setAnswer("Error while fetching AI response.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sales Representatives Dashboard</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h1>Next.js + FastAPI Sample</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div>
            {salesReps.map((rep) => (
              <div key={rep.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
                <h3>
                  {rep.name} ({rep.role})
                </h3>
                <p>Region: {rep.region}</p>
                <h4>Skills:</h4>
                <ul>
                  {rep.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>

                <div>
                  <h4>Deals:</h4>
                  <ul>
                    {rep.deals.map((deal, index) => (
                      <li key={index}>
                        Client: {deal.client}, Value: ${deal.value}, Status: {deal.status}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>Clients:</h4>
                  <ul>
                    {rep.clients.map((client, index) => (
                      <li key={index}>
                        {client.name} ({client.industry}) - Contact: {client.contact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Ask a Question (AI Endpoint)</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Input and button container */}
          <div>
            <input
              type="text"
              placeholder="Enter your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{
                padding: "0.8rem",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                width: "100%",
                boxSizing: "border-box",
                marginBottom: "1rem",
              }}
            />
            <button
              onClick={handleAskQuestion}
              disabled={loading}
              style={{
                backgroundColor: "#007BFF",
                color: "white",
                padding: "0.8rem 1.5rem",
                fontSize: "1rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
                boxSizing: "border-box",
                transition: "background-color 0.3s",
              }}
            >
              {loading ? "Loading..." : "Ask"}
            </button>
          </div>

          {/* Display AI response */}
          {answer && (
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f7f7f7", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
              <strong style={{ fontSize: "1.1rem" }}>AI Response:</strong>
              <p style={{ marginTop: "0.5rem", fontSize: "1rem", color: "#333" }}>{answer}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
