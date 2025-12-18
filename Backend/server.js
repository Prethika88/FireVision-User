import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   ROOT CHECK
   =============================== */
app.get("/", (req, res) => {
  res.send(" FireVision Backend is running on port 5000");
});

/* ===============================
   CHAT API - USING GEMINI 2.5 FLASH
   =============================== */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log(" User Message:", message);

    //  Using gemini-2.5-flash 
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  text: `You are FireVision AI, a fire safety expert assistant. Provide clear, concise, and complete answers about fire safety. If the answer is long, prioritize the most important information first.\n\nQuestion: ${message}` 
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log(" GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.json({
        reply: ` Gemini Error: ${data.error.message}`
      });
    }

    // Check if response was blocked by safety filters
    if (data?.candidates?.[0]?.finishReason === "SAFETY") {
      return res.json({
        reply: " Response was blocked by safety filters. Please try rephrasing your question."
      });
    }

    // Check for other finish reasons
    if (data?.candidates?.[0]?.finishReason === "MAX_TOKENS") {
      const partialText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return res.json({
        reply: partialText + "\n\n (Response was truncated due to length. Please ask for specific details or break down your question into smaller parts.)"
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      " Gemini returned no text.";

    res.json({ reply });

  } catch (error) {
    console.error(" ERROR:", error);
    res.json({ reply: " Backend error occurred" });
  }
});

/* ===============================
   START SERVER
   =============================== */
app.listen(5000, () => {
  console.log(" Backend running on port 5000");
  console.log(" API Key configured:", process.env.GEMINI_KEY ? "YES" : "NO");
  console.log(" Using model: gemini-2.5-flash");
});