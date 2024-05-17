const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const AlunosApplication = require("./src/applications/AlunosApplication/AlunosApplication.js");
const ReservaApplication = require("./src/applications/ReservaApplication/ReservaApplication.js");
const CentroEsportivoApplication = require("./src/applications/CentroEsportivoApplication/CentroEsportivoApplication.js");
const HorariosApplication = require("./src/applications/HorariosApplication/HorariosApplication.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.URL,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");

  init();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//TODO: figure out how to create multiple tables in a clean way
function init() {
  console.log("Initializing applications");
  let alunosApp = new AlunosApplication(app, db);
  let reservaApp = new ReservaApplication(app, db);
  let centroEsportApp = new CentroEsportivoApplication(app, db);
  let horariosApp = new HorariosApplication(app, db);
}
