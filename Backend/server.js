import nlpExtractor from "./services/nlpExtractor.js";
import reportVerifier from "./services/reportVerifier.js";
import bcrypt from "bcryptjs";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

//  Load env
dotenv.config();

//  App init
const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   MONGODB CONNECTION
================================ */
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" MongoDB Error:", err));

/* ===============================
   FIRE REPORT MODEL (ENHANCED)
================================ */
const FireReportSchema = new mongoose.Schema({
  reportText: String,

  reporter: {
    userId: String,
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number], // [lng, lat]
      address: String
    }
  },

  extractedInfo: {
    location: String,
    fireType: String,
    severity: String,
    urgencyScore: Number,
    keywords: [String],
    hasCasualties: Boolean,
    description: String
  },

  verification: {
  status: { type: String, default: "pending" },
  confidence: Number,
  reason: String,            
  similarReportsCount: Number,
  verifiedBy: [String]
},

  geoCluster: {
    clusterId: String,
    nearbyReports: Number
  },

  status: { type: String, default: "active" },
  timestamp: { type: Date, default: Date.now }
});

FireReportSchema.index({ "reporter.location": "2dsphere" });

const FireReport = mongoose.model("FireReport", FireReportSchema);

/* ===============================
   CHAT CONVERSATION MODEL
================================ */
const ChatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  userId: { type: String, default: "anonymous" },

  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", ChatSchema);

/* ===============================
   USER MODEL
================================ */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
    phone: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true },
  

  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

/* ===============================
   ROOT CHECK
================================ */
app.get("/", (req, res) => {
  res.send(" FireVision Backend is running on port 5000");
});


