import express from "express";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Contact from "../models/Contact.model.js";
const router = express.Router();

router.post("/postuser", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.create({ name, email, phone });
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/postcontact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const contact = await Contact.create({
      name,
      email,
      phone,
      whosecontact: id,
    });
    return res.status(200).send(contact);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.get("/getuser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const contacts = await Contact.find({ whosecontact: id });
    return res.status(200).json({ message: "success", user, contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

export default router;
