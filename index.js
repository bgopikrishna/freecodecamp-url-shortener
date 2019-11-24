const express = require("express");
const cors = require("cors");

const shortUrls = [
  {
    original_url: "https://bgopikrishna.me",
    short_url: 1
  }
];

const app = express();
app.use(express.urlencoded());

app.use(cors({ optionSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new", (req, res) => {
  const url = req.body.url;

  const isValidUrl = verifyValidyofUrl(url);

  if (isValidUrl) {
    const newShortendUrl = {
      original_url: url,
      short_url: shortUrls.length + 1
    };
    shortUrls.push(newShortendUrl);
    res.send(newShortendUrl);
  } else {
    res.send({
      error: "No short url found for given input"
    });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const shortUrlId = parseInt(req.params.id);
  const urlObj = shortUrls.find(url => parseInt(url.short_url) === shortUrlId);
  if (urlObj) {
    res.redirect(urlObj.original_url);
  } else {
    res.send({
      error: "No short url found for given input"
    });
  }

  res.end();
});

const port = process.env.PORT || 4000;
var listener = app.listen(port, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

function verifyValidyofUrl(url) {
  const urlRegex = /(http[s]?:\/\/)?[^\s(["<,>]*\.[^\s[",><]*/gim;
  const isValidUrl = urlRegex.test(url);
  return isValidUrl;
}
