import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
  area: { type: String, required: true, index: true }, // Indexing area might be useful
}, { _id: false });

const fireIncidentSchema = new Schema(
  {
    // We'll use the incidentId as our unique identifier
    // Let's use incidentId for our unique identifier and let MongoDB handle _id.
    incidentId: { type: String, required: true, unique: true, index: true },
    location: { type: locationSchema, required: true },
    severity: {
      type: String,
      enum: ["critical", "high", "medium", "low", "controlled"],
      required: true,
    },
    reportTime: { type: Date, required: true, default: Date.now },
    source: {
      type: String,
      enum: ["sensor", "crowdsourced", "emergency-services"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "responding", "contained", "extinguished"],
      required: true,
      default: "active",
      index: true, // Indexing status might be useful
    },
    temperature: { type: Number }, // From sensor
    smokeLevel: { type: Number }, // Add if your sensor provides this
    humidity: { type: String }, // Add if your sensor provides this
    flamedetected: { type: Boolean }, // Add if your sensor provides this
    reportedBy: { type: String }, // For crowdsourced/emergency
    details: { type: String },
    evacuationStatus: { type: String },
    respondingUnits: [{ type: String }],
    verifiedReports: { type: Number, default: 0 },
    lastUpdateTime: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Update lastUpdateTime whenever the document is updated via save()
fireIncidentSchema.pre('save', function(next) {
  this.lastUpdateTime = new Date();
  next();
});

export const FireIncident = mongoose.model("FireIncident", fireIncidentSchema);
