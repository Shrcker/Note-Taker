const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
const PORT = 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

// Using regular expressions to accept routes that begin ( ^ ) then end ( $ )
// with a forward slash, or ( | ) if index.html is directly requested.
// Using .html in the request is optional ( ()? ).
app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.get("/notes(.html)?", (req, res) => {
  res.sendFile("./public/notes.html", { root: __dirname });
});

app.post("api/notes(.html)?", (req, res) => {
  console.info(`${req.method} request received to add a review`);
});

// app.post("/notes", (req, res) => {
//   const { title, text } = req.body;

//   res.json(`${req.method} request received`);
//   console.info(req.rawHeaders);
//   console.info(`${req.method} request received`);
// });

app.listen(PORT, () => {
  console.log(`Stand-in listening message at http://localhost:${PORT}`);
});
