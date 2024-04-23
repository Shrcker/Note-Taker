const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const util = require("util");

app.use(express.json());
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
const readFromFile = util.promisify(fs.readFile);

const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (error, data) => {
    if (error) {
      console.error(error);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      fs.writeFile(file, JSON.stringify(parsedData, null, 4), (error) => {
        error ? console.error(error) : console.info(`\nData written to ${file}`);
      });
    }
  });
};

app.get("/notes(.html)?", (req, res) => {
  res.sendFile("./public/notes.html", { root: __dirname });
});

app.get("/api/notes", (req, res) => {
  readFromFile("./db/notes.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const database = readFromFile("./db/notes.json").then((data) => {
    const database = JSON.parse(data);

    if ((title, text)) {
      const newNote = {
        title,
        text,
        id: Date.now(),
      };
      const response = {
        status: "Successfully saved note!",
        body: newNote,
      };

      readAndAppend(newNote, "./db/notes.json");
      res.json(response);
    } else {
      res.json("Error in saving note");
    }
  });
});

app.delete("/api/notes/*", (req, res) => {
  const originalUrl = req.originalUrl;
  const requestId = originalUrl.match(/\d+/g, "")[0];
  const notes = "./db/notes.json";

  const parseRequest = readFromFile(notes).then((data) => {
    const database = JSON.parse(data);

    database.forEach((note) => {
      if (note.id == requestId) {
        const updatedDatabase = database.toSpliced(note, 1);

        fs.writeFile(notes, JSON.stringify(updatedDatabase, null, 4), (error) => {
          error ? console.error(error) : console.info(`\nData removed from ${notes}`);
          res.json(updatedDatabase);
        });
      }
    });
  });
});

app.get("*", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