/* ===============================
   GEMINI CHATBOT API (SAVE CHAT TO DB)
================================ */
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;

    //  Validation
    if (!message || !sessionId) {
      return res.status(400).json({
        reply: "Missing message or sessionId"
      });
    }

    //  Call Gemini
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
                  text: `You are FireVision AI, a fire safety expert.\n\nQuestion: ${message}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response.";

    //  SAVE CHAT TO MONGODB
    let chat = await Chat.findOne({ sessionId });

    if (!chat) {
      chat = new Chat({
        sessionId,
        userId: userId || "anonymous",
        messages: []
      });
    }

    chat.messages.push(
      { role: "user", text: message },
      { role: "assistant", text: reply }
    );

    chat.updatedAt = new Date();
    await chat.save();

    res.json({ reply });

  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({
      reply: "An error occurred. Please try again later."
    });
  }
});

/* ===============================
   LOCATION NAME (REVERSE GEOCODING)
================================ */
async function getLocationName(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "FireVisionApp/1.0 (contact: admin@firevision.com)"
        }
      }
    );

    const data = await res.json();
    const address = data.address || {};

    const area =
      address.suburb ||
      address.neighbourhood ||
      address.village ||
      address.hamlet ||
      "Area";

    const city =
      address.city ||
      address.town ||
      address.district ||
      address.state_district ||
      "";

    return `${area}${city ? ", " + city : ""}`;

  } catch (err) {
    console.error("Location fetch failed:", err.message);
    return "Nearby area";
  }
}
function cleanGeminiJSON(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

/* ===============================
   GEMINI NLP EXTRACTION SERVICE (FIXED)
================================ */
async function extractFireInfoWithGemini(reportText, gpsLocation) {
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
Analyze this fire report and respond ONLY in JSON.

Report: "${reportText}"

JSON:
{
  "fireType": "wildfire|building|vehicle|industrial|electrical|unknown",
  "severity": "low|moderate|high|critical",
  "confidence": 0-100,
  "urgencyScore": 0-10,
  "hasCasualties": true or false,
  "reason": "short explanation"
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
    console.log(" Gemini RAW:", JSON.stringify(data, null, 2));

    const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts
  ?.map(p => p.text)
  .join("\n");

if (!text || text.trim().length === 0) {
  throw new Error("Gemini returned empty or blocked response");
}

    const cleaned = cleanGeminiJSON(text);
    const parsed = JSON.parse(cleaned);

    //  MERGE LOCATION HERE
    return {
      location: await getLocationName(
        gpsLocation.latitude,
        gpsLocation.longitude
      ),
      ...parsed
    };

  } catch (err) {
    console.error(" Gemini Error:", err.message);

    //  SAFE FALLBACK (NEVER NULL)
    return {
      location: await getLocationName(
        gpsLocation.latitude,
        gpsLocation.longitude
      ),
      fireType: "building",
      severity: "moderate",
      confidence: 60,
      urgencyScore: 6,
      hasCasualties:
        reportText.toLowerCase().includes("injured") ||
        reportText.toLowerCase().includes("trapped"),
      reason: "Fallback used due to Gemini error"
    };
  }
}


/* ===============================
   RULE-BASED FALLBACK EXTRACTION
================================ */
async function extractFireInfoRuleBased(text, gpsLocation) {
  const lower = text.toLowerCase();

  return {
    location: await getLocationName(
      gpsLocation.latitude,
      gpsLocation.longitude
    ),
    fireType: "unknown",
    keywords: lower.split(" ").filter(w => w.length > 3).slice(0, 6),
    hasCasualties:
      lower.includes("injured") ||
      lower.includes("trapped") ||
      lower.includes("casualt"),
    description: text.slice(0, 120)
  };
}


/* ===============================
   REPORT VERIFICATION LOGIC
================================ */
function verifyReport(extractedInfo, nearbyReports, totalNearbyCount) {

  if (!extractedInfo) {
    return {
      status: "pending",
      confidence: 0.5,
      reason: "AI extraction failed",
      similarReportsCount: totalNearbyCount,
      verifiedBy: []
    };
  }

  if (
    typeof extractedInfo.confidence !== "number" ||
    extractedInfo.severity === null
  ) {
    return {
      status: "pending",
      confidence: 0.5,
      reason: "Awaiting AI analysis",
      similarReportsCount: totalNearbyCount,
      verifiedBy: []
    };
  }

  return {
    status:
      extractedInfo.severity === "critical" ||
      extractedInfo.hasCasualties
        ? "verified"
        : "pending",

    confidence: extractedInfo.confidence / 100,
    reason: extractedInfo.reason,
    similarReportsCount: totalNearbyCount,
    verifiedBy: []
  };
}

/* ===============================
   CLUSTER ASSIGNMENT LOGIC
================================ */
function assignCluster(newLocation, nearbyReports) {
  const EPSILON_KM = 0.5; // 500 meters

  if (nearbyReports.length === 0) {
    return `cluster_${newLocation.latitude.toFixed(4)}_${newLocation.longitude.toFixed(4)}`;
  }

  // Find closest report
  let minDistance = Infinity;
  let closestCluster = null;

  nearbyReports.forEach(report => {
    const coords = report.reporter.location.coordinates;
    // Simple distance calculation (Haversine would be more accurate)
    const latDiff = Math.abs(newLocation.latitude - coords[1]);
    const lonDiff = Math.abs(newLocation.longitude - coords[0]);
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // Convert to km

    if (distance < minDistance && distance < EPSILON_KM) {
      minDistance = distance;
      closestCluster = report.geoCluster?.clusterId;
    }
  });

  return closestCluster || `cluster_${newLocation.latitude.toFixed(4)}_${newLocation.longitude.toFixed(4)}`;
}

/* ===============================
   SUBMIT FIRE REPORT (ENHANCED)
================================ */
app.post("/api/reports/submit", async (req, res) => {
  try {
    const { reportText, gpsLocation, userId } = req.body;

    if (!reportText || !gpsLocation) {
      return res.status(400).json({ 
        success: false, 
        error: "Report text and GPS location are required" 
      });
    }

    console.log(" Processing report:", reportText.substring(0, 50) + "...");

    // Step 1: Extract information using OpenAI (with fallback)
    let extractedInfo;

try {
  extractedInfo = await nlpExtractor.extractFireInfo(reportText, gpsLocation);
  const placeName = await getLocationName(
  gpsLocation.latitude,
  gpsLocation.longitude
);

extractedInfo.location = placeName;


} catch (err) {
  console.error("Gemini failed, using fallback");
  extractedInfo = await extractFireInfoRuleBased(reportText, gpsLocation);
}

    
    console.log(" Extracted:", extractedInfo);

    // Step 2: Find nearby reports (within 2km, last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const nearbyReports = await FireReport.find({
      "reporter.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [gpsLocation.longitude, gpsLocation.latitude]
          },
          $maxDistance: 2000 // 2km in meters
        }
      },
      timestamp: { $gte: oneDayAgo },
      status: "active"
    }).limit(10);
    const EARTH_RADIUS_KM = 6378.1;
const radiusInKm = 2; // 2 km
const radiusInRadians = radiusInKm / EARTH_RADIUS_KM;

const totalNearbyCount = await FireReport.countDocuments({
  "reporter.location": {
    $geoWithin: {
      $centerSphere: [
        [gpsLocation.longitude, gpsLocation.latitude],
        radiusInRadians
      ]
    }
  },
  timestamp: { $gte: oneDayAgo },
  status: "active"
});

    console.log(` Found ${nearbyReports.length} nearby reports`);

    // Step 3: Verify report
    const verification = reportVerifier.verifyReport(
  extractedInfo,
  nearbyReports
);

    console.log(" Verification:", verification);

    // Step 4: Assign cluster
    const clusterId = assignCluster(gpsLocation, nearbyReports);

    // Step 5: Save to database
    const report = new FireReport({
      reportText,
      reporter: {
        userId: userId || "anonymous",
        location: {
          type: "Point",
          coordinates: [gpsLocation.longitude, gpsLocation.latitude],
          address: gpsLocation.address || "Unknown address"
        }
      },
      extractedInfo,
      verification,
      geoCluster: {
        clusterId,
        nearbyReports: nearbyReports.length
      },
      status: "active"
    });

    await report.save();
    console.log(" Report saved to database");

    res.status(201).json({ 
      success: true, 
      reportId: report._id,
      extractedInfo,
      verification,
      message: "Report submitted successfully"
    });

  } catch (err) {
    console.error(" Report Submit Error:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

/* ===============================
   GET ACTIVE REPORTS (MAP)
================================ */
app.get("/api/reports/active", async (req, res) => {
  try {
    const { ne_lat, ne_lon, sw_lat, sw_lon } = req.query;

    let query = {
      status: "active",
      "verification.status": { $in: ["verified", "pending"] }
    };

    // If bounds provided, filter by them
    if (ne_lat && ne_lon && sw_lat && sw_lon) {
      query["reporter.location"] = {
        $geoWithin: {
          $box: [
            [parseFloat(sw_lon), parseFloat(sw_lat)],
            [parseFloat(ne_lon), parseFloat(ne_lat)]
          ]
        }
      };
    }

    const reports = await FireReport.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({ 
      success: true, 
      reports,
      count: reports.length 
    });

  } catch (error) {
    console.error(" Get reports error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/* ===============================
   GET REPORT BY ID
================================ */
app.get("/api/reports/:id", async (req, res) => {
  try {
    const report = await FireReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found"
      });
    }

    res.json({
      success: true,
      report
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* ===============================
   UPDATE REPORT STATUS
================================ */
app.patch("/api/reports/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    
    const report = await FireReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      report
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* ===============================
   REGISTER API
================================ */
app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("REGISTER REQ BODY =>", req.body);
    const { name, email, phone, password } = req.body;


    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
  $or: [{ email }, { phone }]
});

    if (existingUser) {
  return res.status(400).json({
    success: false,
    message: "User already exists with this email or phone number"
  });
}

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,    
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===============================
   START SERVER
================================ */
app.listen(5000, () => {
  console.log(" Backend running on port 5000");
  console.log(" Gemini Key:", process.env.GEMINI_KEY ? " YES" : " NO");
  console.log(" OpenAI Key:", process.env.OPENAI_API_KEY ? " YES" : " NO");
  console.log(" MongoDB:", process.env.MONGODB_URL ? " CONNECTED" : " MISSING");
});