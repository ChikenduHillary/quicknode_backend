const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const corsOptions = {
  origin: "",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

function processData(message) {
  // Decompress and convert message to JSON
  // Return processed data

  return message;
}

app.use(express.static(path.join(__dirname, "dist")));

app.use(
  express.static(path.join(__dirname, "assets"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);
// Catch-all route to serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/webhook", (req, res) => {
  message = req.body;
  console.log("Received a POST request");
  console.log("Headers:", req.headers);
  console.log("Received message:", message);

  if (!req.body) {
    return res.sendStatus(400);
  }

  const processedData = processData(message);
  // Emit the data to all connected clients
  io.emit("streamData", processedData);

  res.status(200).end("Message received");
});

const port = 3000;

server.listen(port, () => console.log(`App is listening on port ${port}`));
