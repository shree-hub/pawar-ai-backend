import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Pawar AI backend is running ✅");
});

// Chat API route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required." });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI did not return a response.";

    res.json({ reply });
  } catch (error) {
    console.error("Backend error:", error);
    res
      .status(500)
      .json({ reply: "⚠️ AI is busy or quota exhausted. Please try again later." });
  }
});

// Render port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Pawar AI backend running on port ${PORT}`);
});
