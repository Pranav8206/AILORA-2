import { useEffect, useState } from "react";

export default function History() {
  const [userId, setUserId] = useState("demo-user");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = 123;
        if (!ignore && res && res.history) setItems(res.history);
      } catch (e) {
        setError(e.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [userId]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold">Prediction History</h2>
      <div className="mb-3 mt-2">
        <label className="text-sm font-medium">
          User ID:{" "}
          <input
            className="border rounded px-3 py-2 ml-2"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-3">
        {items.map((h, idx) => (
          <div key={idx} className="border rounded p-3">
            <div>
              <strong>When:</strong> {new Date(h.timestamp).toLocaleString()}
            </div>
            <div>
              <strong>Symptoms:</strong> {h.symptoms}
            </div>
            <div>
              <strong>Predicted Diseases:</strong>{" "}
              {(h.predicted_diseases || []).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
