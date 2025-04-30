import express from "express";
import dotenv from "dotenv";
import twilioPkg from "twilio";
import messagebird from "messagebird";
import axios from "axios";
import { Vonage } from "@vonage/server-sdk";

dotenv.config();

const { Twilio } = twilioPkg;
const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Message service is running.");
});

router.post("/send-sms", async (req, res) => {
  const { toNumber, message } = req.body;

  try {
    const sms = await client.messages.create({
      body: message,
      to: toNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.json({ success: true, sid: sms.sid });
  } catch (error) {
    console.error("Twilio error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

import fs from 'fs';
const privateKey = fs.readFileSync('private.key', 'utf-8');
const vonage = new Vonage({
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: privateKey
});


router.post("/initiate-call-vonage", async (req, res) => {
  console.log('====================================');
  console.log(privateKey);
  console.log('====================================');
  const { targetNumber, message } = req.body;
  
  // Ensure phone number has international format
  const formattedNumber = targetNumber.startsWith('+') ? 
    targetNumber : `+${targetNumber}`;
  
  try {
    console.log("Attempting to make voice call via Vonage:", formattedNumber);
    
    // Create NCCO (Nexmo Call Control Object)
    const ncco = [
      {
        "action": "talk",
        "text": message,
        "voiceName": "Aditi", // Indian English voice
        "language": "en-IN"
      }
    ];
    
    // Make the call
    vonage.voice.createOutboundCall({
      to: [{
        type: 'phone',
        number: formattedNumber.replace('+', '')
      }],
      from: {
        type: 'phone',
        number: process.env.VONAGE_VIRTUAL_NUMBER.replace('+', '')
      },
      ncco: ncco
    })
    .then(resp => {
      console.log("Vonage call initiated:", resp);
      res.json({
        success: true,
        callId: resp.uuid,
        details: resp
      });
    })
    .catch(err => {
      console.error("Vonage error:", err);
      res.status(500).json({ 
        success: false, 
        error: err.message
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});
router.post("/initiate-call-otp", async (req, res) => {
  const { targetNumber, message } = req.body;
  
  const formattedNumber = targetNumber.startsWith('+91') ? 
    targetNumber.substring(3) : targetNumber;
  
  try {
    console.log("Attempting to make voice call via 2Factor.in:", formattedNumber);
    
    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/VOICE/${formattedNumber}/${encodeURIComponent(message)}`
    );
    
    console.log("2Factor.in response:", response.data);
    
    if (response.data && response.data.Status === "Success") {
      res.json({
        success: true,
        details: response.data,
        message: "Voice call initiated successfully"
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: response.data
      });
    }
  } catch (error) {
    console.error("2Factor.in error:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      success: false, 
      error: error.response ? error.response.data : error.message 
    });
  }
});

router.post("/", (req, res) => {});
export default router;
