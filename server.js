const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3007;
const HOST = "0.0.0.0";
const ATLAS_URI = process.env.MONGODB_URI || ""; // e.g. mongodb+srv://...
const LOCAL_URI = "mongodb://127.0.0.1:27017/prime_time";

let dbConnected = false;
let progressCache = {};
let ProgressModel = null;
mongoose.set("sanitizeFilter", true);

function normalizeSaveKey(rawKey) {
  if (typeof rawKey !== "string") return null;
  const key = rawKey.trim();
  if (!key || key.length > 100) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) return null;
  return key;
}

async function connectToMongoWithFallback() {
  let triedLocal = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    let uri = (!triedLocal && ATLAS_URI) ? ATLAS_URI : LOCAL_URI;
    if (uri === LOCAL_URI) triedLocal = true;
    try {
      console.log(`[DB] Attempting connect to: ${uri}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 7000,
        socketTimeoutMS: 10000,
        tls: uri !== LOCAL_URI
      });
      dbConnected = true;
      console.log(`[DB] Connected to: ${uri}`);
      ProgressModel = mongoose.models.Progress || mongoose.model(
        "Progress",
        new mongoose.Schema(
          {
            saveKey: { type: String, required: true, unique: true },
            data: { type: Object, required: true }
          },
          { timestamps: true }
        )
      );
      return;
    } catch (err) {
      dbConnected = false;
      console.warn(`[DB] Failed connect (attempt ${attempt}) to ${uri}: ${err.message}`);
      if (attempt === 3 && !dbConnected) {
        console.warn(`[DB] All attempts failed. Running in NO-DB mode.`);
      }
    }
  }
}

// INIT
app.use(express.json());
const progressLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});
const frontendLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url} @ ${new Date().toISOString()}`);
  next();
});

// ===== HEALTH =====
app.get("/health", (req, res) => {
  res.json({ status: "ok", db: dbConnected ? "connected" : "disconnected" });
});

// ===== API ROUTES =====

// /api/progress/save
app.post("/api/progress/save", progressLimiter, async (req, res) => {
  const key = normalizeSaveKey(req.body.saveKey ?? "default");
  if (!key) return res.status(400).json({ ok: false, error: "Invalid 'saveKey'" });
  const data = req.body.data;
  if (!data) return res.status(400).json({ ok: false, error: "Missing 'data' field" });
  if (dbConnected && ProgressModel) {
    try {
      await ProgressModel.findOneAndUpdate(
        { saveKey: { $eq: key } },
        { $set: { saveKey: key, data } },
        { upsert: true }
      );
      console.log(`[PROGRESS][DB] Saved for ${key}`);
      res.json({ ok: true, db: true });
      return;
    } catch (e) {
      console.warn(`[PROGRESS][DB] ERROR for saveKey ${key}: ${e.message}`);
      res.status(500).json({ ok: false, db: true, error: e.message });
      return;
    }
  } else {
    progressCache[key] = data;
    console.log(`[PROGRESS][MEM] Saved for ${key} (NO DB)`);
    res.json({ ok: true, db: false });
  }
});

// /api/progress/load
app.get("/api/progress/load", progressLimiter, async (req, res) => {
  const key = normalizeSaveKey(req.query.saveKey ?? "default");
  if (!key) return res.status(400).json({ ok: false, error: "Invalid 'saveKey'" });
  if (dbConnected && ProgressModel) {
    try {
      const rec = await ProgressModel.findOne({ saveKey: { $eq: key } });
      if (rec) {
        console.log(`[PROGRESS][DB] Loaded for ${key}`);
        res.json({ ok: true, data: rec.data, db: true });
        return;
      } else {
        res.json({ ok: false, error: "Not found", db: true });
        return;
      }
    } catch (e) {
      console.warn(`[PROGRESS][DB] ERROR for load ${key}: ${e.message}`);
      res.status(500).json({ ok: false, db: true, error: e.message });
      return;
    }
  } else {
    if (progressCache[key]) {
      console.log(`[PROGRESS][MEM] Loaded for ${key}`);
      res.json({ ok: true, data: progressCache[key], db: false });
    } else {
      res.json({ ok: false, db: false, error: "Not found" });
    }
  }
});

// ===== FRONTEND SERVE =====
const clientBuildDir = path.join(__dirname, "client/build");
const distDir = path.join(__dirname, "dist");
const frontendDir = fs.existsSync(clientBuildDir)
  ? clientBuildDir
  : fs.existsSync(distDir)
    ? distDir
    : null;

if (frontendDir) {
  app.use(express.static(frontendDir));
} else {
  console.warn("[FRONTEND] No build directory found at client/build or dist");
}

app.get("*", frontendLimiter, (req, res) => {
  if (!frontendDir) {
    res.status(404).send("Frontend build not found");
    return;
  }
  res.sendFile(path.join(frontendDir, "index.html"));
});

// ====== LAUNCH ======
connectToMongoWithFallback().finally(() => app.listen(PORT, HOST, async () => {
  console.log(`\n🚀 Server running at http://${HOST}:${PORT}/`);
  console.log(`[DB] Status on startup: ${dbConnected ? "connected" : "disconnected (NO-DB mode)"}`);
}));

process.on("SIGINT", async () => {
  if (dbConnected) {
    await mongoose.disconnect();
    console.log("[SIGINT] Mongo disconnected");
  }
  process.exit(0);
});
process.on("SIGTERM", async () => {
  if (dbConnected) {
    await mongoose.disconnect();
    console.log("[SIGTERM] Mongo disconnected");
  }
  process.exit(0);
});
