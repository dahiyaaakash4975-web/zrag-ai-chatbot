const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

// Image upload
const upload = multer({ dest: "uploads/" });

// Memory
let conversations = {};
let chatTitles = {};

// CHAT
app.post("/chat", async (req, res) => {
  const { message, chatId } = req.body;

  if (!conversations[chatId]) {
    conversations[chatId] = [];
  }

  if (!chatTitles[chatId]) {
    chatTitles[chatId] = message.slice(0, 30);
  }

  conversations[chatId].push({ role: "user", content: message });

  const history = conversations[chatId]
    .slice(-6)
    .map(m => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
    .join("\n");

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "phi",
      prompt: `You are ZRAG AI (shoe assistant).\n${history}\nAI:`,
      stream: false
    });

    const reply = response.data.response;

    conversations[chatId].push({ role: "ai", content: reply });

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "AI error ⚠️" });
  }
});

// IMAGE UPLOAD
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ reply: "Nice image 👟 Looks stylish!" });
});

// CHAT LIST
app.get("/chats", (req, res) => {
  const result = Object.keys(conversations).map(id => ({
    id,
    title: chatTitles[id]
  }));
  res.json(result);
});

// CHAT HISTORY
app.get("/chat/:id", (req, res) => {
  res.json(conversations[req.params.id] || []);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000 🚀");
});