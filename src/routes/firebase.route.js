import express from "express";
import db from "../firebase.js";
import { ref, get } from "firebase/database";

const router = express.Router();

router.get("/hardware-data", async (req, res) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("Fetched data:", data);
      res.json(data); // Send full data
    } else {
      console.log("No data found.");
      res.status(404).json({ error: "No data found" });
    }
  } catch (error) {
    console.error("Firebase fetch error:", error);
    res.status(500).json({ error: "Failed to fetch hardware data" });
  }
});


export default router;