/*import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

// Helper to resolve __dirname in ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse service account JSON
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, "../private.key"), "utf-8")
);

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://agnidrishti-39a07-default-rtdb.asia-southeast1.firebasedatabase.app", // replace if needed
});

const db = getDatabase();
export default db;
*/
