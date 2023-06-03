const express = require("express");
const app = express();

const path = require("path");

const helmet = require("helmet");

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(helmet());
app.disable("x-powered-by");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`React app listening at http://localhost:${port}`);
});
