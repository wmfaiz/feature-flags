require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

const featureSchema = new mongoose.Schema({
    key: {type: String, required: true, unique: true},
    description: String,
    defaultState: { type: Boolean, default: false },
    region: String,
    overrides: [{
        type: { type: String, enum: ['user', 'group', 'region'], required: true },
        id: { type: String, required: true },
        state: { type: Boolean, required: true }
    }]
});
const Feature = mongoose.model("Feature", featureSchema);

app.get("/api/features", async (req, res) => {
  const features = await Feature.find();
  res.json(features);
});

app.post("/api/features", async (req, res) => {
  try {
    const feature = new Feature(req.body);
    await feature.save();
    res.json(feature);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/features/:key/evaluate", async (req, res) => {
  const { key } = req.params;
  const { userId, groupId, region } = req.query;
  const feature = await Feature.findOne({ key });
  if (!feature) return res.status(404).json({ message: "Feature not found" });

  let enabled = feature.defaultState;

  const userOverride = feature.overrides.find(o => o.type === 'user' && o.id === userId);
  if (userOverride) {
    enabled = userOverride.state;
  } else {
    const groupOverride = feature.overrides.find(o => o.type === 'group' && o.id === groupId);
    if (groupOverride) {
      enabled = groupOverride.state;
    } else {
      const regionOverride = feature.overrides.find(o => o.type === 'region' && o.id === region);
      if (regionOverride) {
        enabled = regionOverride.state;
      }
    }
  }

  res.json({ enabled, feature });
});

app.post("/api/features/:key/overrides", async (req, res) => {
  const { key } = req.params;
  const { type, id, state } = req.body;
  const feature = await Feature.findOne({ key });
  if (!feature) return res.status(404).json({ message: "Feature not found" });

  const existing = feature.overrides.find(o => o.type === type && o.id === id);
  if (existing) {
    return res.status(400).json({ message: "Override already exists" });
  }

  feature.overrides.push({ type, id, state });
  await feature.save();
  res.json(feature);
});

app.put("/api/features/:key/overrides", async (req, res) => {
  const { key } = req.params;
  const { type, id, state } = req.body;
  const feature = await Feature.findOne({ key });
  if (!feature) return res.status(404).json({ message: "Feature not found" });

  const override = feature.overrides.find(o => o.type === type && o.id === id);
  if (!override) {
    return res.status(404).json({ message: "Override not found" });
  }

  override.state = state;
  await feature.save();
  res.json(feature);
});

app.delete("/api/features/:key/overrides", async (req, res) => {
  const { key } = req.params;
  const { type, id } = req.query;
  const feature = await Feature.findOne({ key });
  if (!feature) return res.status(404).json({ message: "Feature not found" });

  feature.overrides = feature.overrides.filter(o => !(o.type === type && o.id === id));
  await feature.save();
  res.json(feature);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));