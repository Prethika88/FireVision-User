// Backend/services/nlpExtractor.js
import fetch from "node-fetch";

class FireReportNLP {
  async extractFireInfo(reportText, gpsLocation) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
Analyze this fire report and respond ONLY in valid JSON.

Report: "${reportText}"
GPS: ${gpsLocation.latitude}, ${gpsLocation.longitude}

JSON:
{
  "location": "specific place",
  "fireType": "wildfire|building|vehicle|industrial|electrical|unknown",
  "severity": "low|moderate|high|critical",
  "urgencyScore": 0-10,
  "keywords": ["fire", "smoke"],
  "hasCasualties": true or false,
  "description": "short summary"
}
`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("Empty Gemini response");

      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const extracted = JSON.parse(cleaned);

      return {
        location: extracted.location || "Unknown",
        fireType: extracted.fireType || "unknown",
        severity: extracted.severity || "moderate",
        urgencyScore: extracted.urgencyScore || 5,
        keywords: extracted.keywords || ["fire"],
        hasCasualties: extracted.hasCasualties || false,
        description:
          extracted.description || reportText.slice(0, 100)
      };
    } catch (err) {
      console.error("Gemini NLP Error:", err.message);

      return {
        location: "Unknown",
        fireType: "unknown",
        severity: "moderate",
        urgencyScore: 5,
        keywords: ["fire"],
        hasCasualties: false,
        description: reportText.slice(0, 100)
      };
    }
  }
}

export default new FireReportNLP();
