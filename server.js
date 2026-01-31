import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Test route
app.get("/", (req, res) => {
  res.send("Pawar AI backend is running ✅");
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No message received" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini response:", data);

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    res.json({ reply });
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: "AI connection failed" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
