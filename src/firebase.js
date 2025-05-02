// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDejaWKXhLYfzZCmkxQ1tqoTKcUCqI_erw",
  authDomain: "agnidrishti-39a07.firebaseapp.com",
  databaseURL: "https://agnidrishti-39a07-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agnidrishti-39a07",
  storageBucket: "agnidrishti-39a07.appspot.com",
  messagingSenderId: "791991470351",
  appId: "1:791991470351:web:c743c1391883f3c32f567a",
  measurementId: "G-S3Y7NNQ5LD"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;
