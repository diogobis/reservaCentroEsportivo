"use strict";

const BaseApplication = require("../BaseApplication/BaseApplication");

class AlunosApplication extends BaseApplication {
  constructor(app, db) {
    super(app, db, "alunos");

    app.get("/alunos/filtroNome", (req, res) => {
      let filter = req.query && req.query.nome ? req.query.nome : null;

      if (filter === null) return [];

      let sql = `SELECT * FROM alunos WHERE nome LIKE '%${filter}%'`;
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });
  }
}

module.exports = AlunosApplication;
