const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: "./config/.env" });

const machinesRoute = require("./routes/machines.route");
const capteursRoute = require("./routes/capteurs.route");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use("/api/machines", machinesRoute);
app.use("/api/capteurs", capteursRoute);
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, process.env.IMAGE_STORAGE_PATH))
);

app.listen(process.env.PORT || process.env.IP_HOST, () => {
  console.log(`Lancé sur ${process.env.IP_HOST}:${process.env.PORT} .... `);
});
