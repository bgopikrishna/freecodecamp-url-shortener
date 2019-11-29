const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded());

app.use(cors({ optionSuccessStatus: 200 }));

mongoose
  .connect(
    "mongodb+srv://mistborn:fccDatabase@personalcluster-gx87z.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch(err => {
    console.log("Error mongodb", err);
  });

const shortUrlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

let idTracking = 0;

const ShortUrl = mongoose.model("ShortUrls", shortUrlSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new", (req, res) => {
  const url = req.body.url;

  const isValidUrl = verifyValidyofUrl(url);

  if (isValidUrl) {
    createShortUrl(url).then(newShortendUrl => {
      res.send(newShortendUrl);
    });
  } else {
    res.send({
      error: "No short url found for given input"
    });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const shortUrlId = parseInt(req.params.id);
  getUrl(shortUrlId).then(urlObj => {
    if (urlObj && urlObj.original_url) {
      res.redirect(urlObj.original_url);
    } else {
      res.send({
        error: "No short url found for given input"
      });
    }
  });
});

const port = process.env.PORT || 4000;
var listener = app.listen(port, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

async function createShortUrl(url) {
  idTracking++;
  const newUrl = new ShortUrl({
    original_url: url,
    short_url: Math.floor(Math.random() * 10)
  });

  const result = await newUrl.save();
  return result;
}

async function getUrl(id) {
  console.log("getting url", id);
  const url = await ShortUrl.find({ short_url: id });
  console.log("got url", url);
  return url[0];
}

function verifyValidyofUrl(url) {
  const urlRegex = /(http[s]?:\/\/)?[^\s(["<,>]*\.[^\s[",><]*/gim;
  const isValidUrl = urlRegex.test(url);
  return isValidUrl;
}
