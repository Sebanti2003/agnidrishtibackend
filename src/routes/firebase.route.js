import express from "express";
import db from "../firebase.js";
import { ref, get } from "firebase/database";
import { io } from "../index.js";

const router = express.Router();

setInterval(async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      io.emit("hardware-data", data); 
    }
  } catch (error) {
    console.error("Firebase fetch error:", error);
  }
}, 5000);

router.get("/hardware-data", async (req, res) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      res.json(data);
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hardware data" });
  }
});

export default router;
