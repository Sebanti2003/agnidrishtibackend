/*import express from "express";
import db from "../firebase.js";

const router = express.Router();

router.get("/hardware-data", async (req, res) => {
  try {
    const ref = db.ref("devices"); // adjust path if needed
    ref.once("value", (snapshot) => {
      const data = snapshot.val();
      res.json(data || {});
    });
  } catch (error) {
    console.error("Firebase fetch error:", error);
    res.status(500).json({ error: "Failed to fetch hardware data" });
  }
});

export default router;*/
