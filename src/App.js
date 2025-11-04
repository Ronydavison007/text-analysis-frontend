import React, { useState } from "react";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return alert("Please enter some text!");

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("https://rondavd.app.n8n.cloud/webhook/analyse-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await res.json();
      console.log("Raw n8n Response:", data);

      setResponse(data);
    } catch (err) {
      console.error("Error fetching from n8n:", err);
      setResponse({ error: "⚠️ Unable to connect to backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          🧠 Text Summarization App
        </h1>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring focus:ring-blue-300"
            placeholder="Enter your text to summarize..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg mt-3 hover:bg-blue-700 transition"
          >
            {loading ? "Processing..." : "Summarize Text"}
          </button>
        </form>

        {response && (
          <div className="mt-5 border-t pt-4">
            {response.error ? (
              <p className="text-red-500">{response.error}</p>
            ) : (
              <>
                <h2 className="font-semibold text-gray-700 mb-2">
                  Summary Result:
                </h2>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {response.summary}
                </p>

                <div className="mt-3 text-sm text-gray-500">
                  <p>
                    <strong>Success:</strong> {response.success ? "✅ True" : "❌ False"}
                  </p>
                  <p>
                    <strong>Original Text:</strong> {response.original_text}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <footer className="mt-6 text-sm text-gray-400">
        Built with ❤️ using n8n + Hugging Face
      </footer>
    </div>
  );
}
