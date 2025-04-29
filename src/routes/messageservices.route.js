import express from "express";
import dotenv from "dotenv";
import twilioPkg from "twilio";

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

router.get("/dynamic-twiml", (req, res) => {
  const targetNumber = req.query.targetNumber;
  const message = req.query.message;

  const twiml = new twilioPkg.twiml.VoiceResponse();
  twiml.say({ voice: "alice" }, message);
  twiml.dial().number(targetNumber); // ✅ this is better than directly dialing

  res.setHeader("Content-Type", "text/xml");
  res.write(""); // Ensure no previous content is written
  
  res.type("text/xml");
  console.log(twiml.toString());
  res.send(twiml.toString());
});

router.post("/status-callback", (req, res) => {
  console.log("📞 Call Status:", req.body.CallStatus);
  console.log("From:", req.body.From, "To:", req.body.To);
  res.sendStatus(200);
});

router.post("/initiate-call", async (req, res) => {
  const { targetNumber, message } = req.body;

  try {
    const call = await client.calls.create({
      url: `${
        process.env.SERVER_URL
      }/dynamic-twiml?targetNumber=${targetNumber}&message=${encodeURIComponent(
        message
      )}`,
      to: targetNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      // 👇 Status callback added here
      statusCallback: `${process.env.SERVER_URL}/status-callback`,
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      statusCallbackMethod: "POST",
    });

    res.json({
      success: true,
      callSid: call.sid,
      callStatus: call.status,
      callTo: call.to,
      callFrom: call.from,
      callUrl: call.url,
      fullcall: call,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", (req, res) => {});
export default router;
